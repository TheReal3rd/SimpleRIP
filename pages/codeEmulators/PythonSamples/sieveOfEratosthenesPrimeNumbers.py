# My implementation of Sieve of Eratosthenes
## Look at primeNumbersPerformanceTest sample for the best implementations.

primeRange = int(input("Enter the range of prime number you want."))

rangeList = list(range(2, primeRange + 1))
nonePrime = set()

p = 2
while p * p <= primeRange:
    for multiple in range(p * p, primeRange + 1, p):
        nonePrime.add(multiple)
    p += 1 
prime = [x for x in rangeList if x not in nonePrime]

print(prime)    