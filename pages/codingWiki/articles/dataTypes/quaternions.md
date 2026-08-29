[Home](#home)
# Quaternions (Data type)

Quaternions are a compact way to represent 3D rotations without the problems that come with Euler angles, especially **gimbal lock**. They are widely used in graphics, robotics, aerospace, and game engines because they compose cleanly, interpolate smoothly, and avoid singularities that plague three-angle representations.

## What is a quaternion?

Think of a quaternion as four numbers:

```python
q = (w, x, y, z)
```

For example:

```python
q = (0.7071, 0.0, 0.0, 0.7071)
```

Here:

- `w` is the **scalar** (real) part
- `(x, y, z)` is the **vector** (imaginary) part

For rotations we normally use **unit quaternions**, meaning their length is 1:

```text
‖q‖ = √(w² + x² + y² + z²) = 1
```

Instead of focusing only on mathematical notation, you can think of:

```python
w = 0.7071
x = 0.0
y = 0.0
z = 0.7071

q = (w, x, y, z)
```

A unit quaternion that rotates by angle θ around a unit axis `(ax, ay, az)` is:

```text
q = (cos(θ/2), ax·sin(θ/2), ay·sin(θ/2), az·sin(θ/2))
```
---

## Why not Euler angles?

Euler angles (or Tait–Bryan angles: yaw/pitch/roll) store orientation as three successive rotations. They are easy to read, but:

1. **Gimbal lock** — when two axes align, you lose a degree of freedom
2. **Ambiguous composition** — order of axes must be agreed on everywhere
3. **Awkward interpolation** — lerping angles can take the long way around

Quaternions avoid these for continuous orientation work. Background.

[Wikipedia: Gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock)
[3Blue1Brown / Ben Eater interactive](https://eater.net/quaternions)

---

## Creating a rotation quaternion

Suppose we want:

```text
Rotate 90° around the Z axis.
```

The axis is:

```python
axis = (0, 0, 1)
```

```python
import math

def quaternion_from_axis_angle(axis, angle_degrees):
    x, y, z = axis

    # Normalize the axis
    length = math.sqrt(x*x + y*y + z*z)
    x /= length
    y /= length
    z /= length

    # Convert degrees to radians
    angle = math.radians(angle_degrees)

    # Quaternion uses half the rotation angle
    half_angle = angle / 2
    w = math.cos(half_angle)
    s = math.sin(half_angle)

    x *= s
    y *= s
    z *= s

    return (w, x, y, z)
```

Usage:

```python
q = quaternion_from_axis_angle(
    axis=(0, 0, 1),
    angle_degrees=90
)

print(q)
```

Result:

```text
(0.7071067811865476, 0.0, 0.0, 0.7071067811865475)
```

So the 90° Z rotation is approximately:

```python
q = (0.7071, 0.0, 0.0, 0.7071)
```

---

## Quaternion multiplication

Multiplication **composes** two rotations: apply `q2` first, then `q1`, when you write `q1 * q2` (common convention in graphics; some libraries reverse it — always check).

```python
def quaternion_multiply(q1, q2):
    w1, x1, y1, z1 = q1
    w2, x2, y2, z2 = q2

    w = w1*w2 - x1*x2 - y1*y2 - z1*z2
    x = w1*x2 + x1*w2 + y1*z2 - z1*y2
    y = w1*y2 - x1*z2 + y1*w2 + z1*x2
    z = w1*z2 + x1*y2 - y1*x2 + z1*w2

    return (w, x, y, z)
```

Example:

```python
qx = quaternion_from_axis_angle((1, 0, 0), 90)
qy = quaternion_from_axis_angle((0, 1, 0), 90)

combined = quaternion_multiply(qy, qx)
print(combined)
```

### Order matters

Quaternion multiplication is **not commutative**:

```python
quaternion_multiply(qx, qy)   # generally ≠
quaternion_multiply(qy, qx)
```

That matches physical 3D rotations: rotate then tilt is not the same as tilt then rotate.

---

## Quaternion conjugate

### What it means

Write `q = (w, x, y, z)` as a scalar plus a 3D vector: `q = w + v`, where `v = (x, y, z)`.

The **conjugate** flips the sign of the vector part and leaves the scalar alone:

```text
q* = (w, −x, −y, −z) = w − v
```

In code:

```python
def quaternion_conjugate(q):
    w, x, y, z = q
    return (w, -x, -y, -z)
```

Example:

```python
q = (0.7071, 0.0, 0.0, 0.7071)
print(quaternion_conjugate(q))
# (0.7071, -0.0, -0.0, -0.7071)
```

### What it does for rotations

For a **unit** rotation quaternion, the conjugate is the **opposite rotation** — same axis, negated angle (or equivalently, negated axis, same angle).

| Quaternion | Meaning |
|------------|---------|
| `q` | rotate +90° about Z |
| `q*` | rotate −90° about Z (undo that turn) |

Useful identities:

```text
(q*)* = q
(q1 · q2)* = q2* · q1*     # conjugate reverses product order
q · q* = q* · q = ‖q‖²     # a real number (scalar quaternion)
```

So conjugating undoes a unit rotation, and conjugating a product reverses the sequence of rotations.

Geometrically: if `q` encodes “spin this way,” `q*` encodes “spin the other way.” That is why vector rotation uses `q * v * q*` (or `q * v * q⁻¹` for unit `q`).

[Wikipedia: Quaternion — Conjugate](https://en.wikipedia.org/wiki/Quaternion#Conjugation) 
[Kuipers, *Quaternions and Rotation Sequences*](https://epdf.pub/quaternions-and-rotation-sequences-a-primer-with-applications-to-orbits-aerospac.html).

---

## Quaternion inverse

### What it means

The **inverse** `q⁻¹` is the quaternion that undoes `q` under multiplication:

```text
q · q⁻¹ = q⁻¹ · q = 1 = (1, 0, 0, 0)
```

For any nonzero quaternion:

```text
q⁻¹ = q* / ‖q‖²
```

That is: take the conjugate, then scale by one over the squared length.

```python
def quaternion_inverse(q):
    w, x, y, z = q
    length_squared = w*w + x*x + y*y + z*z
    return (
        w / length_squared,
        -x / length_squared,
        -y / length_squared,
        -z / length_squared
    )
```

### Unit case: inverse ≡ conjugate

If `q` is a unit quaternion (`‖q‖ = 1`), then `‖q‖² = 1`, so:

```python
def unit_quaternion_inverse(q):
    return quaternion_conjugate(q)
```

That is a major reason rotation code keeps quaternions normalized: **undoing a rotation is free** — just negate `x, y, z`.

### What inverse does in practice

| Operation | Role of inverse / conjugate |
|-----------|-----------------------------|
| Undo a rotation | `q_inv = inverse(q)` then `q_inv * q ≈ identity` |
| Rotate a vector | `q * v * q⁻¹` (sandwich product) |
| Change of frame | conjugating by `q` maps vectors from one basis into another |
| Non-unit `q` | must use true inverse; conjugate alone is wrong |

If you only conjugate a non-unit quaternion, the sandwich product scales the vector by `‖q‖²`. Using the inverse cancels that scale.

```python
# Verify inverse: q * q⁻¹ should be ~ (1, 0, 0, 0)
q = (2, 0, 0, 0)  # not unit
qi = quaternion_inverse(q)
print(quaternion_multiply(q, qi))
# ≈ (1.0, 0.0, 0.0, 0.0)
```

[Wikipedia: Quaternion — Multiplicative inverse](https://en.wikipedia.org/wiki/Quaternion#Algebraic_properties)
[Dam, Koch, Lillholm — Quaternions, Interpolation and Animation](https://web.mit.edu/2.998/www/QuaternionReport1.pdf)

---

## Rotating a vector

This is the most important operation for 3D work.

Suppose:

```python
vector = (1, 0, 0)
```

and we want to rotate it 90° around Z.

A vector is treated as a pure quaternion (scalar part 0):

```python
vector_quaternion = (0, 1, 0, 0)
```

The sandwich product:

```text
v' = q · v · q⁻¹
```

```python
def rotate_vector(q, vector):
    x, y, z = vector
    v = (0, x, y, z)
    q_inverse = quaternion_inverse(q)
    rotated = quaternion_multiply(
        quaternion_multiply(q, v),
        q_inverse
    )
    return (rotated[1], rotated[2], rotated[3])
```

```python
q = quaternion_from_axis_angle((0, 0, 1), 90)
v = (1, 0, 0)
result = rotate_vector(q, v)
print(result)
# (2.220446049250313e-16, 1.0, 0.0)  ≈ (0, 1, 0)
```

The tiny value near zero is floating-point error. Conceptually:

```text
(1, 0, 0)  →  90° about Z  →  (0, 1, 0)
```

For unit `q` you may use `quaternion_conjugate(q)` instead of `quaternion_inverse(q)`.

---

## A cleaner Quaternion class

For real projects, a class keeps call sites readable. The full version used by the example scripts is here:

[Quaternion Class](/pages/codeEmulators/pythonEditor.html#quaternion)

```python
import math


class Quaternion:

    def __init__(self, w, x, y, z):
        self.w = w
        self.x = x
        self.y = y
        self.z = z

    @staticmethod
    def from_axis_angle(axis, angle_degrees):
        x, y, z = axis
        length = math.sqrt(x*x + y*y + z*z)
        x, y, z = x/length, y/length, z/length
        half = math.radians(angle_degrees) / 2
        s = math.sin(half)
        return Quaternion(math.cos(half), x*s, y*s, z*s)

    def __mul__(self, other):
        w1, x1, y1, z1 = self.w, self.x, self.y, self.z
        w2, x2, y2, z2 = other.w, other.x, other.y, other.z
        return Quaternion(
            w1*w2 - x1*x2 - y1*y2 - z1*z2,
            w1*x2 + x1*w2 + y1*z2 - z1*y2,
            w1*y2 - x1*z2 + y1*w2 + z1*x2,
            w1*z2 + x1*y2 - y1*x2 + z1*w2,
        )

    def conjugate(self):
        return Quaternion(self.w, -self.x, -self.y, -self.z)

    def inverse(self):
        n2 = self.w*self.w + self.x*self.x + self.y*self.y + self.z*self.z
        return Quaternion(
            self.w/n2, -self.x/n2, -self.y/n2, -self.z/n2
        )

    def rotate_vector(self, vector):
        v = Quaternion(0, *vector)
        r = self * v * self.inverse()
        return (r.x, r.y, r.z)

    def __repr__(self):
        return (
            f"Quaternion({self.w:.4f}, {self.x:.4f}, "
            f"{self.y:.4f}, {self.z:.4f})"
        )
```

Usage:

```python
q = Quaternion.from_axis_angle(axis=(0, 0, 1), angle_degrees=90)
print(q)
print(q.rotate_vector((1, 0, 0)))
```

```text
Quaternion(0.7071, 0.0000, 0.0000, 0.7071)
(≈0, 1.0, 0.0)
```

---

## Combining rotations

Create two rotations and multiply:

```python
rotate_x = Quaternion.from_axis_angle((1, 0, 0), 90)
rotate_z = Quaternion.from_axis_angle((0, 0, 1), 90)

combined = rotate_z * rotate_x   # apply rotate_x first, then rotate_z
result = combined.rotate_vector((0, 1, 0))
```

```python
from quaternion import Quaternion, format_vec


def main() -> None:
    qx = Quaternion.from_axis_angle((1, 0, 0), 90)
    qz = Quaternion.from_axis_angle((0, 0, 1), 90)
    v = (0.0, 1.0, 0.0)

    # Convention used here: q1 * q2 means apply q2 first, then q1.
    zx = qz * qx
    xz = qx * qz

    print("Start vector:", format_vec(v))
    print()
    print("qz * qx  (X then Z):", format_vec(zx.rotate_vector(v)))
    print("qx * qz  (Z then X):", format_vec(xz.rotate_vector(v)))
    print()
    print("Same result?", zx.almost_equal(xz))
    print("Multiplication is not commutative — order changes the final pose.")


if __name__ == "__main__":
    main()

```

---

## Normalization and smooth blending (SLERP)

Floating-point drift can push `‖q‖` off 1. Renormalize periodically:

```python
def normalize(q):
    w, x, y, z = q
    n = math.sqrt(w*w + x*x + y*y + z*z)
    return (w/n, x/n, y/n, z/n)
```

**SLERP** (spherical linear interpolation) blends two unit orientations along the short arc on the 4D sphere.

```python
from quaternion import Quaternion, format_vec, slerp


def main() -> None:
    print("=== Renormalize after float drift ===")
    q = Quaternion.from_axis_angle((0, 1, 0), 45)
    # Simulate accumulated numerical error.
    drifted = Quaternion(q.w * 1.002, q.x * 1.002, q.y * 1.002, q.z * 1.002)
    fixed = drifted.normalize()
    print("drifted norm:", round(drifted.norm(), 6))
    print("fixed norm:  ", round(fixed.norm(), 6))
    print("fixed q:     ", fixed)

    print()
    print("=== SLERP between two poses ===")
    start = Quaternion.from_axis_angle((0, 0, 1), 0)
    end = Quaternion.from_axis_angle((0, 0, 1), 90)
    probe = (1.0, 0.0, 0.0)

    for t in (0.0, 0.25, 0.5, 0.75, 1.0):
        q_t = slerp(start, end, t)
        print(f"t={t:.2f}  q={q_t}  v'={format_vec(q_t.rotate_vector(probe))}")

    print()
    print("Halfway (t=0.5) is a 45° Z rotation — smooth arc, not a straight lerp.")


if __name__ == "__main__":
    main()
```


[Wikipedia: Slerp](https://en.wikipedia.org/wiki/Slerp).

---

## The whole idea in code

If you remember only the workflow:

```python
# 1. Create rotation
q = Quaternion.from_axis_angle(axis=(0, 0, 1), angle_degrees=90)

# 2. Create vector
v = (1, 0, 0)

# 3. Rotate vector
result = q.rotate_vector(v)
```

Or stack rotations:

```python
qx = Quaternion.from_axis_angle((1, 0, 0), 90)
qy = Quaternion.from_axis_angle((0, 1, 0), 90)
q = qy * qx
result = q.rotate_vector((0, 0, 1))
```

Four operations cover most day-to-day use:

```python
Quaternion.from_axis_angle(...)
q1 * q2
q.inverse()          # or q.conjugate() when ‖q‖ = 1
q.rotate_vector(...)
```

---

## Quick reference: conjugate vs inverse

| | Conjugate `q*` | Inverse `q⁻¹` |
|--|----------------|---------------|
| Formula | `(w, −x, −y, −z)` | `q* / ‖q‖²` |
| Unit quaternion | Same as inverse | Same as conjugate |
| Non-unit | Opposite vector part only | True multiplicative undo |
| Undoes rotation? | Yes, if unit | Always (if nonzero) |
| Cost | Negate three floats | Negate + divide by length² |

---

## Example Code
[Quaternion Class](/pages/codeEmulators/pythonEditor.html#quaternion)
[Quaternion Basics](/pages/codeEmulators/pythonEditor.html#quaternion_basics)
[Quaternion Conjugate and Inverse](/pages/codeEmulators/pythonEditor.html#quaternion_conjugate_inverse)

---

## References

[Wikipedia: Quaternion](https://en.wikipedia.org/wiki/Quaternion)
[Wikipedia: Quaternions and spatial rotation](https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation)
[Wikipedia: Gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock)
[Wikipedia: Quaternion conjugation](https://en.wikipedia.org/wiki/Quaternion#Conjugation)
[Wikipedia: Slerp](https://en.wikipedia.org/wiki/Slerp)
[Kuipers, J. B. *Quaternions and Rotation Sequences*. Princeton University Press Publisher page](https://epdf.pub/quaternions-and-rotation-sequences-a-primer-with-applications-to-orbits-aerospac.html)
[Dam, E. B., Koch, M., & Lillholm, M. (1998). *Quaternions, Interpolation and Animation*. Technical Report. MIT PDF](https://web.mit.edu/2.998/www/QuaternionReport1.pdf)
[Shoemake, K. (1985). *Animating Rotation with Quaternion Curves*. SIGGRAPH. ACM DL](https://dl.acm.org/doi/10.1145/325334.325242)
[3Blue1Brown / Ben Eater — Visualizing quaternions](https://eater.net/quaternions)
[SciPy production-ready alternative to hand-rolled code](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.html)
[YouTube Quaternions](https://youtu.be/zjMuIxRvygQ?si=j4YEnWvOApYbVM0g)