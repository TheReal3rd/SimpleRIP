#Mostly AI. For my research genetic algorithms inspired by a YT video. On machine learning.
import random
import string

def createTarget(length: int):
    result = ""
    for i in range(length):
        result += random.choice(GENES)

    return result

GENES = (
    string.ascii_letters +
    string.digits +
    string.punctuation +
    " "
)

POPULATION_SIZE = 250
MUTATION_RATE = 0.05
ELITE_COUNT = 20
TARGET_LENGTH = 16

TARGET = createTarget(TARGET_LENGTH)

class Individual:

    def __init__(self, genes=None):
        if genes is None:
            self.genes = [
                random.choice(GENES)
                for _ in range(len(TARGET))
            ]
        else:
            self.genes = genes

        self.fitness = self.calculate_fitness()

    def calculate_fitness(self):
        score = 0
        for a, b in zip(self.genes, TARGET):
            if a == b:
                score += 1
        return score

    def text(self):
        return "".join(self.genes)


def crossover(parent1, parent2):
    split = random.randint(1, len(TARGET)-1)
    child = (
        parent1.genes[:split] +
        parent2.genes[split:]
    )
    return child


def mutate(genes):
    new = genes[:]
    for i in range(len(new)):
        if random.random() < MUTATION_RATE:
            new[i] = random.choice(GENES)
    return new


population = [
    Individual()
    for _ in range(POPULATION_SIZE)
]

generation = 0

while True:

    population.sort(
        key=lambda x: x.fitness,
        reverse=True
    )

    best = population[0]

    print(
        f"Generation {generation:5d} "
        f"Fitness {best.fitness}/{TARGET_LENGTH} "
        f"{best.text()}"
    )

    if best.fitness == len(TARGET):
        print("\nSolved!")
        break

    next_population = population[:ELITE_COUNT]

    while len(next_population) < POPULATION_SIZE:

        p1 = random.choice(population[:50])
        p2 = random.choice(population[:50])

        child = crossover(p1, p2)
        child = mutate(child)

        next_population.append(
            Individual(child)
        )

    population = next_population
    generation += 1
