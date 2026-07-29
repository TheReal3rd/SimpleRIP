/* Functions, parameters, and recursion */

#include <cstdio>

int max2(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

void greet(char *name) {
    printf("Hello, %s!\n", name);
}

int main() {
    greet("C programmer");
    printf("max2(9, 4) = %d\n", max2(9, 4));

    printf("fibonacci:");
    for (int i = 0; i < 10; i++) {
        printf(" %d", fib(i));
    }
    printf("\n");

    return 0;
}
