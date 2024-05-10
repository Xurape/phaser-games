const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 120,
            vsync: true,
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
}

/**
 * 
 * Definição de variáveis globais
 * 
 */
var player,
    controls,
    firekey,
    bullets;

/**
 * 
 * Função executada quando o jogo inicia
 * 
 */
function create() {
    // Criar o player
    player = this.physics.add.sprite(400, 500, 'spaceship').setScale(0.05);

    // Habilitar as teclas para inputs
    controls = this.input.keyboard.createCursorKeys();

    // Habilitar a tecla de espaço para atirar
    firekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Criar um grupo de balas
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 500
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