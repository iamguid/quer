import {createTransformer} from "../transformer";
import {MakeSimpleDsl} from "./dsl";
import {DSLNodeWithFieldValue} from "../dsl";

export const sqlTransformer = createTransformer<MakeSimpleDsl, string>()

const handleOperator = (op: string, node: DSLNodeWithFieldValue<any>, ctx: MakeSimpleDsl['context']) => {
    switch (typeof node.args.value) {
        case "number":
            return `${node.args.field} ${op} ${node.args.value}`
        case "string":
            return `${node.args.field} ${op} '${node.args.value}'`
        case "boolean":
            return `${node.args.field} ${op} ${node.args.value ? 'TRUE' : 'FALSE'}`
        default:
            throw new Error(`Incorrect value type '${typeof node.args.value}'`)
    }
}

sqlTransformer.handle((node, t, ctx) => {
    return `SELECT * FROM ${ctx.tableName} WHERE ${t.transformAny(node, ctx)}`
})

sqlTransformer.handleAnd((node, t, ctx) => {
    if (node.operands.length === 0) {
        return ''
    }

    return `(${node.operands.map(child => t.transformAny(child, ctx)).join(' AND ')})`
})

sqlTransformer.handleOr((node, t, ctx) => {
    if (node.operands.length === 0) {
        return ''
    }

    return `(${node.operands.map(child => t.transformAny(child, ctx)).join(' OR ')})`
})

sqlTransformer.handleEq((node, t, ctx) => {
    return handleOperator('=', node, ctx)
})

sqlTransformer.handleNe((node, t, ctx) => {
    return handleOperator('!=', node, ctx)
})

sqlTransformer.handleGe((node, t, ctx) => {
    return handleOperator('>=', node, ctx)
})

sqlTransformer.handleLe((node, t, ctx) => {
    return handleOperator('<=', node, ctx)
})

sqlTransformer.handleGt((node, t, ctx) => {
    return handleOperator('>', node, ctx)
})

sqlTransformer.handleLt((node, t, ctx) => {
    return handleOperator('<', node, ctx)
})
