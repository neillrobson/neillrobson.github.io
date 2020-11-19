---
layout: post
comments: true
banner: ''
title: 'Grad School Like I''m Five: Buffer Overflow'
author: neill
tags:
  - college
  - software
---

According to [GitHub](https://github.com), I've written approximately 6,000 lines of code over the course of the past four months (welcome to grad school!).
The question is, can I explain all of the stuff I wrote? <!--more-->
Over the next few blog posts, I'll be trying to present a high-level overview of some of the most interesting concepts that I've learned this past semester.

How high-level, you ask?

The goal is to explain these concepts to a five-year old.

Not only will this audience hopefully keep these blog posts short and sweet, it will also help me reassure myself that the boatloads of information I consumed throughout this semester did not simply fall out of my other ear!
And, of course, I hope that you, the reader, find these snippets more entertaining to read than your average textbook chapter.

For this inaugural episode, we will cover... **Buffer Overflow**!

---

Imagine we're sitting across from each other, with an empty table between us.
The tabletop is wiped so clean, you can see the reflection of the overhead light in the white plastic.
I give you a crayon, and I ask you to draw a cat.
What do you do?
If you're following my instructions, you'll probably start drawing a cat directly on the table.
If I'm a self-respecting grown-up, I'll probably respond by scolding you for drawing on furniture.
But you were only doing what you were told to do!
Grown-ups are so unfair, am I right?

Okay, well I'll give you a piece of paper: unlined and white, a blank slate for your work of art.
I set it down in front of you, and ask you once again to draw a cat.
And you do!
It's a cool cat that you draw, and I'm impressed, so I ask you to draw another.
And another.
And another.

![](https://pics.me.me/hey-girl-isaw-you-coloring-inside-the-linesearlierandivejust-gotto-say-7937983.png)

After a while, you mention how tired you are, and ask to go play with friends for a while.
Happy with your work, I allow you to go, and I reach down to grab the paper with your fantastic cat drawings.
There's only one problem...

![Whiteboard with dry erase markings on the wall](https://www.kenarry.com/wp-content/uploads/2014/09/how-to-get-dry-erase-marker-off-the-wall2.webp)
_Mom's face when she sees you've crossed the line_