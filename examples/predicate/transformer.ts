import {createTransformer} from "../../src/transformer";
import {MyDsl, User} from "./dsl";

export const calculatorTransformer = createTransformer<MyDsl, (row: User) => boolean>()

calculatorTransformer.handleAnd((node, t) => {
    return (row) => node.operands.every(child => t.transform(child)(row))
})

calculatorTransformer.handleOr((node, t) => {
    return (row) => node.operands.some(child => t.transform(child)(row))
})

calculatorTransformer.handleEq((node, t) => {
    return (row) => row[node.args.field] === node.args.value
})

calculatorTransformer.handleNe((node, t) => {
    return (row) => row[node.args.field] !== node.args.value
})
