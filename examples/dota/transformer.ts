import {createTransformer} from "../../src/transformer";
import {Dsl} from "./dsl";
import {Event} from "./types";

export const predicateTransformer = createTransformer<Dsl, (row: Event) => boolean>()

predicateTransformer.handleAnd((node, t) => {
    return (row) => node.children.every(child => t.transform(child)(row))
})

predicateTransformer.handleOr((node, t) => {
    return (row) => node.children.some(child => t.transform(child)(row))
})

predicateTransformer.handleEq((node, t) => {
    return (row) => (row as any)[node.field] === node.value
})

predicateTransformer.handleInRange((node, t) => {
    return (row) => row[node.field] >= node.range.begin && row[node.field] <= node.range.end
})
