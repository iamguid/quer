import {MyDsl, MyDslAssert, User} from "./dsl";
import {createBuilder} from "../../src/builder";
import {calculatorTransformer} from "./transformer";

const exprA: MyDsl['union'] = {
    type: 'branch',
    kind: 'and',
    operands: [
        {
            type: 'branch',
            kind: 'or',
            operands: [
                { type: 'leaf', kind: 'eq', args: { field: 'age', value: 18 } },
                { type: 'leaf', kind: 'eq', args: { field: 'age', value: 16 } },
            ]
        },
        { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameA' } },
        { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameB' } }
    ]
}

const b = createBuilder<MyDsl>()
const exprB = b.and(b => ([
    b.or(b => ([
        b.eq({field: 'age', value: 18}),
        b.eq({field: 'age', value: 16}),
    ])),
    b.ne({field: 'name', value: 'nameA'}),
    b.ne({field: 'name', value: 'nameB'}),
]))

const users: User[] = [
    {age: 18, name: 'nameA', isRegistered: true},
    {age: 16, name: 'nameB', isRegistered: false},
    {age: 17, name: 'nameC', isRegistered: true},
    {age: 19, name: 'nameD', isRegistered: false},
    {age: 16, name: 'nameE', isRegistered: true},
    {age: 21, name: 'nameF', isRegistered: false},
]

const calcAChecked = MyDslAssert(exprA);
const calcBChecked = MyDslAssert(exprB);

const resultA = calculatorTransformer.transform(calcAChecked, {})
const resultB = calculatorTransformer.transform(calcBChecked, {})

console.log('resultA', users.filter(resultA));
console.log('resultB', users.filter(resultB));
