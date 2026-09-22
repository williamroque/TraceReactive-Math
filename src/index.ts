import { MathExpressionNode } from './nodes/expressions/MathExpressionNode';
import { EvaluateNode } from './nodes/expressions/EvaluateNode';
import { DifferentiateNode } from './nodes/symbolic/DifferentiateNode';
import { IntegrateNode } from './nodes/symbolic/IntegrateNode';
import { SolveNode } from './nodes/symbolic/SolveNode';
import { AlgebraNode } from './nodes/symbolic/AlgebraNode';
import { LimitNode } from './nodes/symbolic/LimitNode';
import { ExpressionToLatexNode } from './nodes/latex/ExpressionToLatexNode';
import { LatexRenderNode } from './nodes/latex/LatexRenderNode';
import { LatexTemplateNode } from './nodes/latex/LatexTemplateNode';
import { MatrixNode } from './nodes/linear-algebra/MatrixNode';
import { MatrixDeterminantNode } from './nodes/linear-algebra/MatrixDeterminantNode';
import { MatrixInverseNode } from './nodes/linear-algebra/MatrixInverseNode';
import { MatrixTransposeNode } from './nodes/linear-algebra/MatrixTransposeNode';
import { MatrixTraceNode } from './nodes/linear-algebra/MatrixTraceNode';
import { MatrixAddNode } from './nodes/linear-algebra/MatrixAddNode';
import { MatrixMultiplyNode } from './nodes/linear-algebra/MatrixMultiplyNode';
import { MatrixDotProductNode } from './nodes/linear-algebra/MatrixDotProductNode';
import { MatrixCrossProductNode } from './nodes/linear-algebra/MatrixCrossProductNode';
import { UnitConvertNode } from './nodes/units/UnitConvertNode';
import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

const nodes = [
    new MathExpressionNode(),
    new EvaluateNode(),
    new DifferentiateNode(),
    new IntegrateNode(),
    new SolveNode(),
    new AlgebraNode(),
    new LimitNode(),
    new ExpressionToLatexNode(),
    new LatexRenderNode(),
    new LatexTemplateNode(),
    new MatrixNode(),
    new MatrixDeterminantNode(),
    new MatrixInverseNode(),
    new MatrixTransposeNode(),
    new MatrixTraceNode(),
    new MatrixAddNode(),
    new MatrixMultiplyNode(),
    new MatrixDotProductNode(),
    new MatrixCrossProductNode(),
    new UnitConvertNode()
];

const serializableNodes = nodes.map(n => ({
    typeId: n.typeId,
    displayName: n.displayName,
    category: n.category,
    nodeInterface: n.nodeInterface,
    visible: n.visible,
    inputs: n.inputs,
    outputs: n.outputs,
    properties: n.properties,
    dynamicInputs: n.dynamicInputs,
    dynamicOutputs: n.dynamicOutputs
}));

traceReactive.registerNodes(serializableNodes);

traceReactive.onEvaluateNode(async ({ typeId, inputs, properties }: any) => {
    const node = nodes.find(n => n.typeId === typeId);
    if (!node) {
        throw new Error(`Unknown node type: ${typeId}`);
    }
    return await node.evaluate(inputs, properties);
});
