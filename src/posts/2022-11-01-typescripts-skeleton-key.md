---
layout: post
title: Typescript's Skeleton Key
date: 2022-11-01T09:38-04:00
comments: true
tags:
    - software
---

The intrepid Typescript developer will find several types that, frankly, make no sense whatsoever in real life. A "string" or "number" is perfectly reasonable, but what is an "unknown" or "never" type?

More importantly, what in the world is a "keyof never"?

<!--more-->

{>|} In case the introduction didn't make the fact clear, this post will be pretty technical. Be forewarned!

First, we'll need a bit of background on how types can be combined in Typescript to create new, more complicated types. The rules take after formal logic and set theory, but the end result is still pretty intuitive.

Let's pretend we have two plain object types, `Vehicle` and `Animal`:

```typescript
interface Vehicle {
    speed: number;
    name: string;
}

interface Animal {
    name: string;
    legs: number;
}
```

## Union

Perhaps we also want a function that accepts either a `Vehicle` or `Animal` and returns its name. How would we write that function and its signature?

```typescript
function getName(entity: Vehicle | Animal): string {
    return entity.name;
}
```

Notice a few things about this function:

-   The parameter can either be a `Vehicle` or `Animal`, _but not both_. In other words, if you pass in something that has a name _and_ speed _and_ legs, you'll get an error.

-   Because the object can only be one or the other type, the only property that is guaranteed to exist on the object is `name`. If we tried to access any other property on the object (without additional typecasting or narrowing), again, we'd get an error.

The **union** type operator `|` is used when we want instances that are exactly one of the component types specified.

## Intersection

Now, we could also have an object (one that is currently untyped) called "horse":

```typescript
const horse = {
    speed: 23,
    legs: 4,
    name: "Spirit",
};
```

The horse is both a `Vehicle` and an `Animal`, because it literally has all of the fields necessary for both types. We can declare that using the following syntax:

```typescript
type Steed = Vehicle & Animal;
const horse: Steed;
```

A `Steed` can be passed into the `getName` function, and indeed, it can be used anywhere anyone asks for just a `Vehicle`, or just an `Animal`, because a `Steed` is truly both. That said, any variable defined as a `Steed` must have all the fields of both component types: we couldn't assign "just" an `Animal` to a variable of the `Steed` type.

The **intersection** type operator `&` is used when we want instances that can serve as _any_ of the component types specified at _all_ times.

## Unknown and Never

Among Typescript's special-case built-in types are two polar opposites, `unknown` and `never`. What do those types mean?

If a variable is an `unknown` type, then you can assign any value to it. _Anything. Always._ Likewise, a variable with a `never` type can not have anything assigned to it. _Nothing. At all._

The cases where you'd use either of these types are somewhat esoteric, and I won't make a comprehensive list here. However, here are a few simpler motivating examples:

-   A function that never returns (e.g. always throws an error or goes into an infinite loop) has a return type of, you guessed it, `never`. This signature is different from a return type of `void`, i.e. when the function does call `return;` with no value.

-   A function parameter that could be a variety of things, determined through conditional checks (e.g. `if (param === undefined)`), could have a type of `unknown` if we were too lazy to create a more specific type.

### Relation to Set Theory

How might we define `unknown` and `never` with our union and intersection operators? They would both be infinite sets---impractical to write explicitly in code---but the thought exercise will help us understand some interactions described later in this post.

The easier type to conceptualize this way is `unknown`. Consider: if we want the ability to assign any of three different types to a variable, what syntax would we use? Based on our `getName` function parameter, we'd do something like `A | B | C`. For five different types, we'd have `A | B | C | D | E`... and for truly _any type at all_, we'd have an infinitely-long union of types.

The more difficult type to discern in this way is `never`---although, given the parallels so far, the reader might be able to guess where we're going. When we defined `Steed` as `Vehicle & Animal`, we could no longer assign `Vehicle` or `Animal` alone to variables of that type. Furthermore, if we created a longer "intersection type" `A & B & C`, with more components, we'd get an increasingly restricted type. It follows that a variable with an infinitely-long intersection type could _never_ take a value, because no value would have all the properties required of the type.

So, in summary: `unknown` is an infinite union of types; `never` is an infinite intersection of types.

## The "keyof" Utility

This little operator has a pretty simple use: it creates a type consisting of a _union_ of the possible keys for an object.

Some code is worth a thousand words:

```typescript
interface Animal {
    name: string;
    legs: number;
}

// Equivalent to ('name' | 'legs')
type AnimalKey = keyof Animal;
```

The union won't always just be of strings, either: an array (for example) could yield numeric keys in that union.

## `keyof` with Unions and Intersections

Think of our old example types of `Vehicle`, `Animal`, and `Steed`. How would `keyof` behave with the union and intersection operators?

-   `keyof (Vehicle | Animal)` would only yield `'name'`. Does that feel a bit odd? Remember, `Vehicle | Animal` means that each value can only be one or the other type at any given time. When we apply `keyof`, the only guaranteed key on the object is the one shared between both types. That's also why our function `getName` was restricted to referencing the `name` property.

-   `keyof Steed` (i.e. `keyof (Vehicle & Animal)`) would naturally yield all three keys, `'name' | 'speed' | 'legs'`.

A union type typically _decreases_ the number of valid keys, while an intersection type typically _increases_ the number of valid keys.

## Putting it all together

We have enough information now to consider the original question: What is `keyof never`? Or `keyof unknown`? The answer, while unintuitive, is quite logical!

Let's start again with `unknown`:

-   `unknown` is an infinite union of types

-   a union type typically decreases the number of valid keys

-   `keyof unknown` is an infinitely-shrunk set of keys, i.e. an empty set

The set theory explanation is still confusing, so think about it on a natural-language level. What property is valid for both Vehicles, and Animals, and Reports, and Electrons, and Arrays, and Numbers, and Strings, and anything else you can think of? True, a variable of type `unknown` will only ever be one of those actual types at any given time, but (as we saw in the `getName` function) we are only allowed to use keys that are shared across all possible types. The question we're answering with `keyof unknown` is "what keys can be used at any time on values of any type anywhere in Typescript?"

> Therefore, `keyof unknown` is `never`.

What about `keyof never`?

-   `never` is an infinite intersection of types

-   an intersection type typically increases the number of valid keys

-   `keyof never` is the maximal set of keys possible in Typescript, i.e. `String | Number | Symbol`

When we combined two types, we got a type that had all the keys of both component types---even though we could no longer _assign_ values of either component type to the intersection type. As we continue expanding that intersection type, we cover more and more keys, while making it more and more difficult to assign any value to the type... until we reach `never`. The question we're answering with `keyof never` is "what keys could possibly, at some point, be syntactically valid in Typescript?"

> Therefore, `keyof never` is `String | Number | Symbol`.

## Why do we even need this?

Admittedly, it's mostly a fun thought exercise for me! But there is some marginal benefit.

If you are trying to define a variant of the `Record` type and want to provide no restrictions on what keys are used, you can use the generic type `K extends keyof never` to ensure that all valid key types are allowed (and, at the same time, preventing syntactically invalid key types). Granted, you could also use the more explicit `String | Number | Symbol`, and you'd be 99.9% sure to cover everything. However, if the language ever evolves in the future to allow a wider (or---somehow---narrower) set of key types, `keyof never` would by definition pick up on the change immediately, with no intervention necessary from the developer.

Crucially, I must urge the reader to not take this rationalization to their supervisors and tech leads in an attempt to justify unreadable code. The vast majority of developers will find it much easier to understand `String | Number | Symbol`. Saving that value in a readily-accessible type alias, with an explanatory code comment, is arguably much more maintainable than throwing `keyof never` everywhere. However, for those occasions when you see the latter in a codebase, and you're confused as to how in the world that skeleton key works, think back to set theory. You just might be able to put yourself back on track!
