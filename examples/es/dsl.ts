import typia from "typia";
import {DSL, DSLGroupNode, DSLPickKeys, DSLNodeWithFieldValue, DSLNodeWithFieldValues} from "../../src/dsl";
import {TypeGuardError} from "typia/src/TypeGuardError";
import {eventEntity} from "./types";

export type DSLTimeRange = {
    begin: number
    end: number
}

export type DSLNodes<TDsl extends DSL<any, any>> = {
    and: DSLGroupNode<TDsl>
    or: DSLGroupNode<TDsl>
    term: DSLNodeWithFieldValue<TDsl>
    terms: DSLNodeWithFieldValues<TDsl>
    range: { field: DSLPickKeys<TDsl, 'number'>, gt?: number, lt?: number, ge?: number, le?: number }
    search: { field: DSLPickKeys<TDsl, 'string'>, query: string }
}

export type DSLTypes = {
    number: number
    boolean: boolean
    string: string
}

export type Dsl = DSL<typeof eventEntity, {nodes: DSLNodes<Dsl>, types: DSLTypes}>

export const createDslAssert = (
    errorFactory?: undefined | ((props: TypeGuardError.IProps) => Error)
) => typia.createAssert<Dsl['root']>();
