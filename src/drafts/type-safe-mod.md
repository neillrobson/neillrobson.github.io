---
layout: post
title: Type-Safe Modular Arithmetic in Haskell
comments: false
---

Keeping up with remainders in modular arithmetic is tedious whether working by
hand or in a programming language. Fortunately, Haskell's robust type system
provides a way to abstract away the complexity and check for correctness at
compile time.

<!--more-->

## Manual Residue

Without any special utilities, modular arithmetic in Haskell is easy enough to
write.

```haskell
-- | Large prime modulus.
modulus :: Integer
modulus = 1000000007

-- | Sum of y*x^2 for the tuples (x, y), under modulus.
manual :: [(Integer, Integer)] -> Integer
manual = (`mod` modulus) . sum . map (\(x, y) -> x * x * y)
```

Granted, the unbounded numeric type `Integer` is carrying a lot of weight. The
computation could certainly be executed with a bounded type, but avoiding
overflows adds verbosity:

```haskell
-- | Large prime modulus (but not too large).
modulus :: Word
modulus = 1000000007

-- | Sum of y*x^2 for the tuples (x, y), under modulus.
manual :: [(Word, Word)] -> Word
manual = foldl' (\b a -> (b + a) `mod` modulus) 0 . map fn
  where
    fn (x, y) = (x * x `mod` modulus) * y `mod` modulus
```

Even this solution can lead to overflows for modulus values greater than the
square root of `Word`'s maximum value. If the modulus allows for values, say,
three-quarters the size of `Word`, the expression `a + b` could overflow the
space before the `mod` operator has a chance to trim it back down.[^overflow]

[^overflow]:
    Detecting overflows in additions would require checking if `a + b < a` and,
    if so, subtracting `m` from the result (underflowing back to the answer).
    Multiplication could be handled with the
    [Ancient Egyptian algorithm](https://en.wikipedia.org/wiki/Ancient_Egyptian_multiplication).
    It's all possible, but also all terribly verbose.

And the overflow-handling boilerplate is all for naught if a caller decides to
send in `Word` values that haven't been pre-processed with the modulus. Or
`Word` values that have been pre-processed with a _different_ modulus. The
`Word` data type doesn't contain any information about modular arithmetic,
leaving a wealth of type-level benefits of the Haskell language on the table.

## Type-level Residue

A preferrable Haskell interface for modular arithmetic might look like the
following:

```haskell
type MyMod = Mod 1000000007

-- | Sum of y*x^2 for the tuples (x, y), under modulus.
manual :: [(MyMod, MyMod)] -> MyMod
manual = sum . map (\(x, y) -> x * x * y)
```

No `mod` in sight, and callers are required to pass in instances of `MyMod`
rather than arbitrary integers. It looks good on the surface. The question is
how to define the `Mod` type---and how to specify a numeric constant _as a type
argument_.

Without any extensions, a partial skeleton can be written:

```haskell
-- Wrapping an unbounded Integer, for the privilege of ignoring overflow
newtype Mod m = Mod {unMod :: Integer} deriving (Eq, Ord)

instance Num (Mod m) where
  (*) = undefined
  (+) = undefined
  negate = undefined -- ...and so on
```

In the definition, `m` is the modulus, and `unMod` is the data value being
manipulated in various expressions. To go any further, we need:

- A way to tell Haskell that `m` should be a natural number
- A way to pull that natural number from the "type" program space to the "data"
  program space

Fortunately, GHC provides the `TypeLits`^[i.e. "type literals"] package for this
exact purpose.

## Type Literals

Constraints on types are specified via type classes in Haskell. In the case of a
type-level natural number, the `KnownNat` type class is used:

```haskell
import GHC.TypeLits (KnownNat)

newtype Mod m = Mod {unMod :: Integer} deriving (Eq, Ord)

instance (KnownNat m) => Num (Mod m) where
```

Simply adding that type class in will yield a compilation error: "Expected a
type, but `m` has kind `Nat`." The only "kind" that is typically encountered in
everyday Haskell is `*` (or `Type`), and compositions using the function arrow
`->`.[^maybe] Kinds are, by default, derived automatically by the compiler. The
`newtype Mod m` declaration doesn't imply anything special, so the compiler
gives it kind `*`. It needs to be `Nat`.

[^maybe]:
    For example, `Maybe` has the kind `* -> *`: it takes a type to yield a type.

```haskell
{-# LANGUAGE KindSignatures #-}
import GHC.TypeLits (KnownNat, Nat)

newtype Mod (m :: Nat) = Mod {unMod :: Integer} deriving (Eq, Ord)

instance (KnownNat m) => Num (Mod m) where
```

The declarations may feel redundant, but they serve different purposes. The
`KnownNat` typeclass specifically unlocks the ability to pull the type-level
`Nat` val into a data-level `Natural`. It does so via a Haskell programming
construct called _singletons_.

### Singletons

The fascinating details of singletons are far beyond the scope of this
post[^le]. In short, however, singletons can be thought of as a collection of
related Types, each with only a single term inhabiting it. For natural numbers,
each numeric value is a different _type_ under the singleton umbrella, and
there's only one _term_ associated with each type. In the `TypeNat` source code:

[^le]:
    Check out Justin Le's excellent
    [Introduction to Singletons](https://blog.jle.im/entry/introduction-to-singletons-1.html)
    series for a deep dive into singletons.

```haskell
class KnownNat (n :: Nat) where
  natSing :: SNat n
```

The singleton type is written as `SNat n`, and the singleton value/term is
`natSing`. Neither of those concepts will commonly appear outside library code,
and the library itself is quite inscrutable to read. But the `KnownNat`
definition hints at how that typeclass could provide pattern-matching bridges
between type-level and term-level natural numbers.

## The Num Instance

With all the fancy type-dancing taken care of, implementing the `Num` instance
becomes a bit more straightforward:

```haskell
instance (KnownNat m) => Num (Mod m) where
  mx@(Mod x) * Mod y = Mod $ x * y `mod` natVal mx
  mx@(Mod x) + Mod y = Mod $ if xy > m then xy - m else xy
    where
      xy = x + y
      m = natVal x
  -- ...and so on
```

The trickiest part of reading this code is differentiating between the `Mod`
type constructor and `Mod` data constructor. Keep in mind that the `m` in
`Num (Mod m)` refers to the _modulus_, while the `x` and `y` in the
pattern-matches `Mod x` and `Mod y` refer to the _values being manipulated_
under the modulus.

The `natVal` function takes advantace of the `KnownNat` typeclass to pull the
type-level `Nat` value down to a term-level integer. It needs the entire `Mod`
term (captured with the name `mx`) passed to it, because the data constructor
has no reference to the modulus `Nat` value.[^proxy]

[^proxy]:
    The actual type signature for `natVal` specifies the argument as type
    `Proxy# n`, with `n` constrained as a `KnownNat`. The proxy simply provides
    the type-level structure to conveniently access the type `n`.

A full `Num` instance requires a few more function definitions, but they are all
relatively easy to derive using the tools above. They are left as an exercise to
the reader.

## Mod in Use

At long last, the type-safe modular number interface proposed at the beginning
of this article is possible:

```haskell
type MyMod = Mod 1000000007

-- | Sum of y*x^2 for the tuples (x, y), under modulus.
manual :: [(MyMod, MyMod)] -> MyMod
manual = sum . map (\(x, y) -> x * x * y)
```

Crucially, another number of type, say, `Mod 13` would not add or multiply
directly with the `MyMod` values. The error would be caught _at compile time_.

Getting into and out of the modular world is surprisingly simple.

```haskell
type MyMod = Mod 1000000007
type SmallMod = Mod 13

toMod :: Integer -> MyMod
toMod = Mod -- It's just the data constructor!

fromMod :: MyMod -> Integer
fromMod = unMod -- Again, just a field from the definition.

wackyAddition :: MyMod -> SmallMod -> Integer
wackyAddition (Mod x) (Mod y) = x + y -- Pulling values with pattern matching
```

## Limitations and Next Steps

As mentioned way back in the section on [manual residue](#manual-residue),
overflow is a non-trivial problem to solve when using bounded integral types. To
keep the focus on the type system, the unbounded `Integer` type was used for
value storage in this outline. However, a more memory-efficient implementation
would use a bounded type and careful overflow handling.

On the type-safety side of the discussion, there are many fascinating ways the
`Mod` type's functionality could be expanded now that natural numbers exist at
the type level. Division, for example, isn't generally applicable under a
modulus, but given certain coprimality conditions division can be meaningful.
Detection of a prime modulus, along with special supported functions, is
possible now.
