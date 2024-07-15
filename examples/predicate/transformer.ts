import {createTransformer} from "../../src/transformer";
import {MyDsl, User} from "./dsl";

export const calculatorTransformer = createTransformer<MyDsl, (row: User) => boolean>()

calculatorTransformer.handleAnd((node, t, ctx) => {
    return (row) => node.operands.every(child => t.transformAny(child, ctx)(row))
})

calculatorTransformer.handleOr((node, t, ctx) => {
    return (row) => node.operands.some(child => t.transformAny(child, ctx)(row))
})

calculatorTransformer.handleEq((node) => {
    return (row) => row[node.args.field] === node.args.value
})

calculatorTransformer.handleNe((node) => {
    return (row) => row[node.args.field] !== node.args.value
})
