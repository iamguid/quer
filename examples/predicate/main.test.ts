import {MyDsl, MyDslAssert, User} from "./dsl";
import {createBuilder} from "../../src/builder";
import {predicateTransformer} from "./transformer";

describe('Predicate Example', () => {
    const b = createBuilder<MyDsl>()

    const expr = b.and(b => ([
        b.or(b => ([
            b.eq({field: 'age', value: 18}),
            b.eq({field: 'age', value: 16}),
        ])),
        b.ne({field: 'name', value: 'nameA'}),
        b.ne({field: 'name', value: 'nameB'}),
    ]))

    it ('builder should build correct expression', () => {
        expect(expr).toEqual({
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
            kind: 'add',
            operands: [],
            test: 1,
        }

        expect(() => MyDslAssert(incorrectExprA)).toThrowError();
        expect(() => MyDslAssert(incorrectExprB)).toThrowError();
        expect(() => MyDslAssert(incorrectExprC)).toThrowError();
    })

    it('should return correct result on transform', () => {
        const users: User[] = [
            {age: 18, name: 'nameA', isRegistered: true},
            {age: 16, name: 'nameB', isRegistered: false},
            {age: 17, name: 'nameC', isRegistered: true},
            {age: 19, name: 'nameD', isRegistered: false},
            {age: 16, name: 'nameE', isRegistered: true},
            {age: 21, name: 'nameF', isRegistered: false},
        ]

        const predicate = predicateTransformer.transform(expr, {});
        const result = users.filter(predicate);
        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({age: 16, name: 'nameE', isRegistered: true});
    })
});
