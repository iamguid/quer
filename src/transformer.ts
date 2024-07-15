import {DSL} from "./dsl";

const uppercaseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export type Transformer<TDsl extends DSL<any>, TResult> = {
    [key in keyof TDsl['nodes'] as `transform${Capitalize<key extends string ? key : '???'>}`]: (node: TDsl['nodes'][key], ctx: TDsl['context']) => TResult
} &{
    [key in keyof TDsl['nodes'] as `handle${Capitalize<key extends string ? key : '???'>}`]: (cb: (node: TDsl['nodes'][key], transformer: Transformer<TDsl, TResult>, ctx: TDsl['context']) => TResult) => TResult
} & {
    transform(node: TDsl['union'], ctx: TDsl['context']): TResult
    transformAny(node: TDsl['union'], ctx: TDsl['context']): TResult
    handle(cb: (node: TDsl['union'], transformer: Transformer<TDsl, TResult>, ctx: TDsl['context']) => TResult): TResult
}

export const createTransformer = <TDsl extends DSL<any>, TResult>(): Transformer<TDsl, TResult> => {
    const handlers: Record<string, (node: TDsl['union'], transformer: Transformer<TDsl, TResult>, ctx: TDsl['context']) => TResult> = {
        handleAny: (node, transformer, ctx) => {
            const kind = node.kind as string;
            const transformerName = `transform${uppercaseFirst(kind)}`;
            return (transformer as any)[transformerName](node, ctx)
        },
    }

    const transformer = new Proxy({} as Transformer<TDsl, TResult>, {
        get(target, prop: string, receiver) {
            if (prop.startsWith('transform')) {
                const kind = prop.slice('transform'.length);
                return (node: TDsl['union'], ctx: TDsl['context']) => handlers[`handle${kind}`](node, transformer, ctx)
            }

            if (prop.startsWith('handle')) {
                return (cb: (node: TDsl['union'], transformer: Transformer<TDsl, TResult>) => TResult) => {
                    handlers[prop] = cb
                }
            }
        },
    })

    // Default root handler
    handlers['handle'] = transformer['transformAny']

    return transformer
}
