import {DSL, DSLNodesUnion} from "./dsl";

const uppercaseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export type Transformer<TDsl extends DSL<any, any>, TResult> = {
    [key in keyof TDsl['nodes'] as `transform${Capitalize<key extends string ? key : '???'>}`]: (node: TDsl['nodes'][key]) => TResult
} &{
    [key in keyof TDsl['nodes'] as `handle${Capitalize<key extends string ? key : '???'>}`]: (cb: (node: TDsl['nodes'][key], transformer: Transformer<TDsl, TResult>) => TResult) => TResult
} & {
    transform(node: DSLNodesUnion<TDsl>): TResult
    handle(cb: (node: DSLNodesUnion<TDsl>, transformer: Transformer<TDsl, TResult>) => TResult): TResult
}

export const createTransformer = <TDsl extends DSL<any, any>, TResult>(): Transformer<TDsl, TResult> => {
    const handlers: Record<string, (node: DSLNodesUnion<TDsl>, transformer: Transformer<TDsl, TResult>) => TResult> = {
        handle: (node, transformer) => {
            const kind = node.kind as string;
            const transformerName = `transform${uppercaseFirst(kind)}`;
            return (transformer as any)[transformerName](node)
        }
    }

    // @ts-ignore
    const transformer = new Proxy({}, {
        get(target: any, prop: string, receiver: any) {
            // @ts-ignore
            if (prop.startsWith('transform')) {
                const kind = prop.slice('transform'.length);
                return (node: any) => handlers[`handle${kind}`](node, transformer)
            }

            // @ts-ignore
            if (prop.startsWith('handle')) {
                return (cb: (node: any, transformer: any) => TResult) => {
                    handlers[prop] = cb
                }
            }
        },
    })

    return transformer
}
