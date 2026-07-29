/* Pointers and indirection */

#include <cstdio>

void add_one(int *p) {
    *p = *p + 1;
}

int main() {
    int value = 42;
    int *p = &value;

    printf("value = %d\n", value);
    printf("*p    = %d\n", *p);
    printf("p points at value\n");

    *p = 100;
    printf("after *p = 100, value = %d\n", value);

    add_one(&value);
    printf("after add_one(&value), value = %d\n", value);

    /* pointer arithmetic on an array */
    int nums[4] = {2, 4, 6, 8};
    int *q = nums;

    printf("via pointer walk:");
    for (int i = 0; i < 4; i++) {
        printf(" %d", *(q + i));
    }
    printf("\n");

    /* pointer difference style indexing */
    printf("nums[2] via *(nums + 2) = %d\n", *(nums + 2));

    return 0;
}
