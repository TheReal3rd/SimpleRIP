# Tuple (Data Type)

A tuple is a data type used to store multiple values in a single variable.

Tuples are **ordered** and **immutable**, meaning that once they are created, their values cannot be changed, added, or removed.

---

## Example code:

```python
userData = ("James", 1352, "Normal user")

print(userData[0])  # James
print(userData[1])  # 1352

userData[0] = "Jeff"      # TypeError: tuples do not support item assignment
userData.append("test")   # AttributeError: 'tuple' object has no attribute 'append'
```

## Key points about tuples:
* Tuples are immutable (cannot be modified after creation).
* They are ordered, so items keep their defined position.
* They can store multiple data types (strings, numbers, etc.).
* Items are accessed using indexing, starting from 0.

## Common uses of tuples:
Tuples are useful when you want to store data that should not change, such as:
* Server IP address and port number
* 3D coordinates (x, y, z) in a game or simulation
* Fixed configuration or constant values passed between functions

## Notes:
* A tuple with one element must include a trailing comma:
``` python
single_item = ("Hello",)
```
* Tuples are often used for returning multiple values from functions.

# References:
[W3 Schools](https://www.w3schools.com/python/python_tuples.asp)
[Introduction to Programming](https://cs.du.edu/~intropython/intro-to-programming/tuples.html)
