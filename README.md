# quer
Filter DSL generator based on JSON.

## Problem
In many fullstack applications, you need to write filters to filter collections.
Filters may be difficult to design and implement, especially when you need to filter by multiple fields and with nested conditions.

## How It Works:
1. You define yor own filter DSL, with your types and operators.
2. You define your own entity types, that you will use to build filters.
3. Based on your DSL `quer` provides you strongly typed filter builder,
   that you can use on frontend side to build filters expressions.
4. Based on your DSL `quer` provides you a transformer,
   that you can use on backend side to transform the filter
   to SQL, mongodb, OpenSearch/ElasticSearch, or any other query language.

## Goals
- **Type-safe**: `quer` is designed to be type-safe, so you can't make mistakes when writing queries.
- **Flexible**: `quer` is designed to be flexible, so you can write any query you want.
- **Easy to use**: `quer` is designed to be easy to use, so you can write queries quickly.
- **Extensible**: `quer` is designed to be extensible, so you can write queries that do anything you want.
- **JSON-based**: `quer` is designed to be JSON-based, so it is easy to parse and transform.

## DSL Specification
`quer` is very flexible and don't provide you any fixed value types, operators.
`quer` provides you only low level primitives, and you can use it to define behavior of your filters.
