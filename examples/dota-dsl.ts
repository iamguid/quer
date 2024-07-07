import {Entity, DSL, DSLGroupNode, DSLPickKeys, DSLNodeWithFieldValue} from "../dsl";
import {createTransformer} from "../transformer";

export type DSLTimeRange = {
    begin: number
    end: number
}

export type DSLNodes<TDsl extends DSL<any, any>> = {
    and: DSLGroupNode<TDsl>
    or: DSLGroupNode<TDsl>
    eq: DSLNodeWithFieldValue<TDsl>
    inRange: { field: DSLPickKeys<TDsl, 'timestamp'>, range: DSLTimeRange }
}

export type DSLTypes = {
    number: number
    boolean: boolean
    string: string
    timestamp: number,
}

export type DotaDsl<TEntity extends Entity = any> = DSL<TEntity, {nodes: DSLNodes<DotaDsl<TEntity>>, types: DSLTypes}>

export const eventsEntity = {
    player: { type: 'string' },
    type: { type: 'string' },
    timestamp: { type: 'timestamp' },
} as const;

const testFilter1: DotaDsl<typeof eventsEntity>['root'] = {
    kind: 'and',
    children: [
        {
            kind: 'or',
            children: [
                { kind: 'eq', field: 'player', value: 'player1' },
                { kind: 'eq', field: 'player', value: 'player2' },
            ]
        },
        { kind: 'inRange', field: 'timestamp', range: { begin: 0, end: 100 } },
        { kind: 'eq', field: 'type', value: 'kill'}
    ]
}

const testFilter2: DotaDsl<typeof eventsEntity>['root'] = {
    kind: 'eq', field: 'type', value: 'death'
}

const testFilter3: DotaDsl<typeof eventsEntity>['root'] = {
    kind: 'and',
    children: [
        { kind: 'eq', field: 'player', value: 'player1' },
        { kind: 'eq', field: 'type', value: 'kill'}
    ]
}

type Event = {
    player: string
    type: 'death' | 'spawn' | 'kill'
    timestamp: number
}

const events: Event[] = [
    { player: 'player1', type: 'kill', timestamp: 50 },
    { player: 'player2', type: 'kill', timestamp: 70 },
    { player: 'player3', type: 'kill', timestamp: 70 },
    { player: 'player1', type: 'death', timestamp: 80 },
    { player: 'player2', type: 'spawn', timestamp: 90 },
    { player: 'player1', type: 'kill', timestamp: 100 },
    { player: 'player2', type: 'kill', timestamp: 110 },
    { player: 'player1', type: 'kill', timestamp: 120 },
]

const t = createTransformer<DotaDsl, (row: Event) => boolean>()

t.handleAnd((node, t) => {
    return (row) => node.children.every(child => t.transform(child)(row))
})

t.handleOr((node, t) => {
    return (row) => node.children.some(child => t.transform(child)(row))
})

t.handleEq((node, t) => {
    return (row) => (row as any)[node.field as string] === node.value
})

t.handleInRange((node, t) => {
    return (row) => row[node.field] >= node.range.begin && row[node.field] <= node.range.end
})

const predicate1 = t.transform(testFilter1 as DotaDsl['root'])
const predicate2 = t.transform(testFilter2 as DotaDsl['root'])
const predicate3 = t.transform(testFilter3 as DotaDsl['root'])

const result1 = events.filter(predicate1)
const result2 = events.filter(predicate2)
const result3 = events.filter(predicate3)

console.log('result1', result1);
console.log('result2', result2);
console.log('result3', result3);
