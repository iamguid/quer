# quer
Filter DSL generator based on JSON.

## Problem
In many fullstack applications, you need to write filters to filter collections.
Filters may be difficult to design and implement, especially when you need to filter by multiple fields and with nested conditions.

## Why do you potentially need DSL?
1. You have a lot of typical, monotone code for filters on backend side.
2. Each time when you add a new entity, you need to add new filter, you need to write a lot of typical code.
3. You need to support filters with complex behavior for each entity.
4. You want to improve user experience by providing user-friendly interface for building complex filters on frontend side,
   with more complex logic, than just input fields (logical and/or, search by special field, etc. Like in Jira/YouTrack filters).
5. You can provide something like a "smart lists" instead of adding many items by hands, you can fill it automatically,
   based on user saved filters. It is more user-friendly and more useful than just a list of saved items, that hard to maintain by the user.
6. You want to send notifications automatically for users, when you have a new data, that matches user filter. Like in Prometheus.
7. Batch processing of data, based on user filters, like deleting, moving, etc.

## How It Works:
1. You define yor own filter DSL, with your fields, types and operators.
2. Based on your DSL `quer` provides you strongly typed filter builder,
   that you can use on frontend side to build filters expressions.
3. Based on your DSL `quer` provides you a transformer interface,
   that you can implement and use on backend side to transform the filter
   to predicate, SQL, mongodb, OpenSearch/ElasticSearch, or any other query language.

## Goals
- **Type-safe**: `quer` is designed to be type-safe, so you can't make stupid mistakes when writing queries.
- **Secure**: `quer` is designed to be secure, so you can't write queries that are vulnerable to injection attacks.
- **Flexible**: `quer` is designed to be flexible, so you can write any query you want.
- **Easy to use**: `quer` is designed to be easy to use on frontend and backend side, so you can write and handle queries quickly.
- **Extensible**: `quer` is designed to be extensible, so you can write queries that do anything you want.
- **JSON-based**: `quer` is designed to be JSON-based, so it is easy to parse and transform.

## DSL Specification
`quer` is very flexible and don't provide you any fixed fields, types or operators.
`quer` provides you only low level primitives, and you can use it to define behavior of your filters.
