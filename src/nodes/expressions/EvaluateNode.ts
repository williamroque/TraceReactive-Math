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
        { name: 'Data', acceptsType: 'any' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Result', outputType: 'any' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'variable', label: 'Variable', type: 'string', defaultValue: 'x' },
        { name: 'resultColumn', label: 'Result Column', type: 'string', defaultValue: 'y' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const exprInput = inputs['Expression'];
        const exprStr = (typeof exprInput === 'string' ? exprInput : exprInput?.source) || '';
        const data = inputs['Data'];
        const variable = (properties['variable'] as string)?.trim() || 'x';
        const resultColumn = (properties['resultColumn'] as string)?.trim() || 'y';

        if (!exprStr) return { 'Result': null };

        let compiled;
        try {
            compiled = math.compile(exprStr);
        } catch (e) {
            console.error('Error compiling expression:', e);
            return { 'Result': null };
        }

        if (data === undefined || data === null) {
            try {
                return { 'Result': compiled.evaluate() };
            } catch (e) {
                return { 'Result': NaN };
            }
        }

        if (typeof data === 'number') {
            try {
                return { 'Result': compiled.evaluate({ [variable]: data }) };
            } catch (e) {
                return { 'Result': NaN };
            }
        }

        let isTable = false;
        let rows: any[] = [];
        
        if (Array.isArray(data)) {
            rows = data;
        } else if (data && typeof data.objects === 'function') {
            isTable = true;
            rows = data.objects();
        } else if (data.Data && typeof data.Data.objects === 'function') {
            isTable = true;
            rows = data.Data.objects();
        } else {
            return { 'Result': null };
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
                : { [variable]: item, [resultColumn]: res };
        });

        if (isTable) {
            const table = outRows.length > 0 ? aq.from(outRows) : aq.from({ [variable]: [], [resultColumn]: [] });
            return { 
                'Result': table,
                type: 'core:dataframe',
                content: table
            };
        }

        return { 'Result': outRows };
    }
}
