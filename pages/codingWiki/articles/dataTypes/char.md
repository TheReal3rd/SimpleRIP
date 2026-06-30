[Home](#home)

# Char (Data Type)

A **Char** (character) is a single character data type used within a **string**.

A **string** is simply a sequence (or array) of **Char** values combined to form words, sentences, or other text.

## ASCII

**ASCII** (American Standard Code for Information Interchange) is a character encoding standard that defines how characters are represented within computer systems.

Using a standard ensures that text sent from one computer to another is interpreted consistently.

### For example

If Computer A does not follow the ASCII standard and sends the message:

```
Hello
```

Computer B may incorrectly display it as something like:

```
abcco
```

because the receiving computer interprets the character values differently.

Each ASCII character is assigned a decimal value. For example:

| Character | ASCII Decimal |
|-----------|--------------:|
| A | 65 |
| H | 72 |
| e | 101 |
| l | 108 |
| o | 111 |

Therefore, the word:

```
Hello
```

is represented in ASCII as:

```
72, 101, 108, 108, 111
```
---

```markdown
![ASCII Character Table](https://example.com/images/ascii-table.png)
```
---

## Note

**Python** does not have a dedicated **Char** data type. Instead, a single character is represented as a **string** with a length of **1**.

Languages such as **C**, **C++**, and **Java** provide a dedicated `char` data type.

## Example Code

### C

```c
#include <stdio.h>

int main()
{
    char letter = 'A';

    printf("%c\n", letter);

    return 0;
}
```

### Java

```java
public class Main
{
    public static void main(String[] args)
    {
        char letter = 'A';

        System.out.println(letter);
    }
}
```

# References

[ASCII - Wikipedia](https://en.wikipedia.org/wiki/ASCII)
[ASCII Explained (YouTube)](https://www.youtube.com/watch?v=_9bAlgRzlkc)
[C++ Char Data Type - W3Schools](https://www.w3schools.com/cpp/cpp_data_types_char.asp)
[Character (Computing) - Wikipedia](https://en.wikipedia.org/wiki/Character_(computing))
