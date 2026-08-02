# Implementation of Perfect Number Checker

"""
Pseudocode:

If N <= 1
    Print "Not Perfect"
    Stop

sum ← 1

For i ← 2 to √N

    If N mod i = 0

        If i = N ÷ i
            sum ← sum + i
        Else
            sum ← sum + i
            sum ← sum + (N ÷ i)

If sum = N
    Print "Perfect"
Else
    Print "Not Perfect"
"""

import math

while True:
    n = int(input("Enter a number to find out if its a perfect number: "))

    if n <= 1:
        print("Not Perfect.")
        continue

    nSum = 1
    for i in range(2, int(math.sqrt(n))):
        if n % i == 0:
            if i == n / i:
                nSum += 1
            else:
                nSum += i
                nSum += (n / i)

    if nSum == n:
        print("Perfect.")
    else:
        print("Not perfect.")
