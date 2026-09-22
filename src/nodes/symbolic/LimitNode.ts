import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import nerdamer from 'nerdamer-prime';
import 'nerdamer-prime/Calculus';

export class LimitNode extends BaseNode {
    readonly typeId = 'math-limit';
    readonly displayName = 'Limit';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Expression', outputType: 'core:expression' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'variable', label: 'Variable', type: 'string', defaultValue: 'x' },
        { name: 'point', label: 'Approaching', type: 'string', defaultValue: '0' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const variable = (properties['variable'] as string)?.trim() || 'x';
        const point = (properties['point'] as string)?.trim() || '0';

        if (!exprStr) return { 'Expression': null };

        try {
            const limitVal = nerdamer(`limit(${exprStr}, ${variable}, ${point})`);
            return {
                'Expression': { isExpression: true, source: limitVal.text() }
            };
        } catch (e) {
            console.error('Error computing limit:', e);
            return { 'Expression': null };
        }
    }
}
