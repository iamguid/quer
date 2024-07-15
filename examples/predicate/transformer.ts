import {createTransformer} from "../../src/transformer";
import {MyDsl, User} from "./dsl";

export const predicateTransformer = createTransformer<MyDsl, (row: User) => boolean>()

predicateTransformer.handleAnd((node, t, ctx) => {
    return (row) => node.operands.every(child => t.transformAny(child, ctx)(row))
})

predicateTransformer.handleOr((node, t, ctx) => {
    return (row) => node.operands.some(child => t.transformAny(child, ctx)(row))
})

predicateTransformer.handleEq((node) => {
    return (row) => row[node.args.field] === node.args.value
})

predicateTransformer.handleNe((node) => {
    return (row) => row[node.args.field] !== node.args.value
})
