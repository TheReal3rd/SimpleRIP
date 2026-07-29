/* String operations — JSCPP-safe */

#include <stdio.h>
#include <string.h>

int main() {
    char a[64];
    char b[64];
    char c[128];
    char *found;

    strcpy(a, "Hello");
    strcpy(b, "World");

    printf("a=%s len=%d\n", a, (int)strlen(a));
    printf("b=%s len=%d\n", b, (int)strlen(b));
    printf("strcmp=%d\n", strcmp(a, b));
    printf("strncmp3=%d\n", strncmp(a, "Help", 3));

    strcpy(c, a);
    strcat(c, ", ");
    strcat(c, b);
    printf("c=%s\n", c);

    found = strchr(c, 44);
    printf("strchr comma code=%d\n", found[0]);

    found = strstr(c, "World");
    printf("strstr=%s\n", found);

    strncpy(a, "ABCDEFGH", 4);
    a[4] = 0;
    printf("strncpy=%s\n", a);

    return 0;
}
