---
layout: post
title: The Square Root Trick for Fast Summations
comments: false
---

Computing sums or products of billions of terms can cripple even modern
machines. For sequences that round terms to integers, a simple trick can reduce
the workload to a sublinear runtime complexity.

<!--more-->

## Summing the Floor

Take a simple example to illustrate the analytical process:

$$
\sum_{k=1}^n \left\lfloor \frac{n}{k} \right\rfloor
$$

Let $n=100$ for demonstration. Without the floor, the sum would be
$100+50+33.\overline{3}+...+1.\overline{01}+1$. That's one hundred unique terms.

Including the floor function drops the decimal portion of each term. For the
first ten terms, the effect isn't particularly notable:

$$
100+50+33+25+20+16+14+12+11+10+...
$$

Consider the ninety remaining terms. Given the sequence definition, they are
monotonically decreasing: none of them will be greater than $10$. The final term
is also known to be $1$. Every term is an integer.

Ninety terms, ten options for any given term: **many terms must be repeated**.
Take $51 \leq k \leq 100$: every single one of those terms is just $1$. Rather
than computing fifty expensive divisions, if the terms are known to be constant
in that subsequence, the contribution of that portion can be expressed as
$50*1$.

Zooming back out to the entire sum, the one hundred terms have been reduced to
roughly twenty unique values: ten terms from $1 \leq k \leq 10$, then ten more
for all $k$ above that. More generally, for any $n$, the number of unique terms
becomes $2\sqrt{n}$, with half of those appearing for $k \leq \sqrt{n}$ and the
other half above.

For smaller $n$ and simple term expressions, the difference is negigible. But
given more complicated terms and $n=10\,000\,000\,000$, the computation overhead
has been cut from ten billion items to two hundred thousand---a significant
improvement.

## Floor as a Function Argument

## Floor as a Factor
