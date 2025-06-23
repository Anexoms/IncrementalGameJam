import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('preloader', 'assets/preloader.png');
    }

    create ()
    {
        this.registry.set('highscore', 0);

        this.input.once('pointerdown', () => {

            this.scene.start('Preloader');

        });
    }
}
