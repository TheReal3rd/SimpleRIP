[Home](#home)

# Classes and Objects (Object-Oriented Programming)

Classes are used to create objects in a program. A class acts like a blueprint that describes what an object should contain and what it can do.

For example, a class called `Car` could describe information that every car has, such as its colour, brand, and speed.

An object is a specific example created from a class. If `Car` is the blueprint, then a red Toyota or a blue Ford would be objects created from that blueprint.

> **Note:** Classes are a key part of **object-oriented programming (OOP)**. OOP is a programming style that organises code using objects that contain data and behaviour.

Think of a class as a cookie cutter and an object as a cookie made using that cutter.

```text
Class: Car

Objects:
- Red Toyota
- Blue Ford
- Black Tesla
```

Each object can have its own values. For example:

* A red car may have a speed of `60`.
* A blue car may have a speed of `45`.
* A black car may have a speed of `80`.

Even though the objects are different, they all follow the same structure created by the `Car` class.

## Example Code

This Python example creates a `Car` class. The class stores information about a car and includes a method that displays its details.

```python
class Car:
    def __init__(self, brand, colour):
        self.brand = brand
        self.colour = colour
        self.speed = 0

    def drive(self):
        self.speed = 50
        print(self.brand + " is now driving at " + str(self.speed) + " mph.")


car1 = Car("Toyota", "Red")
car2 = Car("Ford", "Blue")

print(car1.colour)  # Red

car1.drive()  # Toyota is now driving at 50 mph.
car2.drive()  # Ford is now driving at 50 mph.
```

In this example:

* `Car` is the class.
* `car1` and `car2` are objects.
* `brand`, `colour`, and `speed` are attributes.
* `drive()` is a method.

Attributes are pieces of information stored inside an object. Methods are actions that an object can perform.

## Classes in Other Languages

Many programming languages support object-oriented programming, including **Python**, **Java**, **C++**, and **C#**.

This example in **Java** creates a simple `Car` class:

```java
class Car {
    String brand;
    String colour;

    Car(String newBrand, String newColour) {
        brand = newBrand;
        colour = newColour;
    }

    void displayInfo() {
        System.out.println(colour + " " + brand);
    }

    public static void main(String[] args) {
        Car car1 = new Car("Toyota", "Red");

        car1.displayInfo(); // Red Toyota
    }
}
```

## Inheritance

Classes can also inherit features from other classes. This is called **inheritance**.

For example, a `Vehicle` class could contain information shared by all vehicles, such as speed. A `Car` class could then inherit from `Vehicle` and add car-specific information.

```text
Vehicle
  └── Car
```

This helps programmers avoid repeating the same code.

Example:

```python
class Vehicle:
    def move(self):
        print("The vehicle is moving.")


class Car(Vehicle):
    def honk(self):
        print("Beep beep!")


my_car = Car()

my_car.move()  # The vehicle is moving.
my_car.honk()  # Beep beep!
```

## Common Uses

* Creating characters, enemies, and items in games.
* Representing users, accounts, and messages in websites or apps.
* Organising large programs into reusable sections.
* Storing related data and actions together.
* Building systems such as online shops, banking apps, and school databases.

# References

[W3Schools – Python Classes and Objects](https://www.w3schools.com/python/python_classes.asp)

[Oracle – Object-Oriented Programming Concepts](https://docs.oracle.com/javase/tutorial/java/concepts/)

[Wikipedia – Object-Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
