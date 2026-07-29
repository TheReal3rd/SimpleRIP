#Angle example

import math

def calcAngle(posX, posY, posX1, posY1):
    changeX = posX1 - posX
    changeY = posY1 - posY
    return math.degrees(math.atan2(changeY, changeX))


startX = 2
startY = 3
targetX = 8
targetY = 7

print(calcAngle(startX, startY, targetX, targetY))