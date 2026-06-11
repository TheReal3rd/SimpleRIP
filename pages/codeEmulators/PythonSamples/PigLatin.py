import sys
vowels = "aeiouy"

class PigLatin():
    def __init__(self, text):
        if text[0] in vowels:
            self.result = text + "way"
        else:
            self.result = text[1:] + text[0] + "ay"
        
        self.result = "{}".format(self.result, file=sys.stderr)
    def __str__(self):
        return str.format(self.result)


test = str(input("Test"))
test1 = PigLatin(test)
print(test1)