import {MyDsl, MyDslAssert} from "./dsl";
import {createBuilder} from "../../src/builder";
import {calculatorTransformer} from "./transformer";

const exprA: MyDsl['union'] = {
    type: 'branch',
    kind: 'add',
    operands: [
        {
            type: 'branch',
            kind: 'sub',
            operands: [
                { type: 'leaf', kind: 'val', args: { value: 1 } },
                { type: 'leaf', kind: 'val', args: { value: 2 } },
            ]
        },
        { type: 'leaf', kind: 'val', args: { value: 3 } },
        { type: 'leaf', kind: 'val', args: { value: 5 } }
    ]
}

const b = createBuilder<MyDsl>()

const exprB = b.add(b => ([
    b.sub(b => ([
        b.val({value: 1}),
        b.val({value: 2}),
    ])),
    b.val({value: 3}),
    b.val({value: 5}),
]))

const assert = MyDslAssert();
const calcAChecked = assert(exprA);
const calcBChecked = assert(exprB);

const resultA = calculatorTransformer.transform(calcAChecked)
const resultB = calculatorTransformer.transform(calcBChecked)

console.log('resultA', resultA);
console.log('resultB', resultB);
