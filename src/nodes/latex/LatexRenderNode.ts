import { RenderNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { MathCategory } from '../../category';

import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const adaptor = browserAdaptor();
RegisterHTMLHandler(adaptor);

const texInput = new TeX({ packages: AllPackages });
const svgOutput = new SVG({ fontCache: 'local' });
const html = mathjax.document('', { InputJax: texInput, OutputJax: svgOutput });

export class LatexRenderNode extends RenderNode {
    readonly typeId = 'math-latex-render';
    readonly displayName = 'LaTeX Render';
    readonly category = MathCategory;
    readonly visible = true;
    
    readonly inputs: InputDefinition[] = [
        { name: 'LaTeX', acceptsType: 'core:string' }
    ];
    
    readonly outputs: OutputDefinition[] = [
        { name: 'Render', outputType: 'render' }
    ];
    
    readonly properties: PropertyDefinition[] = [
        { name: 'fontSize', label: 'Font Size', type: 'number', defaultValue: 24 },
        { name: 'color', label: 'Text Color', type: 'style' as any, styleType: 'color', category: 'style', defaultValue: 'theme:textNormal' },
        { name: 'display', label: 'Display Mode', type: 'boolean', defaultValue: true }
    ];

    private nodeCache: Record<string, {
        texString: string;
        fontSize: number;
        color: string;
        display: boolean;
        output: any;
    }> = {};

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const texString = String(inputs['LaTeX'] || '');
        if (!texString) return {};

        const fontSize = Number(properties['fontSize']) || 24;
        const color = properties['color'] || '#ffffff';
        const display = !!properties['display'];
        const nodeId = properties['_nodeId'] || 'unknown';

        const cache = this.nodeCache[nodeId];
        if (cache && 
            cache.texString === texString && 
            cache.fontSize === fontSize && 
            cache.color === color && 
            cache.display === display) {
            return cache.output;
        }

        try {
            const node = html.convert(texString, { display });
            const svgNode = adaptor.firstChild(node);
            
            adaptor.setAttribute(svgNode, 'fill', color);
            adaptor.setAttribute(svgNode, 'stroke', 'none');
            adaptor.setAttribute(svgNode, 'style', `font-size: ${fontSize}px;`);
            
            const svgString = adaptor.outerHTML(svgNode);

            const renderData = { type: 'core:svg', content: svgString };
            const output = {
                'Render': renderData,
                type: 'core:svg',
                content: svgString
            };
            
            this.nodeCache[nodeId] = {
                texString,
                fontSize,
                color,
                display,
                output
            };
            
            return output;
        } catch (e) {
            console.error('Error rendering LaTeX:', e);
            return {};
        }
    }
}
