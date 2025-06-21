import Phaser from "phaser";
import {GAME_STATE} from "./core/gameState.js";

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
        description: "Need this base for\nbuild 3 more bases."
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

new Phaser.Game(
    {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        physics: {default: 'arcade'},
        scene: {preload, create, update}
    }
);

function worldToGrid(worldX, worldY)
{
    return {
        x: Math.floor(worldX / GRID_SIZE),
        y: Math.floor(worldY / GRID_SIZE)
    };
}

function gridToWorld(gridX, gridY)
{
    return {
        x: gridX * GRID_SIZE + GRID_SIZE / 2,
        y: gridY * GRID_SIZE + GRID_SIZE / 2
    };
}

function getGridKey(gridX, gridY)
{
    return `${gridX},${gridY}`;
}

function drawGrid(scene)
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

function preload()
{
    this.load.image('map', 'resources/map.png');
    this.load.image('principalBase', 'resources/principalBase.png');
    this.load.image('buildBase', 'resources/buildBase.png');
    this.load.image('lowCostBase', 'resources/1.png');
    this.load.image('highCostBase', 'resources/2.png');
    this.load.image('casino', 'resources/casino.png');
}

function drawHUI()
{
    const principalWorldPos = gridToWorld(worldToGrid(530, 220).x, worldToGrid(530, 220).y);

    principalBase = this.add.image(principalWorldPos.x, principalWorldPos.y, 'principalBase');
    grid[getGridKey(worldToGrid(530, 220).x, worldToGrid(530, 220).y)] = {
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

function handleClickInput()
{
    this.input.on('pointerdown',
    function (pointer)
    {
        const gridPos = worldToGrid(pointer.worldX, pointer.worldY);
        const gridKey = getGridKey(gridPos.x, gridPos.y);
        const worldPos = gridToWorld(gridPos.x, gridPos.y);

        if (pointer.worldY > map.height || (baseNumber >= capBase && selectedBaseIndex !== 0)) {
            return;
        }
        if (GAME_STATE.ressources.gold >= baseTypes[selectedBaseIndex].price) {
            if (worldPos.x < GRID_SIZE/2 || worldPos.x > map.width - GRID_SIZE/2 ||
                worldPos.y < GRID_SIZE/2 || worldPos.y > map.height - GRID_SIZE/2) {
                return;
            }
            if (grid[gridKey]) {
                bases.indexOf(grid[gridKey]) > -1 ? bases.splice(bases.indexOf(grid[gridKey]), 1) : 0;
                grid[gridKey].type > 0 ? baseNumber-- : grid[gridKey].type === 0 ? capBase -= 3 : 0;
                grid[gridKey].sprite.destroy();
                delete grid[gridKey];
            }
            capBase += (selectedBaseIndex === 0) * 3;
            baseNumber += (selectedBaseIndex !== 0);
            multiplicator *= (selectedBaseIndex === 3) ? 1.3 : 1;
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

function handleBindInput()
{
    this.selectedBaseIndex = 0;

    this.input.keyboard.on('keydown-LEFT', () => {
        this.selectedBaseIndex = (this.selectedBaseIndex - 1 + baseTypes.length) % baseTypes.length;
        selectBase.call(this, this.selectedBaseIndex);
    });
    this.input.keyboard.on('keydown-RIGHT', () => {
        this.selectedBaseIndex = (this.selectedBaseIndex + 1) % baseTypes.length;
        selectBase.call(this, this.selectedBaseIndex);
    });
    this.input.keyboard.on('keydown-G', () => {
        gridGraphics.visible = !gridGraphics.visible;
    });    
}

function create()
{
    map = this.add.image(0, 0, 'map').setOrigin(0, 0);
    this.cameras.main.setBounds(0, 0, map.width, map.height);
    this.cameras.main.setZoom(1);
    drawGrid(this);
    drawHUI.call(this);
    handleClickInput.call(this);
    handleBindInput.call(this);
    updateUI();
}

function selectBase(index)
{
    selectedBaseIndex = index;
    selectedBaseImage.setTexture(baseTypes[index].key);
    updateUI();
}

function updateUI()
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

function update(time, delta)
{
    GAME_STATE.ressources.gold < 0 && !this.gameOver ? loose.call(this) : 0;
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
        GAME_STATE.ressources.gold <= 0 ? loose.call(this) : 0;
        updateUI();
    }
}

function loose()
{
    this.gameOver = true;
    this.gameOverText = this.add.text(760, 440, "GAME OVER\nPress R to restart",
    {
        fontSize: "64px",
        fill: "#f00",
        align: "center"
    }).setOrigin(0.5).setScrollFactor(0);
    this.input.keyboard.once("keydown-R", () => window.location.reload());
}
