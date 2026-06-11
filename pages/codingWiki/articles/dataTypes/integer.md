[Home](#home)
# Integer (Data type)
 
An integer is a basic data type in programming. It stores whole numbers.
These numbers can be __positive__ or __negative__.

## Advanced explination:
More detail. Skip if not ready.

Integers have size limits based on how many bits are used.
Example: an __8-bit unsigned integer__ can store values from __0 to 255__.

Some integers allow negative numbers. Some do not.
This is called __signed__ (can be negative) and __unsigned__ (only positive).

Example (8-bit):
* Unsigned: 0 to 255
* Signed: -128 to 127

Signed reduces the positive range because one bit is used for the sign.

### Binary
Binary is a system using only two values: __0 and 1__.
Each value is a __bit__.

Computers group bits together.
Example: an __8-bit value__ = 8 bits.

#### Binary Conversion Table:
| 128 | 64  | 32  | 16  | 8   | 4   | 2   | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0   | 0   | 0   | 1   | 0   | 0   | 1   | 1   |
| 1   | 0   | 0   | 1   | 1   | 0   | 1   | 1   |

Convert by adding columns with 1.
* 00010011 → 16 + 2 + 1 = 19
* 10011011 → 128 + 16 + 8 + 2 + 1 = 155

##### Signed Binary (Two’s Complement)

Signed numbers usually use two’s complement, not just a simple sign bit.

* If first bit = 0 → positive
* If first bit = 1 → negative

| Sig | 64  | 32  | 16  | 8   | 4   | 2   | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0   | 0   | 0   | 1   | 0   | 0   | 1   | 1   |
| 1   | 0   | 0   | 1   | 1   | 0   | 1   | 1   |

Example:
* 00010011 = 19
* 10011011 = -101

### Extra
__Python__ integers are not fixed size like in many languages.
They can grow very large (limited by memory).

But:
* Bigger numbers = more memory
* Bigger numbers = slower operations

There are also libraries for very large numbers, but Python already handles big integers well.

# References
[YouTube](https://www.youtube.com/watch?v=_9bAlgRzlkc)
[Numbers Python W3Schools](https://www.w3schools.com/python/python_numbers.asp)
