/* Math library sample
 *
 * Header: <cmath> / <math.h>
 */

#include <cstdio>
#include <cmath>

int main() {
    double x = 2.0;
    double y = 0.5;

    printf("x = %.2f, y = %.2f\n", x, y);
    printf("sqrt(x)   = %.4f\n", sqrt(x));
    printf("x*x       = %.4f\n", x * x);
    printf("sin(y)    = %.4f\n", sin(y));
    printf("cos(y)    = %.4f\n", cos(y));
    printf("tan(y)    = %.4f\n", tan(y));
    printf("exp(1)    = %.4f\n", exp(1.0));
    printf("log(x)    = %.4f\n", log(x));
    printf("log10(100)= %.4f\n", log10(100.0));
    printf("ceil(2.3) = %.4f\n", ceil(2.3));
    printf("floor(2.9)= %.4f\n", floor(2.9));
    printf("fabs(-3)  = %.4f\n", fabs(-3.0));

    return 0;
}
