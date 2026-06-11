[Home](#home)

# Euclidean Distance

Euclidean distance is a traditional distance measurement that provides the direct distance between two points.

For example, the distance from (0, 0) to (0, 10) is 10 units. The exact measurement depends on the vector values provided.

---

## Code:

```python
# In Python and many other languages, a math library is required for square root functions.
import math

# Implementation 1:
def euclidean(posX, posY, posX1, posY1):
    xDiff = posX - posX1
    yDiff = posY - posY1
    return math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
    
# Implementation 2:
def euclidean(posX, posY, posX1, posY1):
    return math.hypot(posX1 - posX, posY1 - posY)
    
# Implementation 3:
def euclidean(posX, posY, posX1, posY1):
    return math.sqrt((posX1 - posX)**2 + (posY1 - posY)**2)
    
```
These examples all implement the same calculation but differ slightly in code style and footprint. They all require a mathematical function such as sqrt or hypot.

If performance is a concern, you can omit the square root and work with squared distances. This can provide a slight speed increase when performing a high volume of distance calculations.

```python
# Implementation 1 (without square root):
def euclidean(posX, posY, posX1, posY1):
    xDiff = posX - posX1
    yDiff = posY - posY1
    return (xDiff * xDiff) + (yDiff * yDiff)
    
# Implementation 2 (without square root):
def euclidean(posX, posY, posX1, posY1):
    return (posX1 - posX)**2 + (posY1 - posY)**2
```

When using squared distances, you need to compare against the squared threshold. For example, to check if a point is 10 units away, compare against 10 * 10 = 100.

---

## Uses and ideas:
* Collision Detection: Check if objects with circular or spherical shapes collide by comparing distances to the radius.
* Finding Closest Objects: Determine the nearest object (e.g., items on the ground) to provide interaction prompts.
* Proximity Checks: Detect if an object or projectile is close enough to trigger further logic, such as warnings or explosions.

### Advantages of Squared Distance:
* Useful in high-volume checks, such as in voxel-based games or simulations.
* Reduces computation by avoiding the square root operation.

---

## Code Examples:
[EuclideanExample1](/pages/codeEmulators/pythonEditor.html#euclideanExample1)

---

## Referances:
[Vector](#dataTypes/vector)
[Wikipedia](https://en.wikipedia.org/wiki/Euclidean_distance)
[Hypot W3Schools](https://www.w3schools.com/python/ref_math_hypot.asp)
