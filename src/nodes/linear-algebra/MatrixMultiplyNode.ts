import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition } from '@tracereactive/types';
import { MatrixMathCategory } from '../../category';
import * as math from 'mathjs';

export class MatrixMultiplyNode extends BaseNode {
    readonly typeId = 'math-matrix-multiply';
    readonly displayName = 'Multiply Matrices';
    readonly category = MatrixMathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'A', acceptsType: ['math:matrix', 'core:number-array'] },
        { name: 'B', acceptsType: ['math:matrix', 'core:number-array'] }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'math:matrix' }
    ];
    
    readonly properties = [];

    async evaluate(inputs: Record<string, any>): Promise<Record<string, any>> {
        const a = inputs['A'];
        const b = inputs['B'];
        try {
            if (!a || !b) return { 'Result': null };
            let result = math.multiply(a, b);
            if (result && typeof (result as any).toArray === 'function') {
                result = (result as any).toArray();
            }
            return { 'Result': result };
        } catch (e) {
            console.error('Error in matrix multiply operation:', e);
            return { 'Result': null };
        }
    }
}
