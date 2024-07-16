import {PagingResult, TokenResult} from "./result";

export const createTokenPaginator = <TResult extends TokenResult<any>>(cb: (nextToken?: string) => Promise<TResult>) => {
    return async function* (): AsyncGenerator<TResult, TResult, TResult> {
        let nextToken: string | undefined = undefined

        while (true) {
            const result: TResult = yield await cb(nextToken)
            nextToken = result.nextToken
        }
    }
}

export const createPagingPaginator = <TResult extends PagingResult<any>>(pageSize: number, cb: (offset: number, limit: number) => Promise<TResult>) => {
    return async function* (): AsyncGenerator<TResult, TResult, TResult> {
        let offset = 0;

        while (true) {
            yield await cb(offset, pageSize)
            offset += pageSize
        }
    }
}
