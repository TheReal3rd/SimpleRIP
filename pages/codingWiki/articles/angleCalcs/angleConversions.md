[Home](#home)
[Angle Home](#angleCalcs/angleHome)
# Radians and Degree Conversions

Angles can be measured in **degrees** or **radians**.

Degrees are commonly used when describing rotations in everyday language. For example, a full turn is `360°`.

Radians are commonly used in programming, trigonometry, physics, and game development. A full turn is `2π` radians.

```text
360° = 2π radians
180° = π radians
90° = π / 2 radians
```

Many programming functions, including `sin()`, `cos()`, `tan()`, and `atan2()`, use radians rather than degrees.

## Converting Degrees to Radians

To convert degrees to radians, multiply by π and divide by `180`.

```text
radians = degrees × π / 180
```

Example: convert `90°` to radians.

```text
radians = 90 × π / 180
radians = π / 2
radians = 1.5708
```

Python example:

```python
import math

degrees = 90
radians = degrees * math.pi / 180

print(radians)  # 1.5707963267948966
```

## Converting Radians to Degrees

To convert radians to degrees, multiply by `180` and divide by π.

```text
degrees = radians × 180 / π
```

Example: convert `π / 2` radians to degrees.

```text
degrees = (π / 2) × 180 / π
degrees = 90
```

Python example:

```python
import math

radians = math.pi / 2
degrees = radians * 180 / math.pi

print(degrees)  # 90.0
```

## Conversions Without a Mathematics Library

If a mathematics library is unavailable, use a stored approximation of π.

```text
π ≈ 3.141592653589793
```

Python example:

```python
PI = 3.141592653589793

def degrees_to_radians(degrees):
    return degrees * PI / 180


def radians_to_degrees(radians):
    return radians * 180 / PI


print(degrees_to_radians(90))  # 1.5707963267948966
print(radians_to_degrees(PI / 2))  # 90.0
```

## Common Angle Values

```text
Degrees     Radians
0°          0
45°         π / 4
90°         π / 2
180°        π
270°        3π / 2
360°        2π
```

## Normalising an Angle

Normalising an angle means keeping it within a chosen range.

For example, an angle may need to stay between `0°` and `360°`.

```python
def normalise_degrees(angle):
    while angle < 0:
        angle += 360

    while angle >= 360:
        angle -= 360

    return angle


print(normalise_degrees(-45))  # 315
print(normalise_degrees(450))  # 90
```

The same idea can be used for radians. A full rotation is `2π`.

```python
PI = 3.141592653589793
TWO_PI = PI * 2

def normalise_radians(angle):
    while angle < 0:
        angle += TWO_PI

    while angle >= TWO_PI:
        angle -= TWO_PI

    return angle


print(normalise_radians(-1))  # Approximately 5.283
```

## Calculating an Angle Without `atan2()`

`atan2(y, x)` normally calculates the angle of a direction vector.

```text
angle = atan2(changeY, changeX)
```

If `atan2()` is unavailable but `atan()` is available, calculate the angle using:

```text
angle = atan(changeY / changeX)
```

Then correct the result depending on the direction.

```python
import math

def angle_without_atan2(change_x, change_y):
    PI = 3.141592653589793

    if change_x > 0:
        return math.atan(change_y / change_x)

    if change_x < 0 and change_y >= 0:
        return math.atan(change_y / change_x) + PI

    if change_x < 0 and change_y < 0:
        return math.atan(change_y / change_x) - PI

    if change_x == 0 and change_y > 0:
        return PI / 2

    if change_x == 0 and change_y < 0:
        return -PI / 2

    return 0
```

This works because `atan()` calculates the angle from the slope, while the extra checks identify the correct quadrant.

## Calculating an Angle Without `atan()` or `atan2()`

If neither inverse tangent function is available, approximate `atan()` using a Taylor series.

```text
atan(z) = z - z³ / 3 + z⁵ / 5 - z⁷ / 7 + ...
```

This approximation works best when `z` is between `-1` and `1`.

```python
PI = 3.141592653589793

def atan_approximation(value):
    if value > 1:
        return PI / 2 - atan_approximation(1 / value)

    if value < -1:
        return -PI / 2 - atan_approximation(1 / value)

    result = 0
    term = value
    value_squared = value * value

    for index in range(25):
        denominator = 2 * index + 1

        if index % 2 == 0:
            result += term / denominator
        else:
            result -= term / denominator

        term *= value_squared

    return result
```

This can be combined with the quadrant checks to create a replacement for `atan2()`.

```python
def atan2_approximation(y, x):
    if x > 0:
        return atan_approximation(y / x)

    if x < 0 and y >= 0:
        return atan_approximation(y / x) + PI

    if x < 0 and y < 0:
        return atan_approximation(y / x) - PI

    if x == 0 and y > 0:
        return PI / 2

    if x == 0 and y < 0:
        return -PI / 2

    return 0
```
# References
[Converting Tool](https://www.rapidtables.com/convert/number/degrees-to-radians.html)
[YT Video](https://www.youtube.com/watch?v=kweJN6ywNBI)
[C For Dummies](https://c-for-dummies.com/blog/?p=4139)