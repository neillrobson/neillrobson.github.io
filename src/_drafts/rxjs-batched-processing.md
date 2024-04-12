---
layout: post
title: Batched Processing in RxJS
---

When you have a ton of data that all needs to be processed, reactive programming makes the implementation easy to read, terse to write, and efficient to run.
But when the data isn't all needed, and processing the full stream is prohibitively expensive, more esoteric methods are necessary. <!-- more -->

## Context

Say you have an array or stream of image files. You want to send them off to a service that runs image recognition, to identify pictures with cats in them.
You want specifically the _first four_ pictures with cats. Not just any four pictures with cats: perhaps the source array is already sorted by timestamp and you want the most recent four cat pictures.

Stream processing, asynchronous actions... This sounds like a job for reactive programming! However, you have a couple of unique concerns:

* The image recognition API is expensive to call. You don't want to be charged for unnecessary requests.
* The image recognition API takes a long time for each file. You want to parallelize your processing, if possible.

Even with those considerations, you're pretty sure some creative pipelines will do the trick. You bust out your RxJS library and get started.

## Concatenation

Calling an asynchronous API for each item in an observable stream is a classic use case for one of the `*Map` operators. Every operator in that family will create a new stream for each item in the source stream, then collapse the outputs into a single stream to pass down the pipeline.

Some of the map operators are clearly inappropriate:

* `switchMap` drops old streams as soon as new source data comes in. We don't want to lose any responses from the API.
* `exhaustMap` ignores the source data stream while it waits for each created stream to complete. We want to check every image until we have four cats.

We really just want concatenation of our API calls, so `concatMap` seems like a good choice. Our pipeline would look something like:

```javascript
sourceImages$.pipe(
    concatMap(identifyImage),
    filter(isCatImage),
    take(4)
).subscribe(sendToMyPhone);
```

It's a clean pipeline! But in practice, this implementation processes the source images serially. Each API call must be returned before the next image is sent off.
For a slow API, such serial processing is undesirable.

## Merging

We've got a fourth member of the `*Map` family: `mergeMap`. On the surface, it looks like precisely the operator we need.
It creates child streams and merges them into the output stream as soon as input data arrives.

Implementing it yields nearly identical pipeline code:

```javascript
sourceImages$.pipe(
    mergeMap(identifyImage),
    filter(isCatImage),
    take(4)
).subscribe(sendToMyPhone);
```

Testing it out yields a result worse than we started with: **the order of the source images is no longer preserved**. We start seeing cat pictures from decades ago, simply because they happened to be the first ones returned by the API.

## Maintaining Order

As it turns out, the serialization of streams in `concatMap` (only creating a new stream when the previous one has completed) is a feature unique to that operator.
If we simply split out the "map" part of the operator from the concatenation, we get the best of both worlds:

* All of the streams are created up front (in the `map` operator)
* The order of the streams' output is preserved

{>|} In between map and concatAll, each object in the stream is... itself a stream. Streamception!

```javascript
sourceImages$.pipe(
    map(identifyImage),
    concatAll(),
    filter(isCatImage),
    take(4)
).subscribe(sendToMyPhone);
```

This pipeline fixes both our ordering issue, and also runs completely parallelized. We get super excited, until we view our monthly bill from the image recognition service.
As it turns out, this pipeline sends _every single image_ to the API, as soon as it shows up in our source stream. We might send off thousands of requests before the four cat images are identified, even if the cat images are the first four images in the source stream!

### _Hot vs Cold_

If you're trying out this code on your own, you might find that your `map`/`concatAll` implementation did not parallelize like you wanted it to. Most likely, it's a result of implementing `identifyImage` as a pure RxJS stream, otherwise known as a "cold" observable. The difference between cold and hot observables is simple to state, hard to internalize:

* Cold observables have their data created _inside_ the observable
* Hot observables have their data created _outside_ the observable

If I make an Observable from an array, `from([1, 2, 3])`, all of the data is already there. Even though we created a stream/observable "interface," the computer doesn't have to wait for anyone to get data back to it for the stream to both start and complete immediately. As a result:

* Cold observables don't start emitting values until someone `subscribe`s to them
* Cold observables run a separate, unique pipeline for each subscription (they are "**unicast**")

Hot observables are made from things like Promises (e.g. `from(http.fetch('/api/my-endpoint'))`). The computer is waiting for someone else to get back to it, and the computer will emit whatever it receives as soon as it arrives.

* Hot observables emit items upon arrival, regardless of subscriber count
* Hot observables send data through a single pipeline, no matter how many subscribers (they are "**multicast**")

Returning to our pipeline above: if we `map` data to a _hot_ observable, the API request goes out immedately (no need for a subscriber). The `concatAll` _does_ end up subscribing, but the API request is already processing at that point. As each API call returns, `concatAll` will subscribe to the next one in the stream. Most likely, that latter API call will have already returned, so `concatAll` receives an immediate value, and continues.

On the other hand, `map`ping to a _cold_ observable doesn't kick off any process at all. The `concatAll` subscribes to the first observable, and waits for it to complete. Then it subscribes to the second observable, which hasn't been doing anything up to this point because it's cold (and had no subscribers)... and the effect is serialization.

If you want to mimic Promises in your `indentifyImage` implementation, **use the `shareReplay` operator** in your pipeline. For example:

```javascript
function identifyImage(img) {
    const pipeline of(img).pipe(
        delay(Math.floor(5000 * Math.random())), // simulated delay
        map((img) => 'yep this is a cat'),
        shareReplay()
    );
    pipeline.subscribe(); // No argument needed: just kick off processing

    return pipeline;
}
```

The `shareReplay` operator turns your pipeline into a multicast (hot) pipeline, and also replays past events for subscribers who hop on board after data has already arrived.

## Batching

TODO: this section

## Conclusion

TODO: this section
