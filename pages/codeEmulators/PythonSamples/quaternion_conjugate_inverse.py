
def almost_identity(q: Quaternion, tol: float = 1e-9) -> bool:
    return (
        abs(q.w - 1.0) <= tol
        and abs(q.x) <= tol
        and abs(q.y) <= tol
        and abs(q.z) <= tol
    )


def main() -> None:
    q = Quaternion.from_axis_angle((0, 0, 1), 90)
    print("=== Unit rotation: conjugate == inverse ===")
    print("q:         ", q)
    print("conjugate: ", q.conjugate())
    print("inverse:   ", q.inverse())
    print("same?      ", q.conjugate().almost_equal(q.inverse()))

    v = (1.0, 0.0, 0.0)
    forward = q.rotate_vector(v)
    undo_via_conjugate = q.conjugate().rotate_vector(forward)
    undo_via_inverse = q.inverse().rotate_vector(forward)

    print()
    print("Rotate +X by q:              ", format_vec(forward))
    print("Then rotate by conjugate:    ", format_vec(undo_via_conjugate))
    print("Or rotate by inverse:        ", format_vec(undo_via_inverse))
    print("Back to original?            ", format_vec(v))

    print()
    print("q * q.inverse() is identity? ", almost_identity(q * q.inverse()))

    print()
    print("=== Non-unit quaternion: conjugate ≠ inverse ===")
    scaled = Quaternion(2.0, 0.0, 0.0, 0.0)  # 2 * identity (not a pure rotation)
    print("scaled:    ", scaled)
    print("norm:      ", round(scaled.norm(), 4))
    print("conjugate: ", scaled.conjugate())
    print("inverse:   ", scaled.inverse())
    print("same?      ", scaled.conjugate().almost_equal(scaled.inverse()))
    print("scaled * inverse ≈ I? ", almost_identity(scaled * scaled.inverse()))
    print("scaled * conjugate ≈ I?", almost_identity(scaled * scaled.conjugate()))
    print("(conjugate alone does not undo a non-unit quaternion)")


if __name__ == "__main__":
    main()