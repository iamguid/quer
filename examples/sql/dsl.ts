import typia from "typia";
import {DSLOperandsNode, DSL, DSLNodeWithFieldValue} from "../../src/dsl";
import {TypeGuardError} from "typia/src/TypeGuardError";

export type MyDslTypes = {
    number: number
    string: string
    boolean: boolean
}

export type MyDslFields = {
    age: { type: 'number' }
    name: { type: 'string' }
    isRegistered: { type: 'boolean' }
};

export type MyDslNodes = {
    and: DSLOperandsNode<MyDsl>
    or: DSLOperandsNode<MyDsl>
    eq: DSLNodeWithFieldValue<MyDsl>
    ne: DSLNodeWithFieldValue<MyDsl>
    ge: DSLNodeWithFieldValue<MyDsl>
    le: DSLNodeWithFieldValue<MyDsl>
}

export type MyDslContext = {
    table: string
}

export type MyDsl = DSL<{ types: MyDslTypes, fields: MyDslFields, nodes: MyDslNodes, context: MyDslContext }>
export const MyDslAssert = typia.createAssert<MyDsl['union']>();
