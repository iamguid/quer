import {createTransformer} from "../../src/transformer";
import {DSLNodeWithFieldValue} from "../../src/dsl";
import {MyDsl} from "./dsl";

export const sqlTransformer = createTransformer<MyDsl, string>()

const handleOperator = (op: string, node: DSLNodeWithFieldValue<any>, ctx: MyDsl['context']) => {
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
    return `SELECT * FROM '${ctx.table}' WHERE ${t.transformAny(node, ctx)}`
})

sqlTransformer.handleAnd((node, t, ctx) => {
    return `(${node.operands.map(child => t.transformAny(child, ctx)).join(' AND ')})`
})

sqlTransformer.handleOr((node, t, ctx) => {
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
