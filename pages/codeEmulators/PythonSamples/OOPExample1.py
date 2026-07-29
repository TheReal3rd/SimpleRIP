# Generic Object Oriented Programming example.
# Description: 
# Creates a car object which is a template to the car functionality.
# * Car
#   * Car -> Ford
#   * Car -> Toyota
#   * Toyota -> Toyota Truck


class Car():

    def __init__(self, modelName: str, name: str, maxSpeed: float, maxFuel: float):
        self.modelName = modelName
        self.name = name
        self.maxSpeed = maxSpeed
        self.maxFuel = maxFuel
        # _ is used to define a value as private. meaning it can be access via Car._fuelLevel.
        self._fuelLevel = maxFuel


    def __str__(self): # Defines how the object will behave when handle like a string.
        return f"{self.modelName} Speed: {self.maxSpeed} Max Fuel: {self.maxFuel}/{self._fuelLevel}"

    def drive(self, distance):
        #There no real science behind this calculation just for example.
        self.setFuelLevel(self._fuelLevel - (distance / 100) * self.maxSpeed)

    # Get call to fetch the fuel level.
    def getFuelLevel(self):
        return self._fuelLevel

    def setFuelLevel(self, level):
        self._fuelLevel = level

    def horn(self):
        return "Honk!"

class FordCar(Car):

    def __init__(self):
        super().__init__("Ford", "Raptor Truck", 75, 5000)

    def horn(self):
        return "Beep! Beep!"


class ToyotaCar(Car):
    def __init__(self):
        super().__init__("Toyota", "Yaris", 65, 10000)


class ToyotaTruck(ToyotaCar):

    def __init__(self):
        super().__init__()
        self.name = "Hylux"
        self.maxFuel = 5000

    def horn(self):
        return "Boop! Boop!"

    
car1 = FordCar()
print(car1)


car2 = ToyotaCar()
print(car2)
print(car2.horn())

car3 = ToyotaTruck()
print(car3.horn())

car3.drive(100)
print(car3.getFuelLevel())
