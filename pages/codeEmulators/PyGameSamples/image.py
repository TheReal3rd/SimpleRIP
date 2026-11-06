import pygame

pygame.init()
screen = pygame.display.set_mode((800, 500))
pygame.display.set_caption("Image")
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 18)

try:
    sprite = pygame.image.load("hero.png")
    loaded = "Loaded hero.png"
except pygame.error:
    sprite = pygame.Surface((72, 72), pygame.SRCALPHA)
    pygame.draw.circle(sprite, (255, 186, 72), (36, 36), 30)
    pygame.draw.circle(sprite, (50, 40, 40), (26, 30), 4)
    pygame.draw.circle(sprite, (50, 40, 40), (46, 30), 4)
    pygame.draw.arc(sprite, (50, 40, 40), (22, 34, 28, 18), 3.5, 5.9, 3)
    loaded = "No hero.png yet. Upload one, then run again."

pos = pygame.math.Vector2(360, 200)
velocity = pygame.math.Vector2(3, 2.2)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
            running = False

    pos += velocity
    if pos.x < 20 or pos.x > 800 - sprite.get_width() - 20:
        velocity.x *= -1
    if pos.y < 70 or pos.y > 500 - sprite.get_height() - 20:
        velocity.y *= -1

    screen.fill((22, 26, 40))
    screen.blit(sprite, (int(pos.x), int(pos.y)))
    screen.blit(font.render(loaded, True, (210, 216, 230)), (20, 18))
    screen.blit(font.render("Upload a picture named hero.png to put it on screen.", True, (150, 160, 180)), (20, 42))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
