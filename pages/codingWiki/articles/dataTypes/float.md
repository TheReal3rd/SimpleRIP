[Home](#home)
# Floating Point (Data type)

A floating-point value is a number with a decimal point.
Used for real-world values like positions or measurements.

Examples: 10.5, -60.2

## Advanced explinations:
Similar to integers, but floating-point numbers are always signed.
They can be positive or negative.

There are multiple levels of precision:
* Half (FP16): 16-bit, low precision
* Single (FP32): 32-bit, standard precision
* Double (FP64): 64-bit, high precision

Higher precision:
* bigger range
* better accuracy

If overflow happens, or exponent bits are all 1:
* value becomes +__Infinity__ or -__Infinity__
* or __NaN__ (Not a Number)

Note: behavior depends on the language, but usually follows IEEE 754.

# Exampe Code:
Floating-point values and operations.

```python
#Definitions of 3 Values 2 floats and 1 integer.
num = 3.5
num2 = 10.6
num3 = 10

#Basic operations.
result = num * num2
print(result)

result = num + num3
print(result)
```

In Python, you do not need to declare the type.
A decimal makes it a float.

```java
public class MyClass {
  public static void main(String args[]) {
    float num = 3.5f;
    float num2 = 10.6f;
    int num3 = 10;

    float result = num * num2;
    System.out.println(result);
    
    result = num + num3;
    System.out.println(result);
  }
}
```
[Online Java Compiler](https://www.jdoodle.com/online-java-compiler)

In Java, you must declare the type.
Same logic. Different syntax.

## Binary (Floating Point)

Floating-point numbers use a standard called **IEEE 754**.

They are not stored like integers.  
They are split into 3 parts:

| Sign | Exponent |   Mantissa (Fraction)   |
|------|----------|-------------------------|
|   0  | 10000010 | 01010000000000000000000 |

- **Sign bit**: 0 = positive, 1 = negative  
- **Exponent**: controls the scale (power of 2)  
- **Mantissa**: stores the precision of the number  

### Example (Simple View)

Number: **10.5**

Binary (approximate):  
10 = `1010`  
0.5 = `0.1`  

So:
`1010.1`

Normalize (scientific binary form):  
`1.0101 × 2^3`

### How it is Stored (FP32 example)

- Sign = `0` (positive)  
- Exponent = `3 + bias (127)` = `130` → `10000010`  
- Mantissa = `01010000000000000000000` (leading 1 is removed)

Final binary:
0 10000010 01010000000000000000000

### Important Notes

- Values are **approximate**, not exact  
- Some numbers (like 0.1) cannot be stored exactly  
- This can cause small rounding errors  

Example:
0.1 + 0.2 ≠ 0.3 (exactly)

### Special Values

When all exponent bits are 1:

- Mantissa = 0 → **Infinity** (+∞ or -∞)  
- Mantissa ≠ 0 → **NaN** (Not a Number)  


### Summary

- Floating-point = sign + exponent + mantissa  
- Uses powers of 2  
- Not always exact  
- Can represent very large and very small numbers  

# References:
[IEEE 754 Wikipedia](https://en.wikipedia.org/wiki/IEEE_754)
[Floating-point Arithmatic Wikipedia](https://en.wikipedia.org/wiki/Floating-point_arithmetic)


