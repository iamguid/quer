import {DSL} from "./dsl";

export type QuerySort<TDsl extends DSL<any>> = {
    [key in keyof TDsl['fields']]?: 'ASC' | 'DESC'
}

export type TokenQuery<TDsl extends DSL<any>> = {
    filter: TDsl['union']
    sort: QuerySort<TDsl>
    token: string
}

export type PagingQuery<TDsl extends DSL<any>> = {
    filter: TDsl['union']
    sort: QuerySort<TDsl>[]
    offset: number
    limit: number
}
