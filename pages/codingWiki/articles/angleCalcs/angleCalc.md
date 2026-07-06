[Home](#home)
[Angle Home](#angleCalcs/angleHome)
# Calculating the Angle Between Two Points

In programming, you can calculate the angle from one point to another using coordinates.

A point is usually written as:

```text
(x, y)
```

For example, imagine an object at `(2, 3)` that needs to face another object at `(8, 7)`.

To find the angle, first calculate the horizontal and vertical distance between the two points:

```text
changeX = targetX - startX
changeY = targetY - startY
```

Then use the `atan2()` function.

```text
angle = atan2(changeY, changeX)
```

The `atan2()` function returns an angle in **radians**. Many games and programs use degrees instead, so you may need to convert the result.

```text
degrees = radians × 180 / π
```

## Example

Start point:

```text
(2, 3)
```

Target point:

```text
(8, 7)
```

The differences are:

```text
changeX = 8 - 2 = 6
changeY = 7 - 3 = 4
```

The angle is calculated using:

```text
angle = atan2(4, 6)
```

This gives an angle of approximately `33.7°`.

## Python Example

```python
import math

startX = 2
startY = 3

targetX = 8
targetY = 7

changeX = targetX - startX
changeY = targetY - startY

angleRadians = math.atan2(changeY, changeX)
angleDegrees = math.degrees(angleRadians)

print(angleDegrees)  # About 33.7
```

## C Example

```c
#include <stdio.h>
#include <math.h>

int main() {
    float startX = 2;
    float startY = 3;

    float targetX = 8;
    float targetY = 7;

    float changeX = targetX - startX;
    float changeY = targetY - startY;

    float angleRadians = atan2(changeY, changeX);
    float angleDegrees = angleRadians * 180 / M_PI;

    printf("Angle: %.2f degrees\n", angleDegrees);

    return 0;
}
```

## Using the Angle in Games

Angle calculations are commonly used in games to make an object face another object.

For example:

* An enemy can turn towards the player.
* A bullet can travel towards a target.
* A character can look towards the mouse cursor.
* A turret can rotate towards an object.

If your game engine uses degrees from `0` to `360`, convert negative angles like this:

```python
if angleDegrees < 0:
    angleDegrees += 360
```

This means:

* `0°` points right.
* `90°` points up.
* `180°` points left.
* `270°` points down.

> **Note:** Some game engines use a screen coordinate system where the Y-axis increases downward. In that case, use `-changeY` when calculating the angle.

```python
angleRadians = math.atan2(-changeY, changeX)
```

# References

[Python math.atan2](https://docs.python.org/3/library/math.html#math.atan2)
[MDN Web – Math.atan2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2)
[Wikipedia – atan2](https://en.wikipedia.org/wiki/Atan2)
