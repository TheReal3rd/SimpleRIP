import math
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 500))
pygame.display.set_caption("Poster")
clock = pygame.time.Clock()
title = pygame.font.SysFont("georgia", 42, bold=True)
body = pygame.font.SysFont("arial", 20)
frame = 0

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
            running = False

    frame += 1
    screen.fill((28, 18, 48))
    for i in range(12):
        angle = frame * 0.02 + i * (math.pi / 6)
        x = 400 + math.cos(angle) * (120 + (i % 3) * 28)
        y = 250 + math.sin(angle) * (90 + (i % 4) * 16)
        color = (120 + i * 8, 90, 220 - i * 6)
        pygame.draw.circle(screen, color, (int(x), int(y)), 18)

    pygame.draw.rect(screen, (255, 214, 120), (70, 70, 280, 8))
    heading = title.render("Shapes and type", True, (255, 244, 220))
    screen.blit(heading, (70, 90))
    lines = [
        "pygame.draw makes the circles, bars, and polygon.",
        "pygame.font.SysFont renders this text onto a Surface.",
        "screen.blit copies those Surfaces into the window.",
    ]
    for index, line in enumerate(lines):
        screen.blit(body.render(line, True, (210, 196, 230)), (70, 170 + index * 32))

    pygame.draw.polygon(screen, (255, 160, 90), [(620, 360), (700, 180), (760, 360)])
    pygame.draw.polygon(screen, (255, 214, 140), [(660, 360), (700, 240), (740, 360)])
    pygame.draw.rect(screen, (90, 200, 170), (80, 360, 390, 70), border_radius=16)
    badge = body.render("All of this stays in the browser", True, (16, 40, 36))
    screen.blit(badge, (96, 384))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
