import {DSL} from "./dsl";

const uppercaseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export type Transformer<TDsl extends DSL<any>, TResult> = {
    [key in keyof TDsl['nodes'] as `transform${Capitalize<key extends string ? key : '???'>}`]: (node: TDsl['nodes'][key]) => TResult
} &{
    [key in keyof TDsl['nodes'] as `handle${Capitalize<key extends string ? key : '???'>}`]: (cb: (node: TDsl['nodes'][key], transformer: Transformer<TDsl, TResult>) => TResult) => TResult
} & {
    transform(node: TDsl['union']): TResult
    handle(cb: (node: TDsl['union'], transformer: Transformer<TDsl, TResult>) => TResult): TResult
}

export const createTransformer = <TDsl extends DSL<any>, TResult>(): Transformer<TDsl, TResult> => {
    const handlers: Record<string, (node: TDsl['union'], transformer: Transformer<TDsl, TResult>) => TResult> = {
        handle: (node, transformer) => {
            const kind = node.kind as string;
            const transformerName = `transform${uppercaseFirst(kind)}`;
            return (transformer as any)[transformerName](node)
        }
    }

    const transformer = new Proxy({} as Transformer<TDsl, TResult>, {
        get(target, prop: string, receiver) {
            if (prop.startsWith('transform')) {
                const kind = prop.slice('transform'.length);
                return (node: any) => handlers[`handle${kind}`](node, transformer)
            }

            if (prop.startsWith('handle')) {
                return (cb: (node: any, transformer: any) => TResult) => {
                    handlers[prop] = cb
                }
            }
        },
    })

    return transformer
}
