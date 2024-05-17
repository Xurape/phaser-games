const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // fps: 120,
            // vsync: true,
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

/**
 * 
 * Função executada antes do jogo iniciar
 * 
 */
function preload() {
    this.load.image('spaceship', 'game/sprites/spaceship.png');
    this.load.image('bullet', 'game/sprites/bullet.png');
    this.load.image('enemy_1', 'game/sprites/enemy_1.png');
    this.load.image('enemy_2', 'game/sprites/enemy_2.png');
    this.load.image('background', 'game/sprites/background.jpg');
    this.load.image('background_2', 'game/sprites/background_2.jpg');
}

/**
 * 
 * Definição de variáveis globais
 * 
 */
var background,
    player,
    controls,
    firekey,
    bullets,
    enemies,
    bulletCollider,
    enemyCollider,
    playerInfo = {
        lives: 5,
        score: 0
    },
    infoText = {
        score: null,
        lives: null
    };

/**
 * 
 * Função executada quando o jogo inicia
 * 
 */
function create() {
    // Adicionar background
    background = this.add.image(400, 300, 'background_2').setScale(0.5).setAlpha(0.5);

    // Criar o player
    player = this.physics.add.sprite(400, 500, 'spaceship').setScale(0.05);

    // Bloquear sair do world border
    player.setCollideWorldBounds(true);

    // Habilitar as teclas para inputs
    controls = this.input.keyboard.createCursorKeys();

    // Habilitar a tecla de espaço para atirar
    firekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Habilitar a tecla de r para restart
    restartkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Criar um grupo de balas
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 500
    });

    // Criar um grupo de inimigos
    enemies = this.physics.add.group({
        defaultKey: 'enemy_1',
        maxSize: 35,
        runChildUpdate: true
    });

    // Adicionar spawn de inimigos
    this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: spawnEnemy,
    });

    // Adicionar texto de score
    infoText.score = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px',
        fill: '#ffffff'
    });

    // Adicionar texto de vidas
    infoText.lives = this.add.text(10, 30, 'Lives: 5', {
        fontSize: '20px',
        fill: '#ffffff'
    });
}

/**
 * 
 * Função executada a cada frame
 * 
 */
function update() {
    // Definir velocidade a 0 a cada frame para o player ficar estagnado quando não estiver pressionada nenhuma tecla
    player.setVelocity(0);
    
    if(controls.left.isDown)
        player.setVelocityX(-300);
    
    if(controls.right.isDown)
        player.setVelocityX(300);

    if (controls.up.isDown)
        player.setVelocityY(-300);

    if (controls.down.isDown)
        player.setVelocityY(300);

    if(Phaser.Input.Keyboard.JustDown(firekey))
        fireBullet();

    if(Phaser.Input.Keyboard.JustDown(restartkey)) {
        this.scene.restart();
        playerInfo = {
            lives: 5,
            score: 0
        };
    }

    // Adicionar colisão entre as balas e os inimigos
    bulletCollider = this.physics.add.collider(bullets, enemies, bulletHitEnemy, null, this);

    // Adicionar colisão entre o player e os inimigos
    enemyCollider = this.physics.add.collider(player, enemies, playerHitEnemy, null, this);

    // Atualizar o texto de score e vidas
    infoText.lives.setText("Lives: " + playerInfo.lives);
    infoText.score.setText("Score: " + playerInfo.score);

    // Se o inimigo sair fora do ecrã, destruir o inimigo e diminuir uma vida
    Phaser.Actions.Call(enemies.getChildren(), function(enemy) {
        if(enemy.active && enemy.y > game.config.height) {
            enemy.destroy();
            playerInfo.lives -= 1;

            if(playerInfo.lives == 0) {
                this.scene.pause();
                this.add.text(400, 300, 'Game Over', {
                    fontSize: '40px',
                    fill: '#ffffff'
                }).setOrigin(0.5);
            }
        }
    }, this);
}

/**
 * 
 * Disparar uma bala
 * 
 */
function fireBullet() {
    let bullet = bullets.get();

    if(bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-600);
        bullet.setPosition(player.x, player.y - 20);
        bullet.setScale(0.05);
        bullet.setRotation(-Math.PI / 2);
    }
}

/**
 * 
 * Spawnar um inimigo
 * 
 */
function spawnEnemy() {
    let enemy = enemies.get();

    if(enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.setVelocityY(100);
        enemy.setPosition(Math.random() * 800, 0);
        enemy.setScale(0.25);
    }
}

/**
 * 
 * Função executada quando uma bala atinge um inimigo
 * 
 */
function bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    playerInfo.score += 10;
}

/**
 * 
 * Função executada quando um inimigo atinge o player
 * 
 */
function playerHitEnemy(player, enemy) {
    enemy.destroy();

    playerInfo.lives -= 1;
    playerInfo.score -= 10;

    if(playerInfo.lives == 0) {
        this.scene.pause();
        this.add.text(400, 300, 'Game Over', {
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}