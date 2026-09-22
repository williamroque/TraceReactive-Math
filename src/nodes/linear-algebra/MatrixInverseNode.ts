import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition } from '@tracereactive/types';
import { MatrixMathCategory } from '../../category';
import * as math from 'mathjs';

export class MatrixInverseNode extends BaseNode {
    readonly typeId = 'math-matrix-inverse';
    readonly displayName = 'Inverse Matrix';
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
            let result = math.inv(a);
            if (result && typeof (result as any).toArray === 'function') {
                result = (result as any).toArray();
            }
            return { 'Result': result };
        } catch (e) {
            console.error('Error in inverse operation:', e);
            return { 'Result': null };
        }
    }
}
