---
layout: post
title: Euler's Totient and the Square Root Trick
comments: false
---

Many number theory problems can have their complexity reduced down to computing
values and sums from the Euler's totient function. With the right mathematical
tricks, these computations can be reduced to near-linear or even sublinear time.

<!--more-->

## What is the totient?

Euler's totient function, or phi $\phi(n)$ for short, is the count of values
less than $n$ that are also coprime to $n$. For example, $9$ shares factors with
$3$ and $6$. The other six numbers less than $9$ are all coprime to $9$, so
$\phi(9) = 6$.

The straightforward implementation of phi---checking each value less than $n$
for common factors---quickly becomes unwieldy. Only checking values up to
$\sqrt{n}$ is valid, but if a large number of phi values are needed, the
complexity is still above linear.[^linear]

[^linear]: $\mathcal{O}(n^{3/2})$ when computing all values from $1$ to $n$.
