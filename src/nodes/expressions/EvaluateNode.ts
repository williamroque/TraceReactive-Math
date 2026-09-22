import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';
import * as math from 'mathjs';
import * as aq from 'arquero';

export class EvaluateNode extends BaseNode {
    readonly typeId = 'math-evaluate';
    readonly displayName = 'Evaluate';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'Expression', acceptsType: 'core:expression' },
        { name: 'Data', acceptsType: 'core:number-array' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'core:dataframe' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'variable', label: 'Variable', type: 'string', defaultValue: 'x' },
        { name: 'variableColumn', label: 'Variable Column', type: 'string', defaultValue: 'x' },
        { name: 'resultColumn', label: 'Result Column', type: 'string', defaultValue: 'y' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const data = inputs['Data'];
        const variable = (properties['variable'] as string)?.trim() || 'x';
        const variableColumn = (properties['variableColumn'] as string)?.trim() || 'x';
        const resultColumn = (properties['resultColumn'] as string)?.trim() || 'y';

        if (!exprStr) {
            return { 'Result': { __arqueroData: { [variableColumn]: [], [resultColumn]: [] } } };
        }

        let compiled;
        try {
            compiled = math.compile(exprStr);
        } catch (e) {
            console.error('Error compiling expression:', e);
            return { 'Result': { __arqueroData: { [variableColumn]: [], [resultColumn]: [] } } };
        }

        if (data === undefined || data === null) {
            let res;
            try {
                res = compiled.evaluate();
            } catch (e) {
                res = NaN;
            }
            const tableData = { [resultColumn]: [res] };
            return { 'Result': { __arqueroData: tableData } };
        }

        if (typeof data === 'number') {
            let res;
            try {
                res = compiled.evaluate({ [variable]: data });
            } catch (e) {
                res = NaN;
            }
            const tableData = { [variableColumn]: [data], [resultColumn]: [res] };
            return { 'Result': { __arqueroData: tableData } };
        }

        let rows: any[] = [];
        
        if (Array.isArray(data)) {
            rows = data;
        } else if (data && typeof data.objects === 'function') {
            rows = data.objects();
        } else if (data.Data && typeof data.Data.objects === 'function') {
            rows = data.Data.objects();
        } else {
            return { 'Result': { __arqueroData: { [variableColumn]: [], [resultColumn]: [] } } };
        }

        const outRows = rows.map(item => {
            const isPlainObject = typeof item === 'object' && item !== null && !Array.isArray(item);
            const scope = isPlainObject ? { ...item, [variable]: item } : { [variable]: item };
            let res: any;
            try {
                res = compiled.evaluate(scope);
            } catch {
                res = NaN;
            }
            if (res === undefined) {
                res = null;
            }
            return isPlainObject
                ? { ...item, [resultColumn]: res }
                : { [variableColumn]: item, [resultColumn]: res };
        });

        const tableData = outRows.length > 0 ? outRows : { [variableColumn]: [], [resultColumn]: [] };
        return { 
            'Result': { __arqueroData: tableData }
        };
    }
}
