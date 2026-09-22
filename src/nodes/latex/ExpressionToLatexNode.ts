import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';

export class ExpressionToLatexNode extends BaseNode {
    readonly typeId = 'math-expression-to-latex';
    readonly displayName = 'Expression to LaTeX';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'LaTeX', outputType: 'core:string' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'implicit', label: 'Implicit Multiplication', type: 'select' as any, options: [
            { value: 'hide', label: 'Hide' },
            { value: 'space', label: 'Space' },
            { value: '\\cdot', label: 'Dot' }
        ], defaultValue: 'hide' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        if (!exprStr) return { 'LaTeX': '' };

        const implicit = properties['implicit'] || 'hide';

        try {
            const node = math.parse(exprStr);
            const tex = node.toTex({ implicit });
            return { 'LaTeX': tex };
        } catch (e) {
            console.error('Error generating LaTeX:', e);
            return { 'LaTeX': '' };
        }
    }
}
