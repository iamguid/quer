import {MyDsl, MyDslAssert} from "./dsl";
import {createBuilder} from "../../src/builder";
import {sqlTransformer} from "./transformer";

describe('SQL Example', () => {
    const b = createBuilder<MyDsl>()

    const expr = b.and(b => ([
        b.ge({field: 'age', value: 18}),
        b.le({field: 'age', value: 23}),
        b.ne({field: 'name', value: 'nameA'}),
        b.ne({field: 'name', value: 'nameB'}),
        b.eq({field: 'isRegistered', value: true})
    ]))

    it ('builder should build correct expression', () => {
        expect(expr).toEqual({
            type: 'branch',
            kind: 'and',
            operands: [
                { type: 'leaf', kind: 'ge', args: { field: 'age', value: 18 } },
                { type: 'leaf', kind: 'le', args: { field: 'age', value: 23 } },
                { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameA' } },
                { type: 'leaf', kind: 'ne', args: { field: 'name', value: 'nameB' } },
                { type: 'leaf', kind: 'eq', args: { field: 'isRegistered', value: true } }
            ]
        });
    });

    it ('should throw error if expression not correct', () => {
        // Empty object
        const incorrectExprA = {}

        // Missing field
        const incorrectExprB = {
            type: 'branch',
            kind: 'and',
        }

        // Additional field
        const incorrectExprC = {
            type: 'branch',
            kind: 'and',
            operands: [],
            test: 1,
        }

        expect(() => MyDslAssert(incorrectExprA)).toThrowError();
        expect(() => MyDslAssert(incorrectExprB)).toThrowError();
        expect(() => MyDslAssert(incorrectExprC)).toThrowError();
    })

    it('should return correct result on transform', () => {
        const result = sqlTransformer.transform(expr, {table: 'users'});
        expect(result).toEqual(`SELECT * FROM 'users' WHERE (age >= 18 AND age <= 23 AND name != 'nameA' AND name != 'nameB' AND isRegistered = TRUE)`);
    })
});
