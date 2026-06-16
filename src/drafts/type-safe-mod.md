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
manual :: (Integer, Integer) -> Integer
manual = (`mod` modulus) . sum . map (\(x, y) -> x * x * y)
```

Granted, the unbounded numeric type `Integer` is carrying a lot of weight. The
computation could certainly be executed with a bounded type, but avoiding
overflows adds verbosity:

```haskell
import Data.Int (Int32)

-- | Large prime modulus.
modulus :: Int32
modulus = 1000000007

-- | Sum of y*x^2 for the tuples (x, y), under modulus.
manual :: (Int32, Int32) -> Int32
manual = foldl' (\b a -> (b + a) `mod` modulus) 0 . map fn
  where
    fn (x, y) = (x * x `mod` modulus) * y `mod` modulus
```
