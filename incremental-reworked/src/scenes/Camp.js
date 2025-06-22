import { Scene } from 'phaser';
import {GAME_STATE} from "./gameState.js";

let map;
let principalBase;
let resourceText;
let selectedBaseText;
let selectedBaseImage;
let lastIncome = 0;
let bases = [];
let selectedBaseIndex = 0;
let capBase = 0;
let baseNumber = 0;
const GRID_SIZE = 56;
let grid = {};
let gridGraphics;
let multiplicator = 0.8;


const baseTypes = [
    {
        name: "Build base",
        key: "buildBase",
        price: 10,
        income: -1,
        description: "Up your base integrity."
    },
    {
        name: "Base Low Cost",
        key: "lowCostBase",
        price: 40,
        income: 3,
        description: "Good for start."
    },
    {
        name: "Base High Cost",
        key: "highCostBase",
        price: 120,
        income: 10,
        description: "Best base."
    },
    {
        name: "Casino",
        key: "casino",
        price: 300,
        income: -30,
        description: "Mulply your income but it's not\nwithout a little constraint..."
    } 
];

export class Camp extends Scene
{
    constructor ()
    {
        super('Camp');
    }

    create()
    {
        map = this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.cameras.main.setBounds(0, 0, map.width, map.height);
        this.cameras.main.setZoom(1);
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9}),
            frameRate: 18,
            repeat: 0
        });    
        this.drawGrid(this);
        this.drawHUI.call(this);
        this.handleClickInput.call(this);
        this.handleBindInput.call(this);
        this.updateUI();
    } 

    update(time, delta)
       {
        GAME_STATE.ressources.gold < 0 && !this.gameOver ? this.loose.call(this) : 0;
        if (!lastIncome || time - lastIncome > 1000) {
            lastIncome = time;
            GAME_STATE.info.total_time += 1;
            let total = 0;
            for (let b of bases) {
                total += (b.type === -1) ? 2 : baseTypes[b.type].income;
            }
            console.log(multiplicator);
            GAME_STATE.ressources.gold = Math.round((GAME_STATE.ressources.gold
            + total * multiplicator) * 100) / 100;
            if (this.registry.get('highscore') <= GAME_STATE.ressources.gold)
                this.registry.set('highscore', GAME_STATE.ressources.gold);
            GAME_STATE.ressources.gold <= 0 ? this.loose.call(this) : 0;
            this.updateUI();
        }
        this.calculExplosion.call(this);
    }

    calculExplosion()
    {
        if (baseNumber > capBase) {
            let eligible = bases.filter(b => b.type !== -1 && b.type !== 0);
            if (eligible.length > 0 && Math.random() < Math.min((baseNumber - capBase) * 0.001, 1)) {
                let base = eligible[Math.floor(Math.random() * eligible.length)];
                this.spawnExplosion.call(this, base.sprite.x, base.sprite.y);
                base.sprite.destroy();
                bases.indexOf(base) !== -1 ? bases.splice(bases.indexOf(base), 1) : 0;
                for (let b in grid) {
                    if (grid[b] === base) {
                        delete grid[b];
                        break;
                    }
                }            
                baseNumber--;
            }
        } 
    }

    loose()
    {
        this.gameOver = true;
        this.scene.transition({
            target: 'GameOver',
            duration: 2000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }

    updateUI()
    {
        resourceText.setText("Money : " + GAME_STATE.ressources.gold +
            "\n\nBind up or down for select the building\n" +
            "Click to place it.\nG: Toggle grid display" +
            "\nBase builded : " + baseNumber +
            "\nMaximum base integrity : " + capBase +
            "\nMultiplicator : " + multiplicator);
        selectedBaseText.setText(baseTypes[selectedBaseIndex].name +
            " | Prix : " + baseTypes[selectedBaseIndex].price +
            " | Gain/sec : " + baseTypes[selectedBaseIndex].income +
            "\nDescription : " + baseTypes[selectedBaseIndex].description);
    }

    worldToGrid(worldX, worldY)
    {
        return {
            x: Math.floor(worldX / GRID_SIZE),
            y: Math.floor(worldY / GRID_SIZE)
        };
    }

    gridToWorld(gridX, gridY)
    {
        return {
            x: gridX * GRID_SIZE + GRID_SIZE / 2,
            y: gridY * GRID_SIZE + GRID_SIZE / 2
        };
    }

    getGridKey(gridX, gridY)
    {
        return `${gridX},${gridY}`;
    }

    drawGrid(scene)
    {
        gridGraphics ? gridGraphics.destroy() : 0;
        gridGraphics = scene.add.graphics();
        gridGraphics.lineStyle(1, 0x333333, 0.3);
        for (let x = 0; x <= map.width; x += GRID_SIZE) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, map.height);
        }
        for (let y = 0; y <= map.height; y += GRID_SIZE) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(map.width, y);
        }
        gridGraphics.strokePath();
    }

    spawnExplosion(x, y)
    {
        const explosion = this.add.sprite(x, y, 'explosion');

        explosion.play('explosion');
        explosion.on('animationcomplete', () => explosion.destroy());
    }

    drawHUI()
    {
        const principalWorldPos = this.gridToWorld(this.worldToGrid(530, 220).x, this.worldToGrid(530, 220).y);

        principalBase = this.add.image(principalWorldPos.x, principalWorldPos.y, 'principalBase');
        grid[this.getGridKey(this.worldToGrid(530, 220).x, this.worldToGrid(530, 220).y)] = {
            sprite: principalBase,
            type: -1
        };
        bases.push({
            sprite: principalBase,
            type: -1
        });
        selectedBaseText = this.add.text(280, 570, "",
            {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5, 0).setScrollFactor(0);
        selectedBaseImage = this.add.image(600, 630,
            baseTypes[selectedBaseIndex].key).setScale(2).setScrollFactor(0);
        resourceText = this.add.text(700, 570, "",
            {
                fontSize: '16px',
                fill: '#fff'
            }).setScrollFactor(0);
    }

    handleClickInput()
    {
        this.input.on('pointerdown',
        function (pointer)
        {
            const gridPos = this.worldToGrid(pointer.worldX, pointer.worldY);
            const gridKey = this.getGridKey(gridPos.x, gridPos.y);
            const worldPos = this.gridToWorld(gridPos.x, gridPos.y);

            if (pointer.worldY > map.height) {
                return;
            }
            if (GAME_STATE.ressources.gold >= baseTypes[selectedBaseIndex].price &&
            (worldPos.x > GRID_SIZE / 2 || worldPos.x < map.width - GRID_SIZE / 2 ||
            worldPos.y > GRID_SIZE / 2 || worldPos.y < map.height - GRID_SIZE / 2)) {
                if (grid[gridKey]) {
                    bases.indexOf(grid[gridKey]) > -1 ? bases.splice(bases.indexOf(grid[gridKey]), 1) : 0;
                    grid[gridKey].type > 0 ? baseNumber-- : grid[gridKey].type === 0 ? capBase -= 3 : 0;
                    grid[gridKey].sprite.destroy();
                    delete grid[gridKey];
                }
                capBase += (selectedBaseIndex === 0) * 3;
                baseNumber += (selectedBaseIndex !== 0) ? 1 : 0;
                multiplicator *= (selectedBaseIndex === 3) ? 1.4 : 1;
                const newBaseData = {
                    sprite: this.add.image(worldPos.x, worldPos.y, baseTypes[selectedBaseIndex].key),
                    type: selectedBaseIndex
                };
                grid[gridKey] = newBaseData;
                bases.push(newBaseData);
                GAME_STATE.ressources.gold -= baseTypes[selectedBaseIndex].price;
            }
        }, this);
    }

    handleBindInput()
    {
        this.selectedBaseIndex = 0;

        this.input.keyboard.on('keydown-LEFT', () => {
            this.selectedBaseIndex = (this.selectedBaseIndex - 1 + baseTypes.length) % baseTypes.length;
            this.selectBase.call(this, this.selectedBaseIndex);
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.selectedBaseIndex = (this.selectedBaseIndex + 1) % baseTypes.length;
            this.selectBase.call(this, this.selectedBaseIndex);
        });
        this.input.keyboard.on('keydown-G', () => {
            gridGraphics.visible = !gridGraphics.visible;
        });
    }

    selectBase(index)
    {
        selectedBaseIndex = index;
        selectedBaseImage.setTexture(baseTypes[index].key);
        this.updateUI();
    }
}
