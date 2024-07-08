import {createDslAssert, Dsl} from "./dsl";
import {predicateTransformer} from "./transformer";
import {Event, eventEntity} from "./types";

const testFilter1: Dsl['root'] = {
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

const testFilter2: Dsl['root'] = {
    kind: 'eq', field: 'type', value: 'death'
}

const testFilter3: Dsl['root'] = {
    kind: 'and',
    children: [
        { kind: 'eq', field: 'player', value: 'player1' },
        { kind: 'eq', field: 'type', value: 'kill'}
    ]
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

const assert = createDslAssert();

const testFilter1Checked = assert(testFilter1);
const testFilter2Checked = assert(testFilter2);
const testFilter3Checked = assert(testFilter3);

const predicate1 = predicateTransformer.transform(testFilter1Checked as Dsl['root'])
const predicate2 = predicateTransformer.transform(testFilter2Checked as Dsl['root'])
const predicate3 = predicateTransformer.transform(testFilter3Checked as Dsl['root'])

const result1 = events.filter(predicate1)
const result2 = events.filter(predicate2)
const result3 = events.filter(predicate3)

console.log('result1', result1);
console.log('result2', result2);
console.log('result3', result3);
