def InputHandler(message, type):
    while True:
        try:
            return type(input(message))
        except:
            print("Invalid Input! Try again.")

def DoCalc(spell, day):
    return spell**2 * day

while True:
    spell = InputHandler("Please enter the spell:", int)
    days = InputHandler("Please enter the number of days absent:", int)
    score = DoCalc(spell, days)
    print(str.format("Score: {result}", result = score))
    
    if score <= 45:
        print("No warnings.")
    elif score <= 100:
        print("Warnings.")
    else:
        print("Able to cancel contract.")