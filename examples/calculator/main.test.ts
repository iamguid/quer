import {MyDsl, MyDslAssert} from "./dsl";
import {createBuilder} from "../../src/builder";
import {calculatorTransformer} from "./transformer";

describe('Calculator Example', () => {
    const b = createBuilder<MyDsl>()

    const expr = b.add(b => ([
        b.sub(b => ([
            b.val({value: 1}),
            b.val({value: 2}),
        ])),
        b.val({value: 3}),
        b.val({value: 5}),
    ]))

    it ('builder should build correct expression', () => {
        expect(expr).toEqual({
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
        });
    });

    it ('should throw error if expression not correct', () => {
        // Empty object
        const incorrectExprA = {}

        // Missing field
        const incorrectExprB = {
            type: 'branch',
            kind: 'add',
        }

        // Additional field
        const incorrectExprC = {
            type: 'branch',
            kind: 'add',
            operands: [],
            test: 1,
        }

        expect(() => MyDslAssert(incorrectExprA)).toThrowError();
        expect(() => MyDslAssert(incorrectExprB)).toThrowError();
        expect(() => MyDslAssert(incorrectExprC)).toThrowError();
    })

    it('should return correct result on transform', () => {
        const result = calculatorTransformer.transform(expr, {})
        expect(result).toEqual(7);
    })
});
