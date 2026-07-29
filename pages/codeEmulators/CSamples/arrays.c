/* Arrays sample */

#include <cstdio>

int sum_array(int *arr, int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += arr[i];
    }
    return total;
}

int main() {
    int scores[5] = {90, 85, 100, 70, 95};
    int n = 5;

    printf("scores:");
    for (int i = 0; i < n; i++) {
        printf(" %d", scores[i]);
    }
    printf("\n");

    printf("sum = %d\n", sum_array(scores, n));
    printf("average = %d\n", sum_array(scores, n) / n);

    /* mutate through indexing */
    scores[2] = 99;
    printf("after scores[2] = 99, scores[2] = %d\n", scores[2]);

    /* char arrays as C strings */
    char name[16] = "Ada";
    printf("name = %s (first char %c)\n", name, name[0]);
    name[0] = 'A';
    printf("still \"%s\"\n", name);

    return 0;
}
