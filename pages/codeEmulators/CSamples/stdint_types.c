/* Standard C typedefs sample
 *
 * size_t / stdint / stdbool are provided by c-runtime.js
 * (also available via #include <stddef.h>, <stdint.h>, <stdbool.h>).
 */

#include <stdio.h>
#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

int main() {
    size_t len;
    ssize_t delta;
    ptrdiff_t diff;
    uint8_t u8;
    int16_t i16;
    uint32_t u32;
    int64_t i64;
    bool ok;
    _Bool flag;

    len = 12;
    delta = -3;
    diff = 4;
    u8 = 200;
    i16 = -300;
    u32 = 4000000000u;
    i64 = -5;
    ok = true;
    flag = false;

    printf("size_t=%u\n", (unsigned)len);
    printf("ssize_t=%d\n", (int)delta);
    printf("ptrdiff_t=%d\n", (int)diff);
    printf("uint8_t=%u\n", (unsigned)u8);
    printf("int16_t=%d\n", (int)i16);
    printf("uint32_t=%u\n", (unsigned)u32);
    printf("int64_t=%d\n", (int)i64);
    printf("bool=%d\n", (int)ok);
    printf("_Bool=%d\n", (int)flag);

    return 0;
}
