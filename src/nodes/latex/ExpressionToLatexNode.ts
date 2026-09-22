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
            { value: 'cdot', label: 'Dot (·)' }
        ], defaultValue: 'hide' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        if (!exprStr) return { 'LaTeX': '' };

        const implicit = properties['implicit'] || 'hide';

        try {
            const node = math.parse(exprStr);

            // mathjs toTex only distinguishes 'hide' (outputs ~) vs everything-else (outputs \cdot).
            // For 'hide' and 'space' we start from the 'hide' output and replace the ~ joiners.
            // For 'cdot' we use 'show' which natively emits \cdot.
            let tex: string;
            if (implicit === 'cdot') {
                // Let mathjs render explicit \cdot for all multiplications
                tex = node.toTex({ implicit: 'show' });
                // Also replace bare ~ from any remaining implicit nodes
                tex = tex.replace(/~/g, ' \\cdot ');
            } else if (implicit === 'space') {
                tex = node.toTex({ implicit: 'hide' });
                // Replace ~ hairspace with a medium space, and strip explicit \cdot
                tex = tex.replace(/~/g, '\\;');
                tex = tex.replace(/\\cdot/g, '\\;');
            } else {
                // 'hide' — strip both ~ and \cdot so terms are adjacent
                tex = node.toTex({ implicit: 'hide' });
                tex = tex.replace(/~/g, '');
                tex = tex.replace(/\s*\\cdot\s*/g, '');
            }

            return { 'LaTeX': tex };
        } catch (e) {
            console.error('Error generating LaTeX:', e);
            return { 'LaTeX': '' };
        }
    }
}
