# Created by AI.
#This is just an example used in the case atan2 isn't available. Mostly for people to replement into another language.

def atan_approx(z):
    """
    Approximate arctan(z) in radians without using math.
    Accurate enough for many basic programming projects.
    """
    pi = 3.141592653589793

    # atan(z) = pi/2 - atan(1/z) for z > 1
    if z > 1:
        return pi / 2 - atan_approx(1 / z)

    # atan(z) = -pi/2 - atan(1/z) for z < -1
    if z < -1:
        return -pi / 2 - atan_approx(1 / z)

    # Taylor series:
    # atan(z) = z - z^3/3 + z^5/5 - z^7/7 + ...
    result = 0
    term = z
    z_squared = z * z

    for n in range(25):
        denominator = 2 * n + 1

        if n % 2 == 0:
            result += term / denominator
        else:
            result -= term / denominator

        term *= z_squared

    return result


def atan2_custom(y, x):
    """
    Replacement for math.atan2(y, x).
    Returns an angle in radians from -pi to pi.
    """
    pi = 3.141592653589793

    if x > 0:
        return atan_approx(y / x)

    if x < 0 and y >= 0:
        return atan_approx(y / x) + pi

    if x < 0 and y < 0:
        return atan_approx(y / x) - pi

    if x == 0 and y > 0:
        return pi / 2

    if x == 0 and y < 0:
        return -pi / 2

    # Both x and y are 0, so there is no direction.
    return 0


def radians_to_degrees(radians):
    pi = 3.141592653589793
    return radians * 180 / pi


def angle_between_points(start_x, start_y, target_x, target_y):
    change_x = target_x - start_x
    change_y = target_y - start_y

    angle_radians = atan2_custom(change_y, change_x)
    return radians_to_degrees(angle_radians)


# Example: angle from (2, 3) to (8, 7)
angle = angle_between_points(2, 3, 8, 7)

print(angle)  # Approximately 33.69