---
layout: post
title: Fluid CSS
---

During a recent website re-design, I was delighted by the robust and flexible interface provided by modern CSS.<!--more-->

I've historically felt rather cold toward CSS,
due to my impression that it was a disjointed "bag of tricks" for styling websites.
Developers had to throw arbitrary solutions out until something stuck,
even if the resulting pile of declarations made no intuitive sense.

In truth, my perspective was due to my own ignorance more than the early CSS specification.
Shifting my mindset away from breakpoint-based designs,
while learning some recent^[and well-supported!] features introduced to CSS,
created a joyful design experience that I'm excited to share.

## Break Away from Breakpoints

> Be the browser’s mentor, not its micromanager.
>
> <cite>Andy Bell, <a href="https://buildexcellentwebsit.es/">Build Excellent Websites</a></cite>

Prior to the current site design, my main CSS file had about [eighty-four lines of `@media` queries](https://github.com/neillrobson/neillrobson.github.io/blob/ad6585eb78cad9ebe744ac8882834cf5994d426b/webpack/style.scss#L666).
While the rest of the stylesheet defined the look and feel of my site on a large desktop screen,
the media-query styles overrode large portions of those styles to make the site palatable on mobile viewports.
The overrides would trigger at three distinct screen width breakpoints.

Nothing is inherently wrong with media queries,
but I found them a hassle to maintain.
Every time I wanted to adjust the layout or style of an element on my page,
I had to think about what CSS to change in _four different locations_:

```css
div {
    /* here, */
}

@media screen and (max-width: 976px) {
    div {
        /* and here, */
    }
}

@media screen and (max-width: 760px) {
    div {
        /* and here, */
    }
}

@media screen and (max-width: 400px) {
    div {
        /* and here, too. */
    }
}
```

I was essentially juggling four distinct website designs in my mind,
each only suited for a certain viewport width.
None of them looked good near the breakpoints.

An unstyled paragraph on an otherwise blank webpage will reflow perfectly for any viewport size.
Isn't it ironic that **adding styles makes the design less flexible**?

Andy Bell advocates for writing stylesheets that work at _any_ width.
Even if you envision a few distinct layouts for desktop versus mobile viewports,
write style rules that scale fluidly between those two layouts.
Although the upfront effort creating those rules is higher,
it results in only a single design to maintain down the line.

## The Scaling Recipe

We want to scale our measurements by the viewport width:
the `vw` unit is a perfect fit.
A measurement of `1vw` is equal to 1% of the viewport width.

A _very_ simple scaling font size might be:

```css
p {
    font-size: calc(16px + 1vw);
}
```

Nineteen pixels at a 300px viewport, twenty-six pixels at a 1000px viewport...
Granted, for folks with ultra-wide 8K monitors,
this scaling might get out of hand.

Fortunately, CSS also has a `clamp` function!
If the font size should scale between `16px` and `24px`,
we could twiddle with the middle values to find scaling that feels good:

```css
p {
    font-size: clamp(16px, calc(13px + 0.9vw), 24px);
}
```

Drag-resize the viewport in the browser, and the font scales nicely!

It would be nice for the middle quantities to be determined by something more than a gut check, though.
If I still have two ideal viewport widths in mind for mobile versus desktop styling,
a bit of algebra (and CSS pre-processing in SASS) can go a long way[^derivation]:

```scss
@mixin responsive(
  $property,
  $min,
  $max,
  $breakpoint-min,
  $breakpoint-max
) {
  $v: math.div($max - $min, $breakpoint-max - $breakpoint-min);
  $p: $min - $v * $breakpoint-min;
  #{$property}: clamp(#{$min}, calc(#{$v * 100}vi + #{$p}), #{$max});
}

p {
    @include responsive(font-size, 16px, 24px, 400px, 1000px);
}
```

[^derivation]: The variables `$v` and `$p` boil down to the variables in a two-degree system of linear equations.
Or, for the more geometrically-minded,
the solution is finding the equation for the line connecting two points `<$breakpoint-min, $min>`, `<$breakpoint-max, $max>`.
The slope is `$v` and the y-intercept is `$p`.

Once the recipe is derived, this scaling strategy can be applied to _any measurement_:

- font size
- paragraph margins
- sidebar width

Your designs will scale smoothly in every viewport without a single explicit `@media` breakpoint.

## Inside-Out Units

Basing layout on static pixel dimensions can be brittle, however.
Even on small viewports,
users may attempt to scale the _text_ to increase visibility.
If a given layout is tied to the body text being set at 16px,
sufficient font scaling can still make the site unreadable.

The `em` and `rem`[^rem] units have been historically used to address this concern.
Even so, my usage of those units was quite a cargo-cult practice,
and still tightly coupled with pixels.
I would set my `:root` font size to `10px`, such that `0.1rem === 1px`,
and simply do mental math to convert my pixel dimensions to the "better" units.

[^rem]: "em" and "root em," referring to the width of an em-dash. Like this one---see?

**I missed the point.**

Browsers that scale text often override the `:root` font size anyhow,
so my mental math is rendered completely wrong.

## Container Units

## Keeping JS at a Minimum

> In 5 years nothing you (personally, not a publicly traded company) build today that depends on Javascript in the browser to display content will be available, visible, or archived anywhere on the web.
>
> <cite>Tantek Çelik, <a href="https://tantek.com/2025/069/t1/ten-years-jsdr-javascript-required-didnt-read">JavaScript Required; Didn't Read</a></cite>

## Conclusion
