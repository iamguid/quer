import typia from "typia";
import {DSLOperandsNode, DSL, DSLNodeWithFieldValue} from "../../src/dsl";

export type User = {
    age: number
    name: string
    isRegistered: boolean
}

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
}

export type MyDslContext = {}

export type MyDsl = DSL<{ types: MyDslTypes, fields: MyDslFields, nodes: MyDslNodes, context: MyDslContext }>
export const MyDslAssert = typia.createAssertGuardEquals<MyDsl['union']>();
