import {DSL, DSLFieldsConfig, DSLNodeWithFieldValue, DSLNodeWithFieldValues, DSLOperandsNode} from "../dsl";

export type SimpleDslTypes = {
    number: number
    string: string
    boolean: boolean
}

export type SimpleDslNodes<TDsl extends DSL<any>> = {
    and: DSLOperandsNode<TDsl>
    or: DSLOperandsNode<TDsl>
    in: DSLNodeWithFieldValues<TDsl, 'string' | 'number'>
    nin: DSLNodeWithFieldValues<TDsl, 'string' | 'number'>
    eq: DSLNodeWithFieldValue<TDsl, 'string' | 'number' | 'boolean'>
    ne: DSLNodeWithFieldValue<TDsl, 'string' | 'number' | 'boolean'>
    gt: DSLNodeWithFieldValue<TDsl, 'number'>
    ge: DSLNodeWithFieldValue<TDsl, 'number'>
    lt: DSLNodeWithFieldValue<TDsl, 'number'>
    le: DSLNodeWithFieldValue<TDsl, 'number'>
}

export type SimpleDslContext = {
    tableName?: string
}

export type MakeSimpleDsl<
    TFields extends DSLFieldsConfig<string, any> = any,
    TContext extends SimpleDslContext = SimpleDslContext
> = DSL<{
    types: SimpleDslTypes,
    fields: TFields,
    nodes: SimpleDslNodes<MakeSimpleDsl<TFields, TContext>>,
    context: TContext
}>
