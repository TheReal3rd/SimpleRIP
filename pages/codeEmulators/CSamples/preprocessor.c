/* Preprocessor sample — JSCPP-safe
 *
 * Stock JSCPP #if expressions / #else are unreliable — use #define + code only.
 */

#include <stdio.h>

#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define VERSION 2

int main() {
    int n;

    n = 5;
    printf("SQUARE=%d\n", SQUARE(n));
    printf("MAX=%d\n", MAX(3, 8));
    printf("VERSION=%d\n", VERSION);
    return 0;
}
