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

Some practical examples of this optimization follow.

## Floor as a Function Argument

Choose a relatively complicated function to compute, such as the
[totient summatory function](https://en.wikipedia.org/wiki/Totient_summatory_function).[^why-totient]
Assuming each call naively factorizes each number from $1$ to $n$ and sums the
totient values, running billions of these calls serially is infeasible. But say
the expression to reduce looks more like:

[^why-totient]:
    The summation about to be discussed actually appears in a recursive
    definition of the totient summatory function. The derivation of that
    definition is outside the scope of this post.

$$
\sum_{k=1}^n \Phi \left\lfloor \frac{n}{k} \right\rfloor
$$

Large stretches of that sequence for higher $k$ are constant. Using $n=100$
again for illustration, the latter half (!) of terms can be computed with a
single call to $\Phi$:

$$
\begin{align*}
\sum_{k=1}^{100} \Phi \left\lfloor \frac{n}{k} \right\rfloor &= \sum_{k=1}^{50} \Phi \left\lfloor \frac{n}{k} \right\rfloor + 50 * \Phi \left\lfloor \frac{100}{51} \right\rfloor \\
&= \sum_{k=1}^{50} \Phi \left\lfloor \frac{n}{k} \right\rfloor + 50 * \Phi(1)
\end{align*}
$$

The same concept can collapse many of the terms for $k > \sqrt{n}$.

## Computing the Coefficient

The coefficients are easily computed in any programming language with integer
division. Consider the following loop:

```c
int n = 100;
int total = 0;

for (int i = 1, j; i < n; i = j) {
    j = n / (n / i) + 1;
    total += (j - i) * phisum(n / i);
}
```

The key is the `j` assignment. The expression `n / i` is the floor, and input to
the expensive function. Then `n / (n / i)` yields the _maximum `i` value_
leading to the same floor (confirm this using `n = 100, i = 51` and some mental
math). The further the loop progresses, the larger the jumps get.

## Floor as a Factor

The trick isn't limited to having the floor value as a function parameter. Say
the sum being analyzed is the following, with $\phi$ representing the standard
(not summatory) totient:

$$
\sum_{k=1}^n \left\lfloor \frac{n}{k} \right\rfloor \phi(k)
$$

Here, the summatory totient comes into play again, but this time it'll be used
to compute partial sums over ranges of $k$. Using $n=100$ and looking at the
$51 \leq k \leq 100$ range again, the floor is just $1$ and the sum becomes
$\sum_{k=51}^{100} \phi(k)$. The summatory totient can be used in place of the
iterative sum:

$$
\sum_{k=51}^{100} \phi(k) = \Phi(100) - \Phi(50)
$$

The floor dropped out of that range entirely. To make its contribution a bit
clearer, consider the next lower range of constant floor, $34 \leq k \leq 50$:

$$
\begin{align*}
\sum_{k=34}^{50} \left\lfloor \frac{100}{k} \right\rfloor \phi(k) &= \sum_{k=34}^{50} 2 * \phi(k) \\
&= 2 * \sum_{k=34}^{50} \phi(k) \\
&= 2(\Phi(50) - \Phi(33))
\end{align*}
$$

Is the summatory form of a function any easier to calculate than the regular
function? For the totient, the answer turns out to be "yes" in certain cases. So
long as a summatory formula exists that doesn't include a sigma, the square root
trick can help drastically decrease the amount of grunt work in computing these
sums.
