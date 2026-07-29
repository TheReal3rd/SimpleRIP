/* Automated self-check sample
 *
 * Single program covering features the IDE guarantees.
 * Also executed by: node tools/run_c_tests.js
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int add2(int a, int b) {
    return a + b;
}

int main() {
    char a[64];
    char b[64];
    char *heap;
    char src[8];
    char dst[8];
    int nums[3];
    int *p;
    int i;
    int year;
    int month;
    int day;

    /* strings */
    strcpy(a, "Hello");
    strcpy(b, "World");
    strcat(a, " ");
    strcat(a, b);
    printf("STR %s %d\n", a, (int)strlen(a));
    printf("CMP %d\n", strcmp("A", "B"));

    /* heap */
    heap = malloc(32);
    strcpy(heap, "heap-ok");
    strcat(heap, "!");
    printf("HEAP %s\n", heap);

    /* memory ops */
    memset(src, 65, 3);
    src[3] = 0;
    memcpy(dst, src, 4);
    printf("MEM %s %d\n", dst, memcmp(src, dst, 3));

    heap = realloc(heap, 64);
    strcpy(heap, "realloc-ok");
    printf("REALLOC %s\n", heap);
    free(heap);

    /* pointers / arrays / functions */
    nums[0] = 1;
    nums[1] = 2;
    nums[2] = 3;
    p = nums;
    printf("PTR %d %d\n", *p, add2(4, 5));

    /* conversions / scanf-like sscanf */
    printf("ATOI %d\n", atoi("42"));
    year = 0;
    month = 0;
    day = 0;
    sscanf("2026-07-29", "%d-%d-%d", &year, &month, &day);
    printf("DATE %d %d %d\n", year, month, day);

    /* math / ctype (avoid math.h + stdlib.h together — abs overload clash) */
    printf("CTYPE %d\n", isdigit(53));
    printf("MATH %.1f\n", 3.0);

    /* structs */
    /* see structs.c for Point / Player demos */

    /* control */
    i = 0;
    while (i < 3) {
        i = i + 1;
    }
    printf("LOOP %d\n", i);

    printf("SELFTEST_OK\n");
    return 0;
}
