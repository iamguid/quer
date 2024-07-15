export type DSLTypesConfig<TName extends string | number | symbol, TType> = Record<TName, TType>;
export type DSLFieldsConfig<TField extends string | number | symbol, TType> = Record<TField, TType>;
export type DSLNodesConfig<TField extends string | number | symbol, TType extends DSLLeafNode | DSLBranchNode> = Record<TField, TType>;
export type DSLContextConfig<TField extends string | number | symbol, TType> = Record<TField, TType>;

export type DSLConfig = {
    types: DSLTypesConfig<string, any>
    fields: DSLFieldsConfig<string, any>
    nodes: DSLNodesConfig<string, any>
    context: DSLContextConfig<string, any>
}

export type DSL<TDSLConfig extends DSLConfig> = {
    config: TDSLConfig,
    fields: TDSLConfig['fields']
    types: TDSLConfig['types']
    nodes: DSLNodes<TDSLConfig['nodes']>
    context: TDSLConfig['context']
    union: DSLNodes<TDSLConfig['nodes']>[keyof TDSLConfig['nodes']]
}

export type DSLNodes<TDslNodesConfig extends DSLNodesConfig<string, any>> = {
    [key in keyof TDslNodesConfig]: DSLNodeKind<key> & TDslNodesConfig[key]
}

export type DSLBranchNode = {
    type: 'branch'
}

export type DSLLeafNode = {
    type: 'leaf'
}

export type DSLNodeKind<TKind extends symbol | number | string> = {
    kind: TKind
}

export type DSLOperandsNode<TDsl extends DSL<any>> = DSLBranchNode & {
    operands: TDsl['union'][]
}

export type DSLNodeWithField<
    TDsl extends DSL<any>,
    TTypes extends keyof TDsl['types'] = keyof TDsl['types'],
    TDef extends Record<string, any> = {},
    TKeys extends keyof TDsl['fields'] = keyof { [key in keyof TDsl['fields'] as TDsl['fields'][key]['type'] extends TTypes ? key : Exclude<key, key>]: unknown }
> = {
    [key in TKeys]: DSLLeafNode & { args: { field: key } & TDef }
}[TKeys]

export type DSLNodeWithFields<
    TDsl extends DSL<any>,
    TTypes extends keyof TDsl['types'] = keyof TDsl['types'],
    TDef extends Record<string, any> = {},
    TKeys extends keyof TDsl['fields'] = keyof { [key in keyof TDsl['fields'] as TDsl['fields'][key]['type'] extends TTypes ? key : Exclude<key, key>]: unknown }
> = DSLLeafNode & { args: { fields: TKeys[] } & TDef }

export type DSLNodeWithValue<
    TDsl extends DSL<any>,
    TTypes extends keyof TDsl['types'] = keyof TDsl['types'],
    TDef extends Record<string, any> = {},
    TKeys extends keyof TDsl['types'] = keyof { [key in keyof TDsl['types'] as key extends TTypes ? key : Exclude<key, key>]: unknown }
> = {
    [key in TKeys]: DSLLeafNode & { args: { value: TDsl['types'][key] } & TDef }
}[TKeys]

export type DSLNodeWithFieldValue<
    TDsl extends DSL<any>,
    TTypes extends keyof TDsl['types'] = keyof TDsl['types'],
    TDef extends Record<string, any> = {},
    TKeys extends keyof TDsl['fields'] = keyof { [key in keyof TDsl['fields'] as TDsl['fields'][key]['type'] extends TTypes ? key : Exclude<key, key>]: unknown }
> = {
    [key in TKeys]: DSLLeafNode & { args: { field: key, value: TDsl['types'][TDsl['fields'][key]['type']] } & TDef }
}[TKeys]

export type DSLNodeWithFieldValues<
    TDsl extends DSL<any>,
    TTypes extends keyof TDsl['types'] = keyof TDsl['types'],
    TDef extends Record<string, any> = {},
    TKeys extends keyof TDsl['fields'] = keyof { [key in keyof TDsl['fields'] as TDsl['fields'][key]['type'] extends TTypes ? key : Exclude<key, key>]: unknown }
> = {
    [key in TKeys]: DSLLeafNode & { args: { field: key, values: Array<TDsl['types'][TDsl['fields'][key]['type']]> } & TDef }
}[TKeys]
