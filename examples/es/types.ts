export type Event = {
    player: string
    type: 'death' | 'spawn' | 'kill'
    timestamp: number
}

export const eventEntity = {
    player: { type: 'string' },
    type: { type: 'string' },
    timestamp: { type: 'timestamp' },
} as const;
