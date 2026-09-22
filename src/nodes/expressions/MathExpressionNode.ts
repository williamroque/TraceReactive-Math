import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';

export class MathExpressionNode extends BaseNode {
    readonly typeId = 'math-expression';
    readonly displayName = 'Math Expression';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [];
    readonly outputs: OutputDefinition[] = [
        { name: 'Expression', outputType: 'core:expression' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'expression', label: 'Expression', type: 'expression', defaultValue: 'x^2 + y' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const expr = (properties['expression'] as string) || '';
        return {
            'Expression': { isExpression: true, source: expr }
        };
    }
}
