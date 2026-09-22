import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import nerdamer from 'nerdamer-prime';
import 'nerdamer-prime/Calculus';

export class IntegrateNode extends BaseNode {
    readonly typeId = 'math-integrate';
    readonly displayName = 'Integrate';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Expression', outputType: 'core:expression' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'variable', label: 'Variable', type: 'string', defaultValue: 'x' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const variable = (properties['variable'] as string)?.trim() || 'x';

        if (!exprStr) return { 'Expression': null };

        try {
            const integrated = nerdamer(`integrate(${exprStr}, ${variable})`);
            return {
                'Expression': { isExpression: true, source: integrated.text() }
            };
        } catch (e) {
            console.error('Error integrating expression:', e);
            return { 'Expression': null };
        }
    }
}
