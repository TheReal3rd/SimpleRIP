[Home](#home)
[Angle Home](#angleCalcs/angleHome)
# Quaternion Angle Calculations

Quaternions are a way to represent rotation in three-dimensional space. They are commonly used in games, simulations, robotics, and 3D graphics.

A quaternion can store an object's orientation without using separate X, Y, and Z rotation values.

Quaternions are useful because they avoid a problem called **gimbal lock**, which can happen when using Euler angles.

A quaternion usually has four values:

```text
(x, y, z, w)
```

* `x`, `y`, and `z` represent the rotation axis.
* `w` represents the rotation amount.

## Why Use Quaternions?

Euler angles use three separate rotations:

```text
X = pitch
Y = yaw
Z = roll
```

This is simple to understand, but rotating around multiple axes can cause gimbal lock. Gimbal lock can make an object lose one possible direction of rotation.

Quaternions represent rotation as one combined value instead. This makes them useful for smooth 3D movement and rotation.

Common uses include:

* Rotating a 3D character towards a target.
* Rotating a camera smoothly.
* Interpolating between two rotations.
* Controlling vehicles, spaceships, or physics objects.
* Storing object orientation in game engines.

## Creating a Quaternion From an Axis and Angle

A quaternion can be created using an axis and an angle.

The axis describes the direction of rotation. For example:

```text
(0, 1, 0)
```

This represents the Y-axis, which is commonly used for turning left and right.

The angle describes how far the object rotates.

The quaternion formula is:

```text
x = axisX × sin(angle / 2)
y = axisY × sin(angle / 2)
z = axisZ × sin(angle / 2)
w = cos(angle / 2)
```

> **Note:** The angle must be in radians before using `sin()` and `cos()`.

## Example: Rotate 90 Degrees Around the Y-Axis

A 90-degree rotation around the Y-axis uses:

```text
axis = (0, 1, 0)
angle = 90 degrees
```

First, convert the angle into radians:

```text
90 × π / 180 = π / 2
```

Then divide it by two:

```text
π / 2 ÷ 2 = π / 4
```

The quaternion becomes:

```text
x = 0 × sin(π / 4) = 0
y = 1 × sin(π / 4) = 0.707
z = 0 × sin(π / 4) = 0
w = cos(π / 4) = 0.707
```

The final quaternion is approximately:

```text
(0, 0.707, 0, 0.707)
```

## Python Example: Axis and Angle to Quaternion

```python
import math

def axis_angle_to_quaternion(axis_x, axis_y, axis_z, angle_degrees):
    angle_radians = angle_degrees * math.pi / 180
    half_angle = angle_radians / 2

    x = axis_x * math.sin(half_angle)
    y = axis_y * math.sin(half_angle)
    z = axis_z * math.sin(half_angle)
    w = math.cos(half_angle)

    return x, y, z, w


rotation = axis_angle_to_quaternion(0, 1, 0, 90)

print(rotation)
# (0.0, 0.7071067811865475, 0.0, 0.7071067811865476)
```

## Calculating the Angle Stored in a Quaternion

For a normalised quaternion, the rotation angle can be found using the `w` value.

```text
angle = 2 × acos(w)
```

The result is in radians.

To convert it into degrees:

```text
degrees = angle × 180 / π
```

For the quaternion:

```text
(0, 0.707, 0, 0.707)
```

The calculation is:

```text
angle = 2 × acos(0.707)
angle = 1.570 radians
angle = 90 degrees
```

## Python Example: Quaternion to Angle

```python
import math

def quaternion_to_angle(x, y, z, w):
    angle_radians = 2 * math.acos(w)
    angle_degrees = angle_radians * 180 / math.pi

    return angle_degrees


angle = quaternion_to_angle(0, 0.70710678, 0, 0.70710678)

print(angle)
# Approximately 90
```

## Calculating the Angle Between Two Quaternions

To find how far apart two rotations are, calculate the dot product of the two quaternions.

```text
dot = x1 × x2 + y1 × y2 + z1 × z2 + w1 × w2
```

Then calculate the angle:

```text
angle = 2 × acos(abs(dot))
```

The `abs()` function is used because a quaternion and its negative represent the same rotation.

## Example: Comparing Two Rotations

Quaternion one represents no rotation:

```text
q1 = (0, 0, 0, 1)
```

Quaternion two represents a 90-degree rotation around the Y-axis:

```text
q2 = (0, 0.707, 0, 0.707)
```

Calculate the dot product:

```text
dot = (0 × 0) + (0 × 0.707) + (0 × 0) + (1 × 0.707)

dot = 0.707
```

Calculate the angle:

```text
angle = 2 × acos(0.707)

angle = 90 degrees
```

## Python Example: Angle Between Two Quaternions

```python
import math

def angle_between_quaternions(q1, q2):
    x1, y1, z1, w1 = q1
    x2, y2, z2, w2 = q2

    dot = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2

    # Prevent small floating-point errors from causing an invalid acos value.
    dot = max(-1, min(1, dot))

    angle_radians = 2 * math.acos(abs(dot))
    angle_degrees = angle_radians * 180 / math.pi

    return angle_degrees


q1 = (0, 0, 0, 1)
q2 = (0, 0.70710678, 0, 0.70710678)

print(angle_between_quaternions(q1, q2))
# Approximately 90
```

## Quaternion Interpolation

Quaternions can be smoothly blended between two rotations. This is called **spherical linear interpolation**, usually shortened to **SLERP**.

For example, a camera can rotate smoothly from one direction to another instead of instantly snapping to the new angle.

Many game engines provide built-in SLERP functions, such as `Quaternion.Slerp()` in Unity.

# References

[Unity Manual – Rotation and Orientation in Unity](https://docs.unity3d.com/Manual/QuaternionAndEulerRotationsInUnity.html)
[Wikipedia – Quaternion](https://en.wikipedia.org/wiki/Quaternion)
[Wikipedia – Spherical Linear Interpolation](https://en.wikipedia.org/wiki/Slerp)
