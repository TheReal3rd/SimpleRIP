#include <stdio.h>
#include <stdbool.h>
#include <math.h>

int range;

int main() {
    printf("Enter how many prime number you need: ");
    scanf("%d", &range);
    for(int x = range; x != 0; x--) {
	if (x <= 1) {
	   break;
	}
	bool isPrime = true;

	for(int i = 2; i != (int) sqrt(x) + 1; i++) {
	   if(x % i == 0) {
		isPrime = false;
	   	continue;
	   }
	}
	if(isPrime) {
	    printf("%d\n", x);
	}
    }
    return 0;
}


