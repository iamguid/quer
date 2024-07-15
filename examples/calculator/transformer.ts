import {createTransformer} from "../../src/transformer";
import {MyDsl} from "./dsl";

const sub = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    let total = arr[0];
    for (let i = 1; i < arr.length; i++) total -= arr[i];
    return total;
}

const sum = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    let total = arr[0];
    for (let i = 1; i < arr.length; i++) total += arr[i];
    return total;
}

export const calculatorTransformer = createTransformer<MyDsl, number>()

calculatorTransformer.handleVal((node) => {
    return node.args.value
})

calculatorTransformer.handleAdd((node, t, ctx) => {
    return sum(node.operands.map(child => t.transformAny(child, ctx)))
})

calculatorTransformer.handleSub((node, t, ctx) => {
    return sub(node.operands.map(child => t.transformAny(child, ctx)))
})
