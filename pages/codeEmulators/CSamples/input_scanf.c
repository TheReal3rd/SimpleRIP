/* scanf sample — JSCPP-safe
 * stdin example: Alice 21
 */

#include <stdio.h>

int main() {
    char name[64];
    int age;

    printf("Enter name and age:\n");
    scanf("%s %d", name, &age);
    printf("Hello %s, age %d\n", name, age);
    return 0;
}
