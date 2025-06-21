let game;
let camera;
let map;
let principalBase;
let littleBase;
let bigBase;
let buildBase;

let keys = {};

window.onload = function() {
    game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        physics: {default: 'arcade'},
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    });
};

function preload()
{
    this.load.image('map', 'resources/map.png');
    this.load.image('principalBase', 'resources/buildBase.png');
    this.load.image('littleBase', 'resources/1.png');
    this.load.image('bigBase', 'resources/2.png');
    this.load.image('buildBase', 'resources/buildBase.png');
}

function create()
{
    map = this.add.image(0, 0, 'map').setOrigin(0, 0);
    this.cameras.main.setBounds(0, 0, map.width, map.height);
    camera = this.cameras.main;
    camera.setZoom(1.5);
}

function update()
{

}
