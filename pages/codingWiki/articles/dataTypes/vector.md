[Home](#home)
# Vector

A vector is a value object used to store a position or multiple values within a single object.

It is usually using floating-point values or double-precision values.

The components are typically denoted as X, Y, and Z, with Z being required for 3D applications.

There are also implementations of vectors using integer value types to reduce memory usage and computational cost.

---

## Code Example
This example demonstrates a simple implementation of a 2D vector.

The value type uses floating-point format to provide accuracy for high-resolution 2D space. 
This implementation can easily be adapted for 3D space by adding a Z component and the corresponding logic to handle it.

This class also integrates with Python’s operator overloading, allowing vector objects to be added, subtracted, and multiplied like traditional numeric values.

```python

class Vector2F():
    x = 0.0
    y = 0.0
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
    def __add__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x + value.x, self.y + value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x + value, self.y + value)
        return NotImplemented
            
    def __sub__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x - value.x, self.y - value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x - value, self.y - value)
        return NotImplemented
    
    def __mul__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x * value.x, self.y * value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x * value, self.y * value)
        return NotImplemented
    
    def __iadd__(self, value):
        return self.__add__(value)

    def __isub__(self, value):
        return self.__sub__(value)
    
    def __imul__(self, value):
        return self.__mul__(value)
        
    def __repr__(self):
        return f"Vector2F(x={self.x}, y={self.y})"

```

This example can be adapted to other value formats, such as integers. Try implementing or adapting this code in another programming language as a challenge.

This example uses a __class object__. To learn more about classes and their usage, refer to the __References__ section.

### Extended Vector Operations.

Within this section provides extended functionality that could be useful within projects. But aren't required.
__Ignore this section to keep it simple once you're ready then expand to this section...__

#### Magnitude (length)
* The size or length of a vector
* Tells you how far the vector reaches
* Calculated using the Pythagorean theorem
* Always a non-negative number (zero or positive)
* Example use: measuring distance or speed

#### Normalization
* The process of converting a vector to length = 1 (unit vector)
* Keeps the direction the same, but removes the magnitude
* Done by dividing each component by the vector’s magnitude
* Useful when you only care about direction, not size
* Example use: movement direction in games (consistent speed)

#### Dot product

* A mathematical operation between two vectors
* Multiplies corresponding components and adds them together
* Result is a single number (scalar), not a vector
* Indicates how similar two directions are:
	* Positive → similar direction
	* Zero → perpendicular
	* Negative → opposite direction
* Example use: checking angles, lighting calculations, or alignment

```python
import math

def length(self):
    return math.sqrt(self.x**2 + self.y**2)

def normalize(self):
    l = self.length()
    if l == 0:
        return Vector2F(0, 0)
    return Vector2F(self.x / l, self.y / l)

def dot(self, other):
    return self.x * other.x + self.y * other.y
```

---

## Uses examples.

* Game development (position, velocity)
* Physics simulations
* Graphics (movement, transformations)
* UI positioning

__WIP__

Code snippets and projects code will be provided later.

---

## References:
[Godot Docs Vector3](https://docs.godotengine.org/en/stable/classes/class_vector3.html)
[Wikipedia](https://en.wikipedia.org/wiki/Position_(geometry))
[YouTube Explination](https://www.youtube.com/watch?v=fNk_zzaMoSs)