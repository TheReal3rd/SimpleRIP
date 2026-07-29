#include <stdio.h>
#include <stdbool.h>

int fizzRange;

int main() {
    printf("Please enter the range to fizz buzz: ");
    scanf("%d", &fizzRange);

    for(int x = fizzRange; x != 0; x--) {
        bool fizzDiv = x % 3 == 0;
        bool buzzDiv = x % 5 == 0;

        if (fizzDiv && buzzDiv ) {
            printf("FizzBuzz\n");
        } else if(fizzDiv) {
            printf("Fizz\n");
        } else if(buzzDiv) {
            printf("Buzz\n");
        } else {
            printf("%d\n", x);
        }

    }

    return 0;
}