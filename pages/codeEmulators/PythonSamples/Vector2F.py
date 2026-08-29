import math

class Vector2F():
    x = 0.0
    y = 0.0
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
    def __add__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x + value.x, self.y + value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x + value, self.y + value)
        return NotImplemented
            
    def __sub__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x - value.x, self.y - value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x - value, self.y - value)
        return NotImplemented
    
    def __mul__(self, value):
        if isinstance(value, Vector2F):
            return Vector2F(self.x * value.x, self.y * value.y)
        elif isinstance(value, (int, float)):
            return Vector2F(self.x * value, self.y * value)
        return NotImplemented
    
    def __iadd__(self, value):
        return self.__add__(value)

    def __isub__(self, value):
        return self.__sub__(value)
    
    def __imul__(self, value):
        return self.__mul__(value)
        
    def __repr__(self):
        return f"Vector2F(x={self.x}, y={self.y})"

    def length(self):
        return math.sqrt(self.x**2 + self.y**2)

    def normalize(self):
        l = self.length()
        if l == 0:
            return Vector2F(0, 0)
        return Vector2F(self.x / l, self.y / l)

    def dot(self, other):
        return self.x * other.x + self.y * other.y

pos = Vector2F(0, 10)

print(pos)

pos += Vector2F(10, 5)

print(pos)