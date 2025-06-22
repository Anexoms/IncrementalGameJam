import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(560, 384, 'preloader');

        this.add.rectangle(560, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(560-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('background', 'background.png');
        this.load.image('logo', 'cc-logo.png');
        this.load.image('map',              'map.png');
        this.load.image('principalBase',    'principalBase.png');
        this.load.image('buildBase',        'buildBase.png');
        this.load.image('lowCostBase',      '1.png');
        this.load.image('highCostBase',     '2.png');
        this.load.image('casino',           'casino.png');
        this.load.spritesheet('explosion', 'explosion.png', {
            frameWidth: 59,
            frameHeight: 57,
            startFrame: 0,
            endFrame: 9,
            spacing: 2
        });
    }

    create ()
    {
        this.scene.transition({
            target: 'MainMenu',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }
}
