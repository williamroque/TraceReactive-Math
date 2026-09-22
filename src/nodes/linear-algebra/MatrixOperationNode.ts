import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';

export class MatrixOperationNode extends BaseNode {
    readonly typeId = 'math-matrix-operation';
    readonly displayName = 'Matrix Operation';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'A', acceptsType: 'core:any' },
        { name: 'B', acceptsType: 'core:any' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'core:any' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'operation', label: 'Operation', type: 'select' as any, options: [
            { value: 'det', label: 'Determinant' },
            { value: 'inv', label: 'Inverse' },
            { value: 'transpose', label: 'Transpose' },
            { value: 'trace', label: 'Trace' },
            { value: 'add', label: 'Add (A+B)' },
            { value: 'multiply', label: 'Multiply (A*B)' },
            { value: 'dot', label: 'Dot Product' },
            { value: 'cross', label: 'Cross Product' }
        ], defaultValue: 'det' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const a = inputs['A'];
        const b = inputs['B'];
        const operation = properties['operation'] || 'det';

        try {
            let result;
            if (operation === 'det' && a) result = math.det(a);
            else if (operation === 'inv' && a) result = math.inv(a);
            else if (operation === 'transpose' && a) result = math.transpose(a);
            else if (operation === 'trace' && a) result = math.trace(a);
            else if (operation === 'add' && a && b) result = math.add(a, b);
            else if (operation === 'multiply' && a && b) result = math.multiply(a, b);
            else if (operation === 'dot' && a && b) result = math.dot(a, b);
            else if (operation === 'cross' && a && b) result = math.cross(a, b);
            else return { 'Result': null };

            return { 'Result': result };
        } catch (e) {
            console.error(`Error in matrix operation ${operation}:`, e);
            return { 'Result': null };
        }
    }
}
