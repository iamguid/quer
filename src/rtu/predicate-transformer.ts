import {createTransformer} from "../transformer";
import {MakeSimpleDsl} from "./dsl";

export const predicateTransformer = createTransformer<MakeSimpleDsl, (entity: any) => boolean>()

predicateTransformer.handleAnd((node, t, ctx) => {
    return (entity) => node.operands.every(child => t.transformAny(child, ctx)(entity))
})

predicateTransformer.handleOr((node, t, ctx) => {
    return (entity) => node.operands.some(child => t.transformAny(child, ctx)(entity))
})

predicateTransformer.handleEq((node, t, ctx) => {
    return (entity) => entity[node.args.field] === node.args.value
})

predicateTransformer.handleNe((node, t, ctx) => {
    return (entity) => entity[node.args.field] !== node.args.value
})

predicateTransformer.handleGe((node, t, ctx) => {
    return (entity) => entity[node.args.field] >= node.args.value
})

predicateTransformer.handleLe((node, t, ctx) => {
    return (entity) => entity[node.args.field] <= node.args.value
})

predicateTransformer.handleGt((node, t, ctx) => {
    return (entity) => entity[node.args.field] > node.args.value
})

predicateTransformer.handleLt((node, t, ctx) => {
    return (entity) => entity[node.args.field] < node.args.value
})

predicateTransformer.handleIn((node, t, ctx) => {
    return (entity) => node.args.values.some(v => v === entity[node.args.field])
})

predicateTransformer.handleNin((node, t, ctx) => {
    return (entity) => !node.args.values.some(v => v === entity[node.args.field])
})
