import typia from "typia";
import {DSL, DSLGroupNode, DSLPickKeys, DSLNodeWithFieldValue} from "../../src/dsl";
import {TypeGuardError} from "typia/src/TypeGuardError";
import {eventEntity} from "./types";

export type DSLTimeRange = {
    begin: number
    end: number
}

export type DSLNodes<TDsl extends DSL<any, any>> = {
    and: DSLGroupNode<TDsl>
    or: DSLGroupNode<TDsl>
    eq: DSLNodeWithFieldValue<TDsl>
    inRange: { field: DSLPickKeys<TDsl, 'timestamp'>, range: DSLTimeRange }
}

export type DSLTypes = {
    number: number
    boolean: boolean
    string: string
    timestamp: number,
}

export type Dsl = DSL<typeof eventEntity, {nodes: DSLNodes<Dsl>, types: DSLTypes}>

export const createDslAssert = (
    errorFactory?: undefined | ((props: TypeGuardError.IProps) => Error)
) => typia.createAssert<Dsl['root']>();
