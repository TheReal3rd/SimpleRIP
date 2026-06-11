def manhattan_distance(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def euclidean_distance(a, b):
    return ((a[0] - b[0])**2 + (a[1] - b[1])**2) ** 0.5

start = (2, 3)
goal = (7, 9)

print("Manhattan distance:", manhattan_distance(start, goal))
print("Euclidean distance:", euclidean_distance(start, goal))