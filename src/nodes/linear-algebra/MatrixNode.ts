import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';

export class MatrixNode extends BaseNode {
    readonly typeId = 'math-matrix';
    readonly displayName = 'Matrix';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Array', acceptsType: 'core:array' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Matrix', outputType: 'core:any' },
        { name: 'Array', outputType: 'core:array' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'reshapeX', label: 'Reshape X', type: 'number', defaultValue: 0 },
        { name: 'reshapeY', label: 'Reshape Y', type: 'number', defaultValue: 0 }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const arr = inputs['Array'];
        if (!Array.isArray(arr)) return { 'Matrix': null, 'Array': null };

        try {
            let m = math.matrix(arr);
            const rx = Number(properties['reshapeX']) || 0;
            const ry = Number(properties['reshapeY']) || 0;

            if (rx > 0 && ry > 0) {
                m = math.reshape(m, [rx, ry]);
            }

            return {
                'Matrix': m,
                'Array': m.toArray()
            };
        } catch (e) {
            console.error('Error creating matrix:', e);
            return { 'Matrix': null, 'Array': null };
        }
    }
}
