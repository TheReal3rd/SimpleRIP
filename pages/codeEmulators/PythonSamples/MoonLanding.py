aGravity = 2.5
aRocket = 0.875
velocity = 0
height = 300

def InputHandler(message, type):
    while True:
        try:
            return type(input(message))
        except:
            print("Invalid Input! Try again.")

while height > 0:
    print("Height: {H} Velocity: {V}".format(H = height, V = velocity))
    choice = InputHandler("Do you wish to coast(C)  or burn(B)?", str)
    if choice in ("b","bu","bur","burn"):
        time = InputHandler("The duration?:", int)
        print("Burning...")
        height += (aRocket * time**2) / 2 + velocity * time
        velocity += aRocket * time
    elif choice in ("c","co","coa","coas","coast"):
        time = InputHandler("The duration?:", int)
        print("Coasting...")
        height -= (aGravity * time**2) / 2 + velocity * time
        velocity += aGravity * time
    else:
        continue
if velocity > 10:
    print("You crashed and died on the Moon.")
else:
    print("You landed safely on the Moon.")
