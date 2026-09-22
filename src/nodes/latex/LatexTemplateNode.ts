import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';

export class LatexTemplateNode extends BaseNode {
    readonly typeId = 'math-latex-template';
    readonly displayName = 'LaTeX Template';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [];
    readonly dynamicInputs = { baseName: 'Var', acceptsType: 'core:any' };
    
    readonly outputs: OutputDefinition[] = [
        { name: 'LaTeX', outputType: 'core:string' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'template', label: 'Template', type: 'text' as any, defaultValue: 'f(x) = %{1}' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        let template = String(properties['template'] || '');
        
        for (let i = 1; i <= 20; i++) {
            const key = `Var ${i}`;
            if (inputs[key] !== undefined) {
                const val = String(inputs[key]);
                template = template.split(`%{${i}}`).join(val);
            }
        }

        return { 'LaTeX': template };
    }
}
