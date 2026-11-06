import pygame

pygame.init()
name = input("Enter your name: ")
screen = pygame.display.set_mode((720, 360))
pygame.display.set_caption("Hello")
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 36, bold=True)
small = pygame.font.SysFont("arial", 18)
print("Hello,", name)

running = True
tick = 0
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
            running = False
    tick += 1
    shade = 24 + int(12 * (1 + pygame.math.Vector2(1, 0).rotate(tick).y))
    screen.fill((shade, 28, 48))
    hello = font.render("Hello, " + name, True, (150, 220, 255))
    screen.blit(hello, (48, 140))
    note = small.render("This used input() in the terminal, then drew the name with pygame.", True, (180, 190, 210))
    screen.blit(note, (48, 200))
    pygame.display.flip()
    clock.tick(30)

pygame.quit()
