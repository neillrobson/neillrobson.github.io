---
layout: post
comments: true
banner: https://www.imperva.com/learn/wp-content/uploads/sites/13/2018/01/buffer-overflow.png
title: 'Grad School Like I''m Five: Buffer Overflow'
author: neill
tags:
- college
- software
date: 2020-11-23T15:25-05:00
---
According to [GitHub](https://github.com), I've written approximately 6,000 lines of code over the course of the past four months (welcome to grad school!).
The question is, can I explain all of the stuff I wrote? <!--more-->
Over the next few blog posts, I'll be trying to present a high-level overview of some of the most interesting concepts that I've learned this past semester.

How high-level, you ask?

The goal is to explain these concepts to a five-year-old.

Not only will this audience choice keep these blog posts short and sweet, it will also help me reassure myself that the boatloads of information I consumed throughout this semester did not simply fall out of my other ear!
And, of course, I hope that you, the reader, find these snippets more entertaining to read than your average textbook chapter.

For this inaugural episode, we will cover... **Buffer Overflow**!

# The Problem

Imagine we're sitting across from each other, with an empty table between us.
The tabletop is wiped so clean, you can see the reflection of the overhead light in the white plastic.
I give you a crayon, and I ask you to draw a cat.
What do you do?
If you're following my instructions, you'll probably start drawing a cat directly on the table.
If I'm a self-respecting grown-up, I'll probably respond by scolding you for drawing on furniture.
But you were only doing what you were told to do!
Grown-ups are so unfair, am I right?

Okay, I'll give you a piece of paper: unlined and white, a blank slate for your work of art.
I set it down in front of you, and ask you once again to draw a cat.
And you do!
It's a cool cat that you draw, and I'm impressed, so I ask you to draw another.
And another.
And another.

![Elementary-aged boy uttering a pickup line to girl](https://pics.me.me/hey-girl-isaw-you-coloring-inside-the-linesearlierandivejust-gotto-say-7937983.png)

After a while, you mention how tired you are, and ask to go play with friends for a while.
Happy with your work, I allow you to go, and I reach down to grab the paper with your fantastic cat drawings.
There's only one problem...

![Whiteboard with dry erase markings on the wall](https://www.kenarry.com/wp-content/uploads/2014/09/how-to-get-dry-erase-marker-off-the-wall2.webp "Mom's face when she sees you've crossed the line")

You've drawn so many cats that you ran out of space on the paper and got markings on the table once again.
With white paper on a white plastic table, who's to blame you for overstepping those boundaries?

In a similar way, computers have a large table on which they can write and draw.
Usually, someone like you and me will lay down pieces of paper for the computer, so that when it draws cats for the cat-drawing program, those cats won't end up on the table or on anyone else's paper sitting nearby.
But the computer can't tell the difference between your paper, my paper, its paper, or the table, so unless we are _very_ specific about the size of what we tell it to draw, it has no problem drawing all over everyone else's work.

Not good.

On top of that, most people give computers enormous amounts of instructions in advance.
Although I just told you to draw one cat at a time (maybe ten cats in all), professional computer people get paid lots of money to tell computers to draw _billions_ of cats at once in the fastest way possible.
It's like your math teacher writing up a billion-problem multiplication drill the night before, handing it to you the next morning, and leaving.

![five-minute multiplication drill](https://www.1989generationinitiative.org/j/2020/07/times-table-worksheets-activity-shelter-multiplication-drill-counting-money-kindergarten.jpg)

There's no way to know in advance if you'll write beyond the lines at some point in that greuling process!

# The Solution (?)

So after cleaning the poor table of all your crayon marks, I decide to fix the problem by using a new type of paper.
This paper, rather than being pure white, has a thick red border around the edges.
We'll call this border the "red zone."
Now, when you're drawing, I can see when your crayon hits the red zone, and choose to change my instructions to you so that you don't venture beyond that zone.
(Of course, you could also use that red zone to guide yourself, but computers aren't as smart as you are.)

In a similar way, I can mark certain edges in the computer's table (we call that table "memory" in the computer) as dangerous regions (red zones).
Whenever a computer tries to write anything on that zone, the programmer can be notified and jump in to change the instructions (the "program") so that the computer doesn't venture past that edge any longer.

![Child stepping on sidewalk bumps](https://www.simplemost.com/wp-content/uploads/2017/02/7275464206_72432c61cd_o_sidewalk-bumps.jpg "We have "red zones" in real life too. Sometimes they're other colors, like yellow.")

No one should be fooled that this strategy solves all of our problems, though.
The red zone is not _preventing_ our computer from drawing outside its region---only warning us of its error.
Furthermore, I could easily instruct the computer (or you!) to draw something "new" far outside the bounds of the paper.
For example, say I want you to draw a cloud in the sky above the various cats.
In that case, you could draw that entire cloud without ever touching the red zone that I've designated.
When I'm watching you, it's easy to spot the error, but again, remember that most big-shot computer programmers send in tasks like billion-question multiplication quizzes in advance.
They don't bother to watch every calculation, but rely on looking at the red zone after the fact to see if their instructions need to be edited.

I could make larger red zones to catch more of these over-steps, but if I make the red zone too big, then no one would be able to draw anything _outside_ of the massive red zone!

---

So that's buffer overflows and red zones in a nutshell.

Those over the age of five might be interested in the open-source tool that I used during my studies to implement a red-zone-based buffer overflow detector.
If so, definitely check out the [DynamoRIO](https://dynamorio.org/) runtime code manipulation system and the [DrCCTProf](https://github.com/Xuhpclab/DrCCTProf) call path profiling tool built atop DynamoRIO.
I cannot yet release my own code to the public for viewing, as grades for the class are still being calculated, but pending the professor's permission I will definitely update this blog post with links for interested parties!

I hope you found this little explanation entertaining and informational.
