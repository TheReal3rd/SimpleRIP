import pygame

pygame.init()
screen = pygame.display.set_mode((800, 500))
pygame.display.set_caption("Paint")
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 18)
canvas = pygame.Surface(screen.get_size())
canvas.fill((245, 242, 232))

colors = [(20, 24, 32), (220, 68, 72), (40, 120, 220), (36, 160, 90), (230, 170, 40)]
color_index = 0
radius = 8
drawing = False

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key == pygame.K_c:
                canvas.fill((245, 242, 232))
            elif event.key in (pygame.K_1, pygame.K_2, pygame.K_3, pygame.K_4, pygame.K_5):
                color_index = event.key - pygame.K_1
            elif event.key in (pygame.K_EQUALS, pygame.K_PLUS, pygame.K_KP_PLUS):
                radius = min(48, radius + 2)
            elif event.key in (pygame.K_MINUS, pygame.K_KP_MINUS):
                radius = max(2, radius - 2)
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            drawing = True
        elif event.type == pygame.MOUSEBUTTONUP and event.button == 1:
            drawing = False
        elif event.type == pygame.MOUSEMOTION and drawing:
            pygame.draw.circle(canvas, colors[color_index], event.pos, radius)

    if drawing and pygame.mouse.get_pressed()[0]:
        pygame.draw.circle(canvas, colors[color_index], pygame.mouse.get_pos(), radius)

    screen.blit(canvas, (0, 0))
    label = font.render("Drag to draw. Keys 1-5 pick a color. C clears. - and + change the brush.", True, (40, 40, 48))
    screen.blit(label, (16, 12))
    pygame.draw.circle(screen, colors[color_index], (760, 28), radius)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
