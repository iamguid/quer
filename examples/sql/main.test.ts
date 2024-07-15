import {MyDsl, MyDslAssert} from "./dsl";
import {createBuilder} from "../../src/builder";
import {sqlTransformer} from "./transformer";

const exprA: MyDsl['union'] = {
    type: 'branch',
    kind: 'and',
    operands: [
        { type: 'leaf', kind: 'ge', args: { field: 'age', value: 18 } },
        { type: 'leaf', kind: 'le', args: { field: 'age', value: 23 } },
        { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameA' } },
        { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameB' } },
        { type: 'leaf', kind: 'eq', args: { field: 'isRegistered', value: true } }
    ]
}

const b = createBuilder<MyDsl>()
const exprB = b.and(b => ([
    b.ge({field: 'age', value: 18}),
    b.le({field: 'age', value: 23}),
    b.ne({field: 'name', value: 'nameA'}),
    b.ne({field: 'name', value: 'nameB'}),
    b.eq({field: 'isRegistered', value: true})
]))

const exprAChecked = MyDslAssert(exprA);
const exprBChecked = MyDslAssert(exprB);

const resultA = sqlTransformer.transform(exprAChecked, {table: 'test'})
const resultB = sqlTransformer.transform(exprBChecked, {table: 'test'})

console.log('resultA', resultA);
console.log('resultB', resultB);
