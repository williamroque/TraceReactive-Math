import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';

export class EvaluateScalarNode extends BaseNode {
    readonly typeId = 'math-evaluate-scalar';
    readonly displayName = 'Evaluate—Scalar';
    readonly category = MathCategory;
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' },
        { name: 'A', acceptsType: 'core:number' },
        { name: 'B', acceptsType: 'core:number' },
        { name: 'C', acceptsType: 'core:number' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'core:number' }
    ];

    readonly properties: PropertyDefinition[] = [
        {
            name: 'formula',
            label: 'Formula (e.g. a + b * c)',
            type: 'expression' as any, // 'expression' type triggers MathJax LaTeX preview
            defaultValue: 'a + b'
        }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        let formula = String(properties['formula'] || 'a + b');
        
        const exprInput = inputs['Expression'];
        if (exprInput) {
            formula = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || formula;
        }

        const scope = {
            a: typeof inputs['A'] === 'number' ? inputs['A'] : 0,
            b: typeof inputs['B'] === 'number' ? inputs['B'] : 0,
            c: typeof inputs['C'] === 'number' ? inputs['C'] : 0
        };

        try {
            const compiled = math.compile(formula);
            const res = compiled.evaluate(scope);
            return { Result: typeof res === 'number' ? res : NaN };
        } catch {
            return { Result: NaN };
        }
    }
}
