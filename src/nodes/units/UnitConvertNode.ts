import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';

export class UnitConvertNode extends BaseNode {
    readonly typeId = 'math-unit-convert';
    readonly displayName = 'Unit Convert';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Value', acceptsType: 'core:any' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'core:number' },
        { name: 'Unit String', outputType: 'core:string' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'sourceUnit', label: 'Source Unit', type: 'string', defaultValue: 'km/h', description: 'e.g. m, kg, s, km/h. Leave empty if input is already a unit string like "5 km"' },
        { name: 'targetUnit', label: 'Target Unit', type: 'string', defaultValue: 'm/s' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const val = inputs['Value'];
        const srcUnit = (properties['sourceUnit'] as string)?.trim() || '';
        const tgtUnit = (properties['targetUnit'] as string)?.trim() || '';

        if (val === undefined || val === null || !tgtUnit) {
            return { 'Result': null, 'Unit String': '' };
        }

        try {
            let unitObj;
            if (typeof val === 'string' && !srcUnit) {
                unitObj = math.unit(val);
            } else if (typeof val === 'number' && srcUnit) {
                unitObj = math.unit(val, srcUnit);
            } else {
                return { 'Result': null, 'Unit String': '' };
            }

            const converted = unitObj.to(tgtUnit);
            return {
                'Result': converted.toNumber(),
                'Unit String': converted.format()
            };
        } catch (e) {
            console.error('Error converting units:', e);
            return { 'Result': null, 'Unit String': '' };
        }
    }
}
