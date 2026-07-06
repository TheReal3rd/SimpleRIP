[Home](#home)
# Arrays and Lists (Data Type)

Arrays are a data type used to store multiple values within a single variable. Instead of creating many separate variables, an array lets you group related values together.

Arrays allow you to access and modify stored values while the program is running. Depending on the programming language, arrays may either have a fixed size or allow items to be added and removed.

> **Note:** In Python, what are commonly called "arrays" are usually **lists**. Lists can grow and shrink in size, whereas arrays in many other languages have a fixed length.

Think of an array or list as a shopping list:

```
0. "Milk"
1. "Cheese"
2. "Biscuits"
```

This list contains three items. To access an item, you use its **index**. An index is the position of an item within the array.

For example:

* `0` = `"Milk"`
* `1` = `"Cheese"`
* `2` = `"Biscuits"`

Remember that computers usually start counting from **0**, not **1**. This is known as **zero-based indexing**.

Depending on the programming language, arrays may have a fixed size or be dynamic.

Languages such as **C**, **C++**, and **Java** commonly use fixed-size arrays, meaning the number of elements cannot be changed after the array has been created. Other languages, such as **Python**, use lists that can be expanded or reduced as needed.

## Example Code

This Python example creates the same shopping list, adds a new item, retrieves values using their index, and replaces an existing item.

```python
foodList = ["Milk", "Cheese", "Biscuits"]

print(foodList[0])  # Milk

foodList.append("Jam")

print(foodList[3])  # Jam

foodList[0] = "Watermelon"

print(foodList[0])  # Watermelon
```

This example in **C** shows a fixed-size array containing up to 20 integers. Although only the first two values are initially assigned, the remaining elements still exist and can be modified.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int numbers[20] = {10, 15};

    printf("Before Modification: %d\n", numbers[1]); // Prints the second value (15).

    for (int x = 0; x < 20; x++) {
        numbers[x] = rand() % 10; // Replaces each value with a random number between 0 and 9.
        printf("New Random: %d\n", numbers[x]);
    }

    printf("%d\n", numbers[0]); // Prints the first value in the array.

    return 0;
}
```

## Multidimensional Arrays

Arrays can also contain other arrays. These are called **multidimensional arrays**.

A common example is a grid or board, such as a chessboard, where rows and columns are stored together.

Example:

```text
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
```

To access the number `5`, you would use the row index followed by the column index.

## Common Uses

* Storing game objects such as enemies, bullets, and items.
* Creating grids for games such as Chess, Sudoku, or Tetris.
* Storing collections of related data, such as names, scores, or temperatures.
* Processing large amounts of data efficiently using loops.

# References
[W3Schools Python Lists](https://www.w3schools.com/python/python_lists.asp)
[Wikipedia – Array](https://en.wikipedia.org/wiki/Array_(data_structure))
