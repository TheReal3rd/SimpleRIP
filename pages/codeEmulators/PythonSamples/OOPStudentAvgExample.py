# Object Oriented Programming Style Example | Student grades and avg.
import random

class Student():

    def __init__(self, name: str, age: int, englishGrade: int, mathGrade: int, scienceGrade: int):
        self.name = name
        self.age = age
        self.englishGrade = englishGrade
        self.mathGrade = mathGrade
        self.scienceGrade = scienceGrade

    def __str__(self) -> str:
        return f"Name: {self.name} Age: {self.age} \nGrades:\n\tEnglish: {self.englishGrade}\n\tMath: {self.mathGrade}\n\tScience: {self.scienceGrade}"

    def getCleanStr(self) -> str:
        return f"Name: {self.name} Age: {self.age}"

namesList = [
    "Jess",
    "Steve",
    "Josh",
    "David",
    "Jake",
    "Ethan",
    "Ada",
    "Rick",
    "Jacob",
    "George"
]

NAMES_LIST_SIZE = len(namesList)
studentList = []
closing = False

helpMessage = """
0 - Create random range of students and grades.
1 - Manual entry.
2 - Data look up
3 - Calculate Average
4 - Quit\n\n
"""

def inputValidation(msg: str, valueType):
    while True:
        try:
            return valueType(input(msg))
        except Exception as err:
            print("Invalid input provided.")
            continue

while not closing:
    print(helpMessage)
    action = inputValidation("Enter your command:", int)

    if action == -1 or action >= 4:
        print("Invalid option was selected.")
        continue

    if action == 0:
        randomRange = inputValidation("Please enter how many random student you want created: ", int)

        if randomRange <= 0:
            print("Invalid range provided ensure its a positive value.")
            continue

        for x in range(0, randomRange):
            name = namesList[random.randint(0, NAMES_LIST_SIZE - 1)]
            age = random.randint(13, 16)
            englishGrade = random.randint(1, 8)
            mathGrade = random.randint(1, 8)
            scienceGrade = random.randint(1, 8)

            tempStudent = Student(name, age, englishGrade, mathGrade, scienceGrade)
            studentList.append(tempStudent)
            print(tempStudent)

        print("Completed random student creations.")
        
    elif action == 1:
        name = inputValidation("Please enter the students name: ", str)
        age = inputValidation("Please enter the students age: ", int)
        englishGrade = inputValidation("Please enter the students English grade: ", int)
        mathGrade = inputValidation("Please enter the students name: ", int)
        scienceGrade = inputValidation("Please enter the students name: ", int)

        tempStudent = Student(name, age, englishGrade, mathGrade, scienceGrade)
        studentList.append(tempStudent)
        print("Student has been entered.")

    elif action == 2:
        print("Students list: \nIndex | Name / Age")
        index = 0
        for stud in studentList:
            print(f"{index} -> {stud.getCleanStr()}")
            index += 1

        index = inputValidation("Please enter the index for which student you want to know more about: ", int)
        if index in range(0, len(studentList) - 1):
            print(studentList[index])

    elif action == 3:
        englishAdd = 0
        mathAdd = 0
        scienceAdd = 0

        for stud in studentList:
            englishAdd += stud.englishGrade
            mathAdd += stud.mathGrade
            scienceAdd += stud.scienceGrade

        length = len(studentList)
        englishAvg = englishAdd / length
        mathAvg = mathAdd / length
        scienceAvg = scienceAdd / length
        print(f"The subjects average's are:\n\tEnglish: {englishAvg}\n\tMath: {mathAvg}\n\tScience: {scienceAvg}")

    elif action == 4:
        closing = True
        print("Exiting program.")




