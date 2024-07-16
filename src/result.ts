export type TokenResult<TRow> = {
    rows: TRow[]
    nextToken: string
}

export type PagingResult<TRow> = {
    rows: TRow[]
    totalCount: number
}
