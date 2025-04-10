---
layout: post
title: Fluid CSS
---

During a recent website re-design, I was delighted by the robust and flexible interface provided by modern CSS.<!--more-->

I've historically felt rather cold toward CSS.
I considered it a disjointed "bag of tricks" for styling websites.
Developers throw arbitrary solutions out until something works,
even if the resulting code is not intuitive.

My perspective was largely due to my own ignorance.
Shifting my mindset away from breakpoint-based designs,
while learning some new^[and well-supported!] CSS features,
created a joyful design experience that I'm excited to share.

## Break Away from Breakpoints

> Be the browser's mentor, not its micromanager.
>
> <cite>Andy Bell, <a href="https://buildexcellentwebsit.es/">Build Excellent Websites</a></cite>

Prior to the current site design, my main CSS file had about [eighty-four lines of `@media` queries](https://github.com/neillrobson/neillrobson.github.io/blob/ad6585eb78cad9ebe744ac8882834cf5994d426b/webpack/style.scss#L666).
While the rest of the stylesheet defined my site's layout on a large desktop screen,
the media-query styles overrode those rules to make the site palatable on mobile viewports.
The overrides triggered at three distinct screen width breakpoints.

Nothing is inherently wrong with media queries,
but I found them a hassle to maintain.
Every time I wanted to adjust an element's style,
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

I was juggling four distinct website designs in my mind,
each only suited for a certain viewport width.
None of them looked good near the breakpoint widths.

An _unstyled_ paragraph on an otherwise blank webpage reflows for any viewport.
Isn't it ironic that **adding styles makes the design less flexible**?

Andy Bell advocates for writing stylesheets that work at _any_ width.
Even if you envision a few distinct layouts for different devices,
write style rules that scale smoothly between those two layouts.
The upfront effort creating those rules is higher,
but it results in a single design to maintain down the line.

## The Scaling Recipe

We want to scale our measurements by the viewport width.
The `vw` unit is perfect for the task.
A measurement of `1vw` is equal to 1% of the viewport width.

A _very_ simple scaling font size might be:

```css
p {
    font-size: calc(16px + 1vw);
}
```

The math is simple:
`font size = 16px + (0.01 * screen width)`.
Nineteen pixels at a 300px viewport, twenty-six pixels at a 1000px viewport...
Granted, for folks with ultra-wide 8K monitors,
this scaling might get out of hand.

Fortunately, CSS also has a `clamp` function!
If the font size should scale between `16px` and `24px`,
we could twiddle with the values to find scaling that feels good:

```css
p {
    font-size: clamp(16px, calc(13px + 0.9vw), 24px);
}
```

The font scales nicely, no matter how the viewport is resized.

It would be nice for the middle quantities to be determined by something more than a gut check, though.
If I still have two ideal viewport widths in mind for mobile versus desktop styling,
a bit of algebra (and CSS pre-processing in SASS) can go a long way:[^derivation]

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
    // Font size is 16px when viewport falls below 400px
    // and is 24px when viewport expands beyond 1000px
    // with linear scaling between those breakpoints
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
If my layout depends on 16-pixel body text,
enough font scaling can still make the site unreadable.

The `em` and `rem`^["em" and "root em," referring to the width of an em-dash. Like this one---see?]
units can be used to address this concern.
Even so, I hardly used those units in a productive manner.
I would set my `:root` font size to `10px`, such that `0.1rem === 1px`,
and simply do mental math to convert my pixel dimensions to the "better" units.

I missed the point.

Browsers that scale text often override the `:root` font size anyhow,
so my mental math was wrong.
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
while never falling below whatever dimension the user set.
The scaling factors, `0.8rem + 0.9vi`, were chosen based on gut feel
while I shifted the viewport around.

Using relative units in this way often aligns your layout with typographic best practices.
For example, body text is generally most readable with a line length of 45-90 characters,[^butterick]
so the following style is a solid baseline:

[^butterick]: [Butterick's Practical Typography](https://practicaltypography.com/line-length.html) gives this recommendation, along with many other excellent guidelines.

```css
p {
    /* 1ch =~ width of a "0" character */
    width: clamp(60%, 60ch, 100%);
    max-width: 900px;
}
```

With a single selector and two declarations,
we've expressed a standard with universal applicability:

- Wide viewports have a pleasant 40% right margin;
- narrow viewports use the whole screen;
- the total paragraph width has a fixed upper bound;
- when all other constraints are satisfied,
prefer to keep the width around 60 characters.

## Container Queries

Keeping with the theme of relative content-centric styling,
[container query units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units)
are an exciting recent addition to the CSS toolkit.

Their definitions are consistent with viewport units:
`1cqw` is 1% of the Queried Container's Width.
But rather than being relative to the entire viewport,
they are relative to a bounding box that you define in CSS.

```css
.container {
    container-type: inline-size;
}

.container .margin {
    /*
        cqi: "container query inline"
        "inline" is equivalent to "width" in most languages
    */
    width: 25cqi;
}
```

No matter how deeply nested `.margin` elements are,
they will always have a width equal to 25% _of the ancestor `.container` size_.

Declaring elements as containers has consequences:

- The queryable axes must have _extrinsic_ (or explicit) dimensions set.[^extrinsic]
- Each container defines a new "containment context," preventing layout flows between containers:
  - Subsequent content is forced to clear floating elements in previous containers.
  - CSS counter state[^counter] is reset in each container.

[^extrinsic]: The limitation is somewhat intuitive.
If children will be sized based on the parent width,
the parent _cannot_ "shrink-wrap" to its contents without creating an unresolvable self-reference.
Fortunately, block elements stretch to fill the available width (inline size) by default,
so an `inline-size` container type usually doesn't cause issues.
A container type of just `size` _will shrink to zero height_ if height is not explicitly set, though.

[^counter]: CSS counters are how sidenotes (like this one!) are automatically numbered.
If each `<p>` or `<section>` were declared a container,
every sidenote would reset to 1.

However, when used carefully, some incredible formatting can be achieved.
For example, my sidenotes (on desktop screens) are evenly aligned to the right margin,
regardless of their relative position in the body text.

## Color Scheme Switcher

> Yet another Internet site adds "unreadable mode." Got it.
>
> <cite><a href="https://danlj.org/mkj/">Michael Johnson</a></cite>

I tend to use light color schemes at a low monitor brightness for daily work.
My preference is purely personal, and I appreciate designs that support both light and dark color schemes.

CSS offers a media query for the user's preferred color scheme:

```css
@media (prefers-color-scheme: dark) {
    background-color: black;
    color: white;
}
```

But not everyone knows how to switch the preference for their browser.
Others lack the patience to navigate through all those menus.
I wanted a way for my site to respect the browser default,
and also provide a means to quickly switch the color scheme.

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

and then adding CSS color variables:

```css
body:has(#theme-dark:checked) {
    --background-color: black;
    --color: white;
}
```

But I didn't want unstyled radio buttons sitting at the top of every page.
HTML forms support clicking `<label>` elements to select the corresponding input field,[^label]
and the input control doesn't need to be located anywhere near the label.

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
I have nothing against Javascript and related web frameworks.
Those technologies are how I make a living.

However, I also know that web technologies and patterns shift at a blistering pace.
Javascript is unavoidable when developing a web-hosted _application_,
but a site focused on static _content delivery_ doesn't need such infrastructure.
Given the impressive capabilities that modern HTML and CSS afford,
I set out to redesign this site with no Javascript at all.

The goal of purging JS was... mostly achieved.

I left a single inline `<script>` in the head of the site's document.
Crucially, if you disable JS in your browser or delete the script entirely,
**the content and styling of the site is identical.**
In other words, the site is not _dependent_ on Javascript to display anything authored by me.

Why did I include JS at all?
The script serves a few purposes, in order of decreasing importance:

0. The color scheme selector is not keyboard-accessible by default.
Label elements can be clicked to activate their corresponding input controls,
but keyboard interactions don't work.
A few event listeners override the default behavior for tab-focus and the space bar,
causing the labels behave more like buttons or links.

1. The color scheme preference does not persist across page navigation.
Javascript is necessary to read or write any form of browser storage.
Without that persistence, the color scheme choice resets to the browser default
on every new page visited.

2. The comment system, [Giscus](https://giscus.app/),
needs a notification to match its color scheme with the main site.
Giscus itself also uses some Javascript of its own---but it's all contained
in an iframe.

Notice that all of these features relate purely to the controls of an aesthetic aspect of the site.
Even if none of the Javascript persists in an archive,
all of the content will still be rendered in a reasonable manner.

## Giscus

This blog previously used the Disqus comment system.
While I personally had no issues with Disqus
(and the blog had under ten comments at the time of migration!),
I was made aware of some [data privacy concerns](https://www.logora.com/blog-posts/data-privacy-concerns-disqus)
with the company.

Even for a site as innocuous as my own,
I didn't want contributors to feel uncomfortable with where their data may be stored (or sold to).
Since my site is maintained on GitHub and deployed with GitHub Pages,
keeping the comments on GitHub was a natural choice.

The biggest downside is the need for contributors to have a GitHub account---perhaps
a deterrent for non-technical readers.
Fortunately, once an account is created, _no technical knowledge is necessary_ to comment.
The widget UI works just like any other comment system.

## Conclusion

As usual, I spent more time refining my site's infrastructure than writing content.
Even so, the project was insightful and fun.
Side projects don't always have to be lucrative or illustrious.
The rejuvenating effect of simply building something beautiful is its own reward!
