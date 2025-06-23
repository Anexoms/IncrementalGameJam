import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38,
            color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(560, 384, 'background');

        const logo = this.add.image(560, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 320,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        const instructions = [
            'Can you manage your campement,',
            'And make it the greatest?',
            '',
            'Click to Start!'
        ]

        this.add.text(560, 550, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Camp');

        });
    }
}
