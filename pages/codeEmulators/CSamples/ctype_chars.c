/* Character classification / case conversion
 *
 * Header: <cctype> / <ctype.h>
 */

#include <cstdio>
#include <cctype>
#include <cstring>

int main() {
    char text[32];
    strcpy(text, "Hi, C-99!");
    int i = 0;

    printf("char | alnum digit alpha space lower upper\n");
    while (text[i] != '\0') {
        unsigned char ch = (unsigned char)text[i];
        printf("'%c'  | %5d %5d %5d %5d %5d %5d\n",
               text[i],
               isalnum(ch),
               isdigit(ch),
               isalpha(ch),
               isspace(ch),
               islower(ch),
               isupper(ch));
        i = i + 1;
    }

    printf("\ntoupper/tolower demo: ");
    i = 0;
    while (text[i] != '\0') {
        unsigned char ch = (unsigned char)text[i];
        if (islower(ch)) {
            putchar(toupper(ch));
        } else if (isupper(ch)) {
            putchar(tolower(ch));
        } else {
            putchar(ch);
        }
        i = i + 1;
    }
    printf("\n");

    return 0;
}
