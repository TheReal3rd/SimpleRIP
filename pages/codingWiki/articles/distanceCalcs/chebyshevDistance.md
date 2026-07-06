[Home](#home)
[Distance Home](#distanceCalc/distanceHome)
# Chebyshev Distance (WIP)

Checbyshev is a distance calculation that returns the distance between two points of the maxiumum absolute difference along a single dimension.
Commonly used within program such as chess or a game that has grid movement. 

---

## Code:

```python

#Implementation 1: using Tuples no error handling.
def chebyshev_distance(point1, point2):
    return max(abs(a - b) for a, b in zip(point1, point2))

#Implementation 2
def chebyshev_distance(x, y, x1, y1):
    return max(abs(x - x1), abs(y - y1))

```


---

## Code Examples:
[TODO](/pages/codeEmulators/pythonEditor.html#euclideanExample1)

---

## Referances:
[GeekForGeek](https://www.geeksforgeeks.org/machine-learning/chebyshev-distance/)
