import pygame

pygame.init()
WIDTH, HEIGHT = 800, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pygame Web IDE")
clock = pygame.time.Clock()
title_font = pygame.font.SysFont("arial", 28, bold=True)
body_font = pygame.font.SysFont("arial", 18)

print("Click the game window, then use the arrow keys or WASD.")

player = pygame.Rect(360, 320, 54, 54)
colors = [(255, 99, 110), (80, 220, 160), (90, 170, 255), (255, 196, 70), (196, 120, 255), (120, 230, 220)]
balls = []
for i in range(6):
    balls.append({
        "rect": pygame.Rect(70 + i * 110, 150, 36, 36),
        "vx": 3 + (i % 3),
        "vy": 2 + (i % 2),
        "color": colors[i],
    })

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] or keys[pygame.K_a]:
        player.x -= 6
    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
        player.x += 6
    if keys[pygame.K_UP] or keys[pygame.K_w]:
        player.y -= 6
    if keys[pygame.K_DOWN] or keys[pygame.K_s]:
        player.y += 6
    player.clamp_ip(screen.get_rect().inflate(-24, -24))

    mx, my = pygame.mouse.get_pos()
    screen.fill((16, 20, 32))
    pygame.draw.rect(screen, (36, 46, 74), screen.get_rect(), 8, border_radius=12)
    pygame.draw.line(screen, (52, 66, 102), (28, 112), (WIDTH - 28, 112), 2)

    heading = title_font.render("Pygame, running in this browser", True, (236, 242, 255))
    screen.blit(heading, (28, 24))
    hint = body_font.render("Arrows or WASD move the square. The ring follows the mouse.", True, (168, 180, 204))
    screen.blit(hint, (28, 66))

    for ball in balls:
        ball["rect"].x += ball["vx"]
        ball["rect"].y += ball["vy"]
        if ball["rect"].left <= 20 or ball["rect"].right >= WIDTH - 20:
            ball["vx"] *= -1
        if ball["rect"].top <= 128 or ball["rect"].bottom >= HEIGHT - 20:
            ball["vy"] *= -1
        pygame.draw.ellipse(screen, ball["color"], ball["rect"])

    cx, top = player.centerx, player.top
    star = [
        (cx, top - 22), (cx + 7, top - 8), (cx + 22, top - 8), (cx + 10, top + 4),
        (cx + 14, top + 20), (cx, top + 10), (cx - 14, top + 20), (cx - 10, top + 4),
        (cx - 22, top - 8), (cx - 7, top - 8),
    ]
    pygame.draw.polygon(screen, (255, 214, 90), star)
    pygame.draw.rect(screen, (126, 196, 255), player, border_radius=8)
    if 0 <= mx < WIDTH and 0 <= my < HEIGHT:
        pygame.draw.circle(screen, (255, 255, 255), (mx, my), 12, 2)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
