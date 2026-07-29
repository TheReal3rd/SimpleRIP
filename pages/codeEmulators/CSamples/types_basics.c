/* Types / typedef / sizeof — JSCPP-safe
 *
 * Avoid sizeof(void*) — use sizeof(char*) / sizeof(int).
 */

#include <stdio.h>

typedef unsigned int uint32;
typedef char *string_t;

int main() {
    char c;
    int i;
    unsigned int u;
    long l;
    float f;
    double d;
    uint32 id;
    string_t label;
    const int LIMIT = 10;

    c = 65;
    i = -42;
    u = 42;
    l = 100000L;
    f = 3.14;
    d = 2.71828;
    id = 7;
    label = "typedef ok";

    printf("char=%c\n", c);
    printf("int=%d\n", i);
    printf("unsigned=%u\n", u);
    printf("long=%d\n", (int)l);
    printf("float=%.2f\n", f);
    printf("double=%.5f\n", d);
    printf("uint32=%u\n", id);
    printf("label=%s\n", label);

    printf("sizeof char=%d\n", (int)sizeof(char));
    printf("sizeof int=%d\n", (int)sizeof(int));
    printf("sizeof long=%d\n", (int)sizeof(long));
    printf("sizeof float=%d\n", (int)sizeof(float));
    printf("sizeof double=%d\n", (int)sizeof(double));
    printf("sizeof char*=%d\n", (int)sizeof(char *));

    printf("LIMIT=%d sq=%d\n", LIMIT, LIMIT * LIMIT);
    return 0;
}
