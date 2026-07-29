/* Dynamic memory sample — JSCPP-safe
 *
 * Heap APIs return char*. Avoid (int*) casts and if (p == NULL).
 * String helpers are patched by c-runtime.js so strcpy works on malloc buffers.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int i;
    char *buf;
    char *grown;
    char src[16];
    char dst[16];
    char overlap[32];

    buf = malloc(32);
    strcpy(buf, "Hello");
    strcat(buf, ", heap");
    printf("malloc string: %s\n", buf);

    grown = calloc(16, 1);
    printf("calloc zeros: %d %d %d\n", grown[0], grown[1], grown[2]);
    strcpy(grown, "zeroed");
    printf("calloc strcpy: %s\n", grown);

    memset(src, 65, 5);
    src[5] = 0;
    memcpy(dst, src, 6);
    printf("memset+memcpy: %s\n", dst);
    printf("memcmp: %d\n", memcmp(src, dst, 5));

    buf = realloc(buf, 64);
    strcat(buf, " + realloc");
    printf("realloc: %s\n", buf);

    for (i = 0; i < 5; i++) {
        grown[i] = 48 + i;
    }
    grown[5] = 0;
    printf("digits: %s\n", grown);

    strcpy(overlap, "abcdef");
    memmove(overlap + 2, overlap, 4);
    overlap[6] = 0;
    printf("memmove: %s\n", overlap);

    free(buf);
    free(grown);
    printf("freed ok\n");
    return 0;
}
