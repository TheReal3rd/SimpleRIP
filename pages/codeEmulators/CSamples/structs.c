/* Struct sample
 *
 * User-defined structs are enabled by c-runtime.js (JSCPP does not
 * register them on its own).
 */

#include <stdio.h>

struct Point {
    int x;
    int y;
};

typedef struct {
    int id;
    int score;
} Player;

int main() {
    struct Point p;
    Player a;
    struct Point *q;

    p.x = 3;
    p.y = 4;
    printf("point %d %d\n", p.x, p.y);

    a.id = 1;
    a.score = 99;
    printf("player %d %d\n", a.id, a.score);

    q = &p;
    printf("via pointer %d %d\n", q->x, q->y);

    return 0;
}
