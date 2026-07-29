/* Conversions sample — JSCPP-safe
 *
 * Avoid: sprintf (broken), %ld, float suffixes in some paths, pointer NULL checks.
 */

#include <stdio.h>
#include <stdlib.h>

int main() {
    char *num_text;
    char *flt_text;
    int along;
    int labs_result;
    double pi;
    int year;
    int month;
    int day;

    num_text = "12345";
    flt_text = "3.14159";

    printf("atoi: %d\n", atoi(num_text));

    along = (int)atol(num_text);
    printf("atol: %d\n", along);

    pi = atof(flt_text);
    printf("atof: %.5f\n", pi);

    year = 0;
    month = 0;
    day = 0;
    sscanf("2026-07-29", "%d-%d-%d", &year, &month, &day);
    printf("sscanf: %d-%d-%d\n", year, month, day);

    printf("abs: %d\n", abs(-9));

    labs_result = (int)labs(-9L);
    printf("labs: %d\n", labs_result);

    printf("div: quot=%d rem=%d\n", 17 / 5, 17 % 5);

    return 0;
}
