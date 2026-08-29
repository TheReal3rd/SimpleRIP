from __future__ import annotations

import math
from typing import Iterable, Tuple

Vec3 = Tuple[float, float, float]


class Quaternion:
    """Unit-friendly quaternion: (w, x, y, z)."""

    def __init__(self, w: float, x: float, y: float, z: float) -> None:
        self.w = w
        self.x = x
        self.y = y
        self.z = z

    @staticmethod
    def identity() -> Quaternion:
        return Quaternion(1.0, 0.0, 0.0, 0.0)

    @staticmethod
    def from_axis_angle(axis: Iterable[float], angle_degrees: float) -> Quaternion:
        x, y, z = axis
        length = math.sqrt(x * x + y * y + z * z)
        if length == 0.0:
            raise ValueError("axis must be non-zero")
        x, y, z = x / length, y / length, z / length
        half = math.radians(angle_degrees) / 2.0
        s = math.sin(half)
        return Quaternion(math.cos(half), x * s, y * s, z * s)

    def norm(self) -> float:
        return math.sqrt(
            self.w * self.w + self.x * self.x + self.y * self.y + self.z * self.z
        )

    def normalize(self) -> Quaternion:
        n = self.norm()
        if n == 0.0:
            raise ValueError("cannot normalize a zero quaternion")
        return Quaternion(self.w / n, self.x / n, self.y / n, self.z / n)

    def conjugate(self) -> Quaternion:
        """Flip the vector part: (w, -x, -y, -z). For unit q, this is q⁻¹."""
        return Quaternion(self.w, -self.x, -self.y, -self.z)

    def inverse(self) -> Quaternion:
        """Multiplicative inverse: conjugate / ‖q‖²."""
        n2 = self.w * self.w + self.x * self.x + self.y * self.y + self.z * self.z
        if n2 == 0.0:
            raise ValueError("cannot invert a zero quaternion")
        return Quaternion(
            self.w / n2,
            -self.x / n2,
            -self.y / n2,
            -self.z / n2,
        )

    def __mul__(self, other: Quaternion) -> Quaternion:
        w1, x1, y1, z1 = self.w, self.x, self.y, self.z
        w2, x2, y2, z2 = other.w, other.x, other.y, other.z
        return Quaternion(
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
            w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
        )

    def rotate_vector(self, vector: Iterable[float]) -> Vec3:
        """Rotate a 3D vector with the sandwich product q * v * q⁻¹."""
        x, y, z = vector
        v = Quaternion(0.0, x, y, z)
        r = self * v * self.inverse()
        return (r.x, r.y, r.z)

    def almost_equal(self, other: Quaternion, tol: float = 1e-9) -> bool:
        return (
            abs(self.w - other.w) <= tol
            and abs(self.x - other.x) <= tol
            and abs(self.y - other.y) <= tol
            and abs(self.z - other.z) <= tol
        )

    def __repr__(self) -> str:
        return (
            f"Quaternion({self.w:.4f}, {self.x:.4f}, "
            f"{self.y:.4f}, {self.z:.4f})"
        )


def slerp(q0: Quaternion, q1: Quaternion, t: float) -> Quaternion:
    """Spherical linear interpolation between unit quaternions, t in [0, 1]."""
    a = q0.normalize()
    b = q1.normalize()

    dot = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z

    # Take the short path on the sphere.
    if dot < 0.0:
        b = Quaternion(-b.w, -b.x, -b.y, -b.z)
        dot = -dot

    # Nearly parallel: fall back to linear blend.
    if dot > 0.9995:
        return Quaternion(
            a.w + t * (b.w - a.w),
            a.x + t * (b.x - a.x),
            a.y + t * (b.y - a.y),
            a.z + t * (b.z - a.z),
        ).normalize()

    theta_0 = math.acos(max(-1.0, min(1.0, dot)))
    theta = theta_0 * t
    sin_theta = math.sin(theta)
    sin_theta_0 = math.sin(theta_0)

    s0 = math.cos(theta) - dot * sin_theta / sin_theta_0
    s1 = sin_theta / sin_theta_0

    return Quaternion(
        s0 * a.w + s1 * b.w,
        s0 * a.x + s1 * b.x,
        s0 * a.y + s1 * b.y,
        s0 * a.z + s1 * b.z,
    )


def format_vec(v: Iterable[float], places: int = 4) -> str:
    parts = [f"{float(c):.{places}f}" for c in v]
    return "(" + ", ".join(parts) + ")"


def main() -> None:
    # 90° about +Z should send +X toward +Y
    q = Quaternion.from_axis_angle((0, 0, 1), 90)
    v = (1.0, 0.0, 0.0)
    rotated = q.rotate_vector(v)

    print("Rotation quaternion:", q)
    print("Input vector:       ", format_vec(v))
    print("Rotated vector:     ", format_vec(rotated))
    print("Expected:           ", format_vec((0.0, 1.0, 0.0)))


if __name__ == "__main__":
    main()