import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition } from '@tracereactive/types';
import { MatrixMathCategory } from '../../category';
import * as math from 'mathjs';

export class MatrixTransposeNode extends BaseNode {
    readonly typeId = 'math-matrix-transpose';
    readonly displayName = 'Transpose Matrix';
    readonly category = MatrixMathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'A', acceptsType: ['math:matrix', 'core:array'] }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'math:matrix' }
    ];
    
    readonly properties = [];

    async evaluate(inputs: Record<string, any>): Promise<Record<string, any>> {
        const a = inputs['A'];
        try {
            if (!a) return { 'Result': null };
            let result = math.transpose(a);
            if (result && typeof (result as any).toArray === 'function') {
                result = (result as any).toArray();
            }
            return { 'Result': result };
        } catch (e) {
            console.error('Error in transpose operation:', e);
            return { 'Result': null };
        }
    }
}
