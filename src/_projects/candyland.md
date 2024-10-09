---
title: Digital Candyland Card Deck
subtitle: Progressive web application
client: Give Kids the World
cover-image: /assets/images/projects/gktw.png
tags:
  - JavaScript
  - React
  - Google Workbox
layout: project
year: 2019
---
Each year, NC State University sends a group of students down to Orlando,
Florida to serve for a week at the charity [Give Kids The World
Village](https://www.gktw.org/). According to their website,

> Give Kids The World Village is an 84-acre, nonprofit "storybook" resort in
> Central Florida. Here, children with critical illnesses and their families are
> treated to weeklong, cost-free vacations.

In addition to spending a week serving in person at the village, I also had the
opportunity to assist with a charity fundraiser that NC State students were
hosting. Children from the local community were invited to play in a life-size
version of the [Candyland](https://en.wikipedia.org/wiki/Candy_Land) board game,
complete with decorations and live actors. The children themselves act as the
player pawn pieces.

However, if the kids are halfway across the gymnasium standing on a red square,
how could they possibly draw the next card to tell them which space to progress
toward next? If they had to run all the way to the start to draw a card on every
turn, they could easily get tired or forget their spot on the winding pathway.

To mitigate this issue, I designed a Progressive Web Application (PWA) designed
to run on digital devices of all sizes and strengths. Using modern web
frameworks managed by Webpack, I created an accessible and intuitive interface
that all participants could find in a web browser. Once the site was loaded
once, no network connection was necessary. All of the data is cached client-side
so that, if signal is weak in any given part of the Candyland game, the players
can still interact with the digital deck.

You can give the app a spin [here](https://neillrobson.com/candyland/), and as
usual the source code is available [on GitHub](https://github.com/neillrobson/candyland)!
