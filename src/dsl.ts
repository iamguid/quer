export type Entity<TType = any> = {
    [key: string]: { type: TType }
}

export type DSLNodeConfig<TKind extends symbol | number | string, TNode> = Record<TKind, TNode>
export type DSLTypeConfig<TName extends symbol | number | string, TType> = Record<TName, TType>

export type DSLConfig = {
    nodes: DSLNodeConfig<string, any>,
    types: DSLTypeConfig<string, any>
}

export type DSL<TEntity extends Entity, TDSLConfig extends DSLConfig> = {
    entity: TEntity,
    nodes: TDSLConfig['nodes'],
    types: TDSLConfig['types'],
    root: DSLNodesUnion<DSL<TEntity, TDSLConfig>>
}

export type DSLBaseNode<TKind extends symbol | number | string> = {
    kind: TKind
}

export type DSLGroupNode<TDsl extends DSL<any, any>> = {
    children: DSLNodesUnion<TDsl>[]
}

export type DSLNodeWithField<TDsl extends DSL<any, any>> = {
    field: keyof TDsl['entity']
}

export type DSLNodeWithFieldValue<TDsl extends DSL<any, any>> = {
    [key in keyof TDsl['entity']]: { field: key, value: TDsl['types'][TDsl['entity'][key]['type']] }
}[keyof TDsl['entity']]

export type DSLNodeWithFieldValues<TDsl extends DSL<any, any>> = {
    [key in keyof TDsl['entity']]: { field: key, values: Array<TDsl['types'][TDsl['entity'][key]['type']]> }
}[keyof TDsl['entity']]

export type DSLNodesUnion<TDsl extends DSL<any, any>> = {
    [key in keyof TDsl['nodes']]: DSLBaseNode<key> & TDsl['nodes'][key]
}[keyof TDsl['nodes']];

export type DSLPickKeys<TDsl extends DSL<any, any>, TType> = keyof {
    [key in keyof TDsl['entity'] as key extends TType ? key : Exclude<key, key>]: never
}