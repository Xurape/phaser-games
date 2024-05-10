const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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

function preload() {
    this.loadimage('spaceship', 'sprites/spaceship.png');
    this.loadimage('bullet', 'sprites/bullet.png');
    this.loadimage('enemy_1', 'sprites/enemy_1.png');
    this.loadimage('enemy_2', 'sprites/enemy_2.png');
}

function create() {

}

function update() {
    
}