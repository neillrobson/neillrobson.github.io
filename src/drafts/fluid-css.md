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

The `em` and `rem`^["em" and "root em," referring to the width of an em-dash. Like this one---see?]
units have been historically used to address this concern.
Even so, my usage of those units was quite a cargo-cult practice,
and still tightly coupled with pixels.
I would set my `:root` font size to `10px`, such that `0.1rem === 1px`,
and simply do mental math to convert my pixel dimensions to the "better" units.

I missed the point.

Browsers that scale text often override the `:root` font size anyhow,
so my mental math is rendered completely wrong.
The base font size should be controllable by the end user,
to match their accessibility needs.

How could I define styles that suit whatever font size the user sets?

Rather than fitting `em` to my fixed-pixel size preference,
I could let it sit at the browser's (or user's) default,
and assign dimensions _relative to their preference_.

For example, my website's font size is set to the following:

```css
html {
    font-size: clamp(1rem, 0.8rem + 0.9vi, 1.5rem);
}
```

**I have no idea what pixel size 1rem might equal.**
I just know that, on large screens, I want all text to have a slight (50%) boost at most,
while never falling below whatever dimension the user set even on the smallest screens.
The scaling factors, `0.8rem + 0.9vi`, were truly just chosen based on gut feel
while I shifted the viewport in a variety of ways.

A surprising amount of layout dimensions can be defined using these relative units,
implicitly aligning them with typographic best practices.
Body text is generally most readable with a line length of 45-90 characters[^butterick],
so the following style is a solid baseline:

[^butterick]: [Butterick's Practical Typography](https://practicaltypography.com/line-length.html) gives this recommendation along with many other excellent guidelines.

```css
p {
    /* 1ch =~ width of a "0" character */
    width: clamp(60%, 60ch, 100%);
    max-width: 900px;
}
```

Wide viewports have a pleasant 40% right margin; narrow viewports use the whole screen;
the total paragraph width has a fixed upper bound; when all other constraints are satisfied,
prefer to keep the width around 60 characters.

With a single selector and two declarations,
we've expressed a standard with universal applicability.

## Container Queries

Keeping with the theme of relative content-centric styling,
[container query units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units)
are an exciting recent addition to the CSS toolkit.

Their definitions are consistent with viewport units (`1cqw` is 1% of the queried container's width),
but rather than being relative to the entire viewport,
they are relative to a bounding box that you define in CSS.

```css
.container {
    container-type: inline-size;
}

.container .margin {
    /*
        cqi: "container query inline"
        equivalent to width in most languages
    */
    width: 25cqi;
}
```

No matter how deeply nested `.margin` elements are,
they will always have a width equal to 25% _of the ancestor `.container` size_.

Declaring elements as containers is not free of consequences:

- The queryable axes must have _extrinsic_ (or explicit) dimensions set.[^extrinsic]
- Each container defines a new "containment context," preventing layout flows between containers.
  - Subsequent content is forced to clear floating elements in previous containers.
  - CSS counter state[^counter] is reset in each container.

[^extrinsic]: The limitation is somewhat intuitive.
If children will be sized based on the parent width,
the parent _cannot_ "shrink-wrap" to its contents without creating a recursive definition.
Fortunately, block elements stretch the full width (inline size) by default,
so an `inline-size` container type usually doesn't cause issues.
A container type of just `size` **will shrink to zero height** if height is not explicitly set, though.

[^counter]: CSS counters are how sidenotes (like this one!) are automatically numbered.
If each `<p>` or `<section>` were declared a container,
every sidenote would reset to 1.

However, when used carefully, some incredible formatting can be achieved.
For example, my sidenotes (on desktop screens) are evenly aligned to the right margin
regardless of their relative position in the body text.

## Color Scheme Switcher

> Yet another Internet site adds "unreadable mode." Got it.
>
> <cite><a href="https://danlj.org/mkj/">Michael Johnson</a></cite>

I tend to use light color schemes at low monitor-brightness settings for day to day work.
My preference is purely personal, and I appreciate designs that function equivalently
with both light and dark color schemes.

CSS offers a media query for the user's preferred color scheme:

```css
@media (prefers-color-scheme: dark) {
    background-color: black;
    color: white;
}
```

But not everyone knows how to switch the preference for their browser,
or has the patience to navigate through all those menus.
I wanted a way for my site to respect the browser default,
and also provide controls to override and preview both color schemes.

With some creative markup (and a few accessibility caveats),
a solution with only HTML and CSS is possible!

CSS provides a `:checked` pseudo-class for checkboxes and radio inputs that are selected.
The first proof-of-concept consisted of adding radio control as a child of the body tag:

```html
<body>
    <input type="radio" name="color-theme" value="system" checked="" id="theme-system">
    <input type="radio" name="color-theme" value="dark" id="theme-dark">
    <input type="radio" name="color-theme" value="light" id="theme-light">
    <div class="container">
        <!-- content -->
    </div>
</body>
```

and then adding CSS color variables similar to the media queries:

```css
body:has(#theme-dark:checked) {
    --background-color: black;
    --color: white;
}
```

But I didn't want unstyled radio buttons sitting at the top of every page.
As it turns out, HTML forms support clicking `<label>` elements to select the corresponding input field,[^label]
and the input control doesn't need to be located anywhere near the label!

[^label]: This functionality is particularly useful when filling out forms
on extremely small viewports, where tapping the tiny checkboxes is infeasible.

So I put some labels into my navigation bar as such:

```html
<fieldset id="theme-switcher" class="visible">
    <legend>Theme</legend>
    <label for="theme-system" tabindex="0">
        <!-- system icon -->
    </label>
    <label for="theme-dark" tabindex="0">
        <!-- moon icon -->
    </label>
    <label for="theme-light" tabindex="0">
        <!-- sun icon -->
    </label>
</fieldset>
```

I could style them however I wished.
It has some limitations---discussed in the [following section](#keeping-js-at-a-minimum)---but the base functionality operates without a lick of Javascript!

## Keeping JS at a Minimum

> In 5 years nothing you (personally, not a publicly traded company)
> build today that depends on Javascript in the browser to display content will be available,
> visible, or archived anywhere on the web.
>
> <cite>Tantek Çelik, <a href="https://tantek.com/2025/069/t1/ten-years-jsdr-javascript-required-didnt-read">JavaScript Required; Didn't Read</a></cite>

As a software engineer with a focus on front-end web development,
I have nothing against Javascript and the related web frameworks.
Those technologies are how I make a living.

However, I also know that web technologies and patterns shift at a blistering pace.
The rapids are unavoidable when developing a web-hosted _application_,
but a site focused on static _content delivery_ doesn't necessarily need such infrastructure.
Given the impressive capabilities that modern HTML and CSS afford,
I initially set out to redesign this portfolio site with no Javascript whatsoever.

The goal of purging JS was... mostly achieved.

There is only one, inline `<script>` in the head of the site's document.
Crucially, if you disable JS in your browser or delete the script entirely,
**the content and styling of the site is identical.**
In other words, the site is not _dependent_ on Javascript to display anything authored by me.

So, why did I include JS at all?
The script serves a few purposes, in order of decreasing importance:

0. The color scheme selector is not keyboard-accessible by default.
By 

## Conclusion
