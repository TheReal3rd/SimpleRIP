[Home](#home)
# String (Data type)
This data type is used to store and proccess readable text. Such as this text that you're reading now.
String is just an Array list of Char(Characters) that are in sequence of the defined text.


# Example Code:
Here you will find example code section of different operations and handling of the data type String.
Split into section to allow you to study and understand different ways you can use a string within specific applications.

```python

text = "Hello, World"

#Prints length of the text.
print(len(text))

#Prints the 2nd character in the string.
print(text[1])

#Splits the text by a character thats provided.
splitText = text.split(" ")
print(splitText[0])

#Replaces all l's characters with r's
replacedText = text.replace("l", "r")
print(replacedText)

#Slicing the value by 0 to 5 characters.
print(text[0:5])
```
Within this example you can see multiple operations being exectued to a string example of 'Hello, World'.

1. An length call printing the length of the string.
2. Fetching the 2nd character within the string.
3. Split call that splits the string by a provided character or word.
4. Replace call to replace all 'l' characters with 'r'.
5. Finally slicing the string from first character at index 0 to index 5 which is 'o'. Resulting in 'Hello'.

This next section we will go over iteration loops, modifiers and concatenation.

```python

text = "Sample Text!!! "

#Iteration loop. Executing an action on each and every letter.
for x in text:
    print(x)
    
#Another iteration loop that executes a special task on every '!'.
#Each time it reaches a '!' will print a special segment of text.
for x in text:
    if x == "!":
        print("Do something special on !")
    else:
        print(x)
        
# Now upper casing and lower casing text.
# Commonly used to simplify camparing text.
# As 't' is not the same 'T'. So solving possible issue related to user inputs or entries.
upperCase = text.upper()
print(upperCase)

lowerCase = text.lower()
print(lowerCase)

#Stripping trailing edge spaces.
#Usually used to do extra clean up on user inputs or after some proccessing has been done to a section of text.
#In the sample text you can see a trailing edge space at the end of the text this will remove that space.
text = text.strip()
print(text.replace(" ", "_"))

# Concataenation of two strings.
text = text + " Add this to the end of the text."
print(text)

```

# Uses:
* Displayable text such as GUI and or messages in a chat.
* Packed data such as representation of an image or data that then gets converted.

# Reference:
[Char](#dataTypes/char)
[Array](#dataTypes/arrays)
[Python Strings W3Schools](https://www.w3schools.com/python/python_strings.asp)
[Python String Methods](https://www.w3schools.com/python/python_strings_methods.asp)
