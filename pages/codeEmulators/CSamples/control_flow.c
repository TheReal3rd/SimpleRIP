/* Control flow: if / switch / loops */

#include <cstdio>

int main() {
    int n = 7;

    if (n % 2 == 0) {
        printf("%d is even\n", n);
    } else {
        printf("%d is odd\n", n);
    }

    switch (n % 3) {
        case 0:
            printf("n %% 3 == 0\n");
            break;
        case 1:
            printf("n %% 3 == 1\n");
            break;
        default:
            printf("n %% 3 == 2\n");
            break;
    }

    printf("for: ");
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    printf("while: ");
    int w = 3;
    while (w > 0) {
        printf("%d ", w);
        w = w - 1;
    }
    printf("\n");

    printf("do/while: ");
    int d = 0;
    do {
        printf("%d ", d);
        d = d + 1;
    } while (d < 3);
    printf("\n");

    return 0;
}
