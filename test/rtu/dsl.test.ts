import {createBuilder} from "../../src/builder";
import {MakeSimpleDsl} from "../../src/rtu/dsl";
import { predicateTransformer } from "../../src/rtu/predicate-transformer";
import { sqlTransformer } from "../../src/rtu/sql-transformer";
import typia from "typia";

describe('SimpleDsl', () => {
    type MyDslFields = {
        name: { type: 'string' }
        age: { type: 'number' }
        isStudent: { type: 'boolean' }
    }

    type MyDsl = MakeSimpleDsl<MyDslFields>;
    const MyDslAssert = typia.createAssertGuardEquals<MyDsl['union']>();

    describe('fast check', () => {
        const b = createBuilder<MyDsl>()

        const expr = b.and(b => ([
            b.gt({ field: 'age', value: 18 }),
            b.eq({ field: 'isStudent', value: true }),
            b.or(b => ([
                b.eq({ field: 'name', value: 'Alice' }),
                b.eq({ field: 'name', value: 'Bob' })
            ]))
        ]))

        it('builder should build correct expression', () => {
            expect(expr).toEqual({
                type: 'branch',
                kind: 'and',
                operands: [
                    { type: 'leaf', kind: 'gt', args: { field: 'age', value: 18 } },
                    { type: 'leaf', kind: 'eq', args: { field: 'isStudent', value: true } },
                    {
                        type: 'branch',
                        kind: 'or',
                        operands: [
                            { type: 'leaf', kind: 'eq', args: { field: 'name', value: 'Alice' } },
                            { type: 'leaf', kind: 'eq', args: { field: 'name', value: 'Bob' } }
                        ]
                    }
                ]
            })
        })

        it('should be able to transform to SQL', () => {
            const result = sqlTransformer.transform(expr, { tableName: 'users' })
            expect(result).toEqual(`SELECT * FROM users WHERE (age > 18 AND isStudent = TRUE AND (name = "Alice" OR name = "Bob"))`)
        })

        it('should be able to transform to predicate', () => {
            const users = [
                { name: 'Alice', age: 20, isStudent: true },
                { name: 'Bob', age: 19, isStudent: false },
                { name: 'Charlie', age: 18, isStudent: false },
            ]

            const predicate = predicateTransformer.transform(expr, {});
            const result = users.filter(predicate);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(users[0]);
        })
    });
})
