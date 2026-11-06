import pygame

pygame.init()
screen = pygame.display.set_mode((800, 500))
pygame.display.set_caption("Sprites")
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 22)


class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.Surface((46, 46), pygame.SRCALPHA)
        pygame.draw.rect(self.image, (126, 196, 255), (0, 0, 46, 46), border_radius=8)
        self.rect = self.image.get_rect(topleft=(x, y))

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.rect.x -= 5
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.rect.x += 5
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            self.rect.y -= 5
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            self.rect.y += 5
        self.rect.clamp_ip(screen.get_rect())


class Coin(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.Surface((28, 28), pygame.SRCALPHA)
        pygame.draw.circle(self.image, (255, 206, 84), (14, 14), 12)
        pygame.draw.circle(self.image, (150, 96, 20), (14, 14), 12, 2)
        self.rect = self.image.get_rect(center=(x, y))


player = Player(80, 220)
coins = pygame.sprite.Group()
for pos in ((180, 140), (320, 240), (470, 160), (610, 300), (700, 120), (250, 380), (540, 390)):
    coins.add(Coin(pos[0], pos[1]))
everything = pygame.sprite.Group()
everything.add(player)
everything.add(coins)
score = 0

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
            running = False

    everything.update()
    caught = pygame.sprite.spritecollide(player, coins, True)
    score += len(caught)

    screen.fill((18, 24, 38))
    everything.draw(screen)
    label = font.render("Score " + str(score) + "   collect the coins", True, (230, 236, 245))
    screen.blit(label, (20, 16))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
