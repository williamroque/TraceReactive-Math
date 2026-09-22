import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import nerdamer from 'nerdamer-prime';
import 'nerdamer-prime/Algebra';
import 'nerdamer-prime/Calculus';
import 'nerdamer-prime/Solve';

export class SolveNode extends BaseNode {
    readonly typeId = 'math-solve';
    readonly displayName = 'Solve';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Equation', acceptsType: 'core:expression' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Roots', outputType: 'core:array' },
        { name: 'Expression', outputType: 'core:expression' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'variable', label: 'Solve For', type: 'string', defaultValue: 'x' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Equation'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const variable = (properties['variable'] as string)?.trim() || 'x';

        if (!exprStr) return { 'Roots': null, 'Expression': null };

        try {
            const solution = (nerdamer as any).solve(exprStr, variable);
            const rootsArray = solution.elements ? solution.elements.map((el: any) => el.text()) : [];
            
            return {
                'Roots': rootsArray,
                'Expression': { isExpression: true, source: solution.text() }
            };
        } catch (e) {
            console.error('Error solving equation:', e);
            return { 'Roots': null, 'Expression': null };
        }
    }
}
