---
title: Markdown-It Tufte
subtitle: Custom Markdown-parsing plugin
cover-image: /assets/images/projects/markdown-logo.svg
tags:
  - Javascript
  - Markdown
  - CSS
layout: project
year: 2025
---

Inspired by the pragmatic and elegant web design choices of the [Tufte CSS](https://edwardtufte.github.io/tufte-css/) project,
I set out to create an extension of the Markdown syntax to make drafting Tufte-styled documents a joy. <!--more-->

**Check it out on Github [here](https://github.com/neillrobson/markdown-it-tufte)**, and try out the live demo [here](https://neillrobson.com/markdown-it-tufte/)!

## Motivation

I've been interested for a while in building a personal archive of my old writings (journals, poems, short stories),
as well as having some way to annotate and curate them without destroying the source material.
Tufte CSS sets a beautiful standard for all sorts of web documents,
and I wanted to follow that precedent as much as possible.

For the actual building of the website from plain-text files, I found the minimal static-site drafting tool [Eleventy](https://11ty.dev).
Eleventy is an ideal technology to create "pure content" sites.
There is no fuss over Javascript bundling, browser targets, and the like:
just write your content (in Markdown or the language of your choice), run the serve or build command, and you're golden.

Eleventy uses [Markdown-It](https://markdown-it.github.io/) by default to parse Markdown.
Admittedly, I had no previous familiarity with that parser,
and the documentation for authors of custom plugins was sparse.
However, [existing](https://github.com/luhmann/tufte-markdown) [projects](https://github.com/jez/tufte-pandoc-css) were often unmaintained or lacking in functionality.
They also required [a rip-and-replace](https://github.com/nerdhaus/eleventufte) of Eleventy's default Markdown parser,
limiting the integration possibilities with other plugins designed for use with Eleventy.

My plugin seeks to fill that gap!

## Next Steps

Even if the plugin itself doesn't experience widespread adoption,
I at least hope to contribute some documentation for Markdown-It plugin development to their repository.
I learned a ton in the development process that could be a significant help to others.

On a much grander scale, I may one day move this blog/portfolio site from Jekyll to Eleventy.
If I make that change, I would also likely use some variant of Tufte CSS in the redesign,
allowing for the use of side-notes and new-thoughts.
That project is much further out in the future, though.
