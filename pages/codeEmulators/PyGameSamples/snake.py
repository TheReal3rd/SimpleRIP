import random
import pygame

pygame.init()
CELL = 24
COLS, ROWS = 28, 18
WIDTH, HEIGHT = COLS * CELL, ROWS * CELL
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake")
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 22, bold=True)

def new_food(snake):
    while True:
        spot = (random.randrange(COLS), random.randrange(ROWS))
        if spot not in snake:
            return spot

snake = [(5, 9), (4, 9), (3, 9)]
direction = (1, 0)
pending = direction
food = new_food(snake)
alive = True

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key in (pygame.K_UP, pygame.K_w) and direction != (0, 1):
                pending = (0, -1)
            elif event.key in (pygame.K_DOWN, pygame.K_s) and direction != (0, -1):
                pending = (0, 1)
            elif event.key in (pygame.K_LEFT, pygame.K_a) and direction != (1, 0):
                pending = (-1, 0)
            elif event.key in (pygame.K_RIGHT, pygame.K_d) and direction != (-1, 0):
                pending = (1, 0)
            elif event.key == pygame.K_r and not alive:
                snake = [(5, 9), (4, 9), (3, 9)]
                direction = (1, 0)
                pending = direction
                food = new_food(snake)
                alive = True

    if alive:
        direction = pending
        head = (snake[0][0] + direction[0], snake[0][1] + direction[1])
        hit_wall = not (0 <= head[0] < COLS and 0 <= head[1] < ROWS)
        if hit_wall or head in snake:
            alive = False
        else:
            snake.insert(0, head)
            if head == food:
                food = new_food(snake)
            else:
                snake.pop()

    screen.fill((12, 18, 16))
    pygame.draw.rect(screen, (226, 84, 74), (food[0] * CELL, food[1] * CELL, CELL, CELL), border_radius=6)
    for index, (x, y) in enumerate(snake):
        color = (126, 214, 140) if index else (236, 244, 220)
        pygame.draw.rect(screen, color, (x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2), border_radius=5)
    label = font.render("Score " + str(len(snake) - 3), True, (220, 232, 220))
    screen.blit(label, (10, 8))
    if not alive:
        over = font.render("Crashed. Press R to restart.", True, (255, 220, 180))
        screen.blit(over, (10, 36))
    pygame.display.flip()
    clock.tick(10)

pygame.quit()
