[Home](#home)
# Manhattan Distance
Manhattan distance is a calculation that measures the distance between two points in a grid, using the absolute differences of their coordinates. 
Unlike Euclidian distances, which calculate the direct path between two point, Manhattan distance is commonly used to calculate distances within a grid for scenarios such as games that use grid-based systems, 
like Minecraft and Chess.

This type of distance is also referred to as L1 or Taxicabin distance.

---

## Code:

Here are examples of implementing Manhattan distance:

```python

#Implementation 1
def manhattan_distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)

#Implementation 2
def manhattan_distance(x1, y1, x2, y2):
    dx = abs(x1 - x2)
    dy = abs(y1 - y2)
    return dx + dy

#Lambda Implementation 3
manhattan_distance = lambda x1, y1, x2, y2: abs(x1 - x2) + abs(y1 - y2)

```

---

## Code Examples:
[ManhattanExample1](/pages/codeEmulators/pythonEditor.html#manhattenExample1)

---

## Referances:
[Wikipedia Taxicab](https://en.wikipedia.org/wiki/Taxicab_geometry)
[GeeksForGeeks](https://www.geeksforgeeks.org/data-science/manhattan-distance/)