import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import nerdamer from 'nerdamer-prime';
import 'nerdamer-prime/Algebra';
import 'nerdamer-prime/Calculus';

export class AlgebraNode extends BaseNode {
    readonly typeId = 'math-algebra';
    readonly displayName = 'Algebra';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Expression', outputType: 'core:expression' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { 
            name: 'operation', 
            label: 'Operation', 
            type: 'select' as any, 
            options: [
                { value: 'simplify', label: 'Simplify' },
                { value: 'expand', label: 'Expand' },
                { value: 'factor', label: 'Factor' },
                { value: 'partfrac', label: 'Partial Fractions' }
            ],
            defaultValue: 'simplify' 
        },
        { name: 'variable', label: 'Variable (for partfrac)', type: 'string', defaultValue: 'x' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const operation = properties['operation'] || 'simplify';
        const variable = (properties['variable'] as string)?.trim() || 'x';

        if (!exprStr) return { 'Expression': null };

        try {
            let result;
            if (operation === 'simplify') {
                result = nerdamer(exprStr);
            } else if (operation === 'expand') {
                result = nerdamer(`expand(${exprStr})`);
            } else if (operation === 'factor') {
                result = nerdamer(`factor(${exprStr})`);
            } else if (operation === 'partfrac') {
                result = nerdamer(`partfrac(${exprStr}, ${variable})`);
            } else {
                result = nerdamer(exprStr);
            }

            return {
                'Expression': { isExpression: true, source: result.text() }
            };
        } catch (e) {
            console.error(`Error in algebra operation ${operation}:`, e);
            return { 'Expression': null };
        }
    }
}
