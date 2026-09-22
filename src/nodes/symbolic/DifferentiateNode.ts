import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import nerdamer from 'nerdamer-prime';
import 'nerdamer-prime/Calculus';

export class DifferentiateNode extends BaseNode {
    readonly typeId = 'math-differentiate';
    readonly displayName = 'Differentiate';
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
        { name: 'order', label: 'Order', type: 'number', defaultValue: 1, min: 1 }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const variable = (properties['variable'] as string)?.trim() || 'x';
        const order = Number(properties['order']) || 1;

        if (!exprStr) return { 'Expression': null };

        try {
            const derived = nerdamer(`diff(${exprStr}, ${variable}, ${order})`);
            return {
                'Expression': { isExpression: true, source: derived.text() }
            };
        } catch (e) {
            console.error('Error differentiating expression:', e);
            return { 'Expression': null };
        }
    }
}
