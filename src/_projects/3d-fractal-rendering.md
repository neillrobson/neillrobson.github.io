---
title: Path-Marched 3D Fractal Renderer
client: NC State University
cover-image: /assets/images/projects/fractal.jpg
tags:
  - JavaScript
  - WebGL
layout: project
year: 2019
---
For my final project in my graphics course, rather than sticking with the
status-quo of triangular surfaces, I wanted to render an object with an infinite
level of detail. Although truly infinite detail is still a pipe dream of
computer graphics enthusiasts, mathematicians have known for a while that
complicated objects could be described by surprisingly simple equations. These
objects, loosely gathered under the label "fractals," could bypass the
limitations of polygon-based rendering, giving viewers the illusion of more
detail on their computer screen than their processor is able to handle.

Since all of computer graphics is an illusion anyway, going the next step with
three-dimensional fractals seemed like an excellent idea to me!

My final result used WebGL to render complicated graphics in any desktop web
browser: even desktops without dedicated graphics cards. The various controls on
the right-hand side of the screen control aspects of the rendering atmosphere
such as the sunlight's angles, sky turbidity, material reflectivity, and
recursion depth. Users can press the `WASD` keys on their keyboard to move the
camera along the ground plane, as well as the `QE` keys to raise and lower the
camera. Camera rotation in all directions can be achieved by holding down
`shift` while pressing the aforementioned letters.

You can play with the simulation [here](http://neillrobson.com/csc562-final),
and view the source on [GitHub](https://github.com/neillrobson/csc562-final).
Feel free to send me any screenshots of impressive renders you create!
