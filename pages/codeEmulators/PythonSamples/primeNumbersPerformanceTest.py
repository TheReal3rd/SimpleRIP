# Prime number performance test.
import time
import math

primeRange = 10000

#My interpretation isn't as performent. :(
start = time.time()
rangeList = list(range(2, primeRange + 1))
p = 2
while p * p <= primeRange:
    for multiple in range(p * p, primeRange + 1, p):
        if multiple in rangeList:
            rangeList.remove(multiple)
    p += 1 

end = time.time()
print(f"My implementation: Sieve of Eratosthenes - Execution time: {end - start:.4f} seconds")

# A traditional way of calculating prime numbers.
start = time.time()
for x in range(primeRange, 0, -1):
    if x <= 1:
        break
                
    isPrime = True
    for i in range(2, int(math.sqrt(x)) + 1):
        if x % i == 0:
            isPrime = False
            continue

end = time.time()
print(f"Traditional - Execution time: {end - start:.4f} seconds")
 
#The True Sieve of Eratosthenes implementation. 
start = time.time()
is_prime = [True] * (primeRange + 1)
is_prime[0] = is_prime[1] = False

p = 2
while p * p <= primeRange:
    if is_prime[p]:
        for multiple in range(p * p, primeRange + 1, p):
            is_prime[multiple] = False
    p += 1

primes = [i for i in range(2, primeRange + 1) if is_prime[i]]
end = time.time()
print(f"Sieve of Eratosthenes - Execution time: {end - start:.4f} seconds")