import typia from "typia";
import {DSLOperandsNode, DSLNodeWithValue, DSL} from "../../src/dsl";
import {TypeGuardError} from "typia/src/TypeGuardError";

export type MyDslTypes = { number: number }
export type MyDslFields = {};
export type MyDslNodes = {
    val: DSLNodeWithValue<MyDsl>
    add: DSLOperandsNode<MyDsl>
    sub: DSLOperandsNode<MyDsl>
}

export type MyDsl = DSL<{ types: MyDslTypes, fields: MyDslFields, nodes: MyDslNodes }>
export const MyDslAssert = (errorFactory?: undefined | ((props: TypeGuardError.IProps) => Error)) => typia.createAssert<MyDsl['union']>();
