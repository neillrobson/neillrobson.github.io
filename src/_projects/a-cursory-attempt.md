---
title: A Cursor-y Attempt
client: Ludum Dare 35
cover-image: /assets/images/projects/ld35.png
tags:
  - JavaScript
  - HTML
layout: project
year: 2016
---
In April 2016, I participated in my first-ever video game design competition:
Ludum Dare. The experience of developing and publishing a video game from
scratch within a 48-hour time frame (!) was exhilarating and enlightening, and I
couldn't wait to see how it turned out. Unfortunately, right before the results
were announced, I conveniently boarded a plane to China, and subsequently
completely forgot about the competition and my entry until returning to the US.

Of course, I am now a few months late sharing the experience (and results) here
on the blog, but better late than never I suppose!

If you want to skip straight to where I talk about the game I made, just head
[here](#myentry).

## The Competition

![Ludum Dare logo](/assets/images/2016/06/ludum-dare-long.jpg)

Ludum Dare: the Latin phrase roughly translates into "to give a game." The Ludum
Dare community is most well known for its "Accelerated Game Development Event"
of the same name.

Participants in the Ludum Dare competition have 48 hours to design a game--from
scratch--adhering to a theme announced at the beginning of the contest. Entries
are judged and ranked in 7 categories, including audio, graphics, innovation,
adherence to the theme, and so on.

This time, the theme was **Shapeshift**. I was one of 2,712 entries.

For anyone interested in further background about the rules, operations, or
history of the Ludum Dare competition, feel free to check out [the
homepage](http://ludumdare.com/compo/) or [the
rules](http://ludumdare.com/compo/rules/).

## My Entry <a id="myentry"></a>

![An in-progress session of my
game](/assets/images/2016/06/Screenshot-from-2016-06-27-14-42-04.png)

[Check it out!](/LD35)

A lot of information can already be found at the link above. So that players
would not have to download anything (and could play the game regardless of their
operating system), I opted to write a browser-based game in pure Javascript.

The basic idea is that you have a cursor that can be maneuvered around on a
grid. Colored boxes are strewn about the grid as well, and whenever the cursor
passes over a box, the box is "teleported" to another grid *based on the
direction that the cursor passed over the box*.

So where does the theme "Shapeshift" come into play? Well, if you are able to
*shift* the tiles into the *shape* of an apple tree, then you win the game!

If you haven't already, go ahead and check it out at the link above. Don't worry
if you can't complete the puzzle; what's important is to get the experience of
messing with it.

## The Results

Here are the [top games ranked by
category](http://ludumdare.com/compo/ludum-dare-35/).

If you click on
[innovation](http://ludumdare.com/compo/ludum-dare-35/?action=top&cat=Innovation),
and you scroll down to 6th place, you'll find my entry!

I'm flabbergasted and humbled to have received such a fine rank considering this
was my first attempt at such a competition. To be sure, you would be doing
yourself quite a disservice if you didn't go check out some of the other
highly-ranked games; they are astonishing! Keep in mind that all of these
entries were constructed from scratch in only 48 hours!

## Reflections

I certainly made many more mistakes during this competition than successes. For
one, choosing not to use a game-creation engine or library was a terrible
inconvenience to me. Furthermore, pure Javascript (of all inappropriate
languages) is simply not suited for video game development, and if I were to
expand on this project I would most certainly have to begin by translating the
current product into a different language!

As I stated previously, the main reason for choosing Javascript as my working
environment was to produce a Web-based game that required no downloading. That
being said, there are plenty of other languages that compile to a
browser-readable format that would have been better suited for the task.

As far as the game itself goes, I think it certainly reflects my more abstract
creative thought patterns. In the context of a 48-hour race, I think this
tendency is simply expected, but in a more relaxed environment the game
definitely needs a boatload of polish and, well, accessibility added to
"humanize" my often absurd ideas. With absolutely no assets (graphics, music,
etc), the game does a terrible job at "selling itself," and even for the
determined people who manage to construct the entire tree out of the tiles,
there isn't even a "You Win!" screen. I definitely failed in this respect.

Again, choosing a different development language and environment would have been
an excellent help in rounding off many of the aforementioned rough edges.
However, my greatest success in this first attempt was certainly my tenacity:
even realizing at the 24-hour mark what terrible mistakes I was making, and
watching my lofty dreams come tumbling down to a humble reality, by sticking
with the imperfect pieces I had I was able to make an infinitely higher-quality
product than if I had been wishy-washy in my development choices.

---

In any case, I probably would have had much more to say if this postmortem had
been drafted closer to the competition date; but alas, given the constraints of
living in China, I did what I could! Hopefully you found some entertainment or
insights in the game or my tangentially-related ramblings.

If by any chance you are also familiar with web development and want to check
out (or contribute to!) the [source code](https://github.com/neillrobson/LD35),
well, you know where to go.
