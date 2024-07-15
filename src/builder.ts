import {DSL, DSLOperandsNode} from "./dsl";

export type Builder<TDsl extends DSL<any>> = {
    [key in keyof TDsl['nodes']]: TDsl['nodes'][key] extends DSLOperandsNode<TDsl>
        ? (cb: (b: Builder<TDsl>) => TDsl['nodes'][key]['operands']) => TDsl['nodes'][key]
        : (obj: TDsl['nodes'][key]['args']) => TDsl['nodes'][key]
}

export const createBuilder = <TDsl extends DSL<any>>(): Builder<TDsl> => {
    const builder = new Proxy({} as Builder<TDsl>, {
        get(target, prop: string, receiver) {
            return (objOrCb: any) => {
                if (typeof objOrCb === 'function') {
                    return { type: 'branch', kind: prop, operands: objOrCb(builder) }
                }

                return { type: 'leaf', kind: prop, args: objOrCb }
            }
        },
    })

    return builder;
}