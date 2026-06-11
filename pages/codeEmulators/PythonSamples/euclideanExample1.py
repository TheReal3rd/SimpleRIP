##
# This sample will show usage of a distance calculation to find the closest position to origin.
# So (0, 0).
##
import math
import random

def euclidean(posX, posY, posX1, posY1):
    return math.hypot(posX1 - posX, posY1 - posY)

#Creates a list of 50 random positions. Stored as Tuples.
locations = []
for x in range(0, 50):
    locations.append((random.randint(-100, 100), random.randint(-100, 100)))

print(locations)
print("\n")

bestDistance = 10000000
bestPosition = None

for x in locations:
    tempDistance = euclidean(x[0], x[1], 0, 0)
    if tempDistance < bestDistance:
        bestDistance = tempDistance
        bestPosition = x

print(f"Best position is {bestPosition}")

