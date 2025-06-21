let game;
let camera;
let map;
let principalBase;
let resourceText;
let selectedBaseText;
let selectedBaseImage;
let resources = 0;
let lastIncome = 0;
let bases = [];
let selectedBaseIndex = 0;
let capBase = 0;
let baseNumber = 0;

const baseTypes = [
    {
        name: "Build base",
        key: "buildBase",
        price: 10,
        income: -1,
        description: "Need this base for build 3 more bases."
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
    }
];

window.onload =
function()
{
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
    this.load.image('principalBase', 'resources/principalBase.png');
    this.load.image('buildBase', 'resources/buildBase.png');
    this.load.image('lowCostBase', 'resources/1.png');
    this.load.image('highCostBase', 'resources/2.png');
}

function create()
{
    map = this.add.image(0, 0, 'map').setOrigin(0, 0);
    this.cameras.main.setBounds(0, 0, map.width, map.height);
    camera = this.cameras.main;
    camera.setZoom(1.3);
    principalBase = this.add.image(530, 295, 'principalBase');
    bases.push({sprite: principalBase, type: -1});
    selectedBaseText = this.add.text(500, 770, "",
        {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5, 0).setScrollFactor(0);
    selectedBaseImage = this.add.image(830, 770,
        baseTypes[selectedBaseIndex].key).setScale(2).setScrollFactor(0);
    resourceText = this.add.text(1000, 770, "",
        {
            fontSize: '16px',
            fill: '#fff'
        }).setScrollFactor(0);
    this.input.on('pointerdown',
    function (pointer)
    {
        if (pointer.worldY > map.height) {
            return;
        }
        if (baseNumber >= capBase && selectedBaseIndex !== 0) {
            return;
        }
        if (resources >= baseTypes[selectedBaseIndex].price) {
            if (selectedBaseIndex === 0) {
                capBase += 3;
            }
            baseNumber += selectedBaseIndex !== 0 ? 1 : 0;
            bases.push({
                sprite: this.add.image(pointer.worldX, pointer.worldY, baseTypes[selectedBaseIndex].key),
                type: selectedBaseIndex
            });
            resources -= baseTypes[selectedBaseIndex].price;
        }
    }, this);
    this.input.keyboard.on('keydown-A', () => selectBase(0));
    this.input.keyboard.on('keydown-Z', () => selectBase(1));
    this.input.keyboard.on('keydown-E', () => selectBase(2));
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
    resourceText.setText("Money : " + resources + "\n\nA: Build base, Z: Low cost base, E: High cost base.\nClick to place it.");
    selectedBaseText.setText(baseTypes[selectedBaseIndex].name +
    " | Prix : " + baseTypes[selectedBaseIndex].price +
    " | Gain/sec : " + baseTypes[selectedBaseIndex].income +
    "\nDescription : " + baseTypes[selectedBaseIndex].description +
    "\nBase builded : " + baseNumber +
    "\nNumber of base authorized : " + capBase);
}

function update(time, delta)
{
    if (!lastIncome || time - lastIncome > 1000) {
        lastIncome = time;
        let total = 0;
        for (let b of bases) {
            total += (b.type === -1) ? 2 : baseTypes[b.type].income;
        }
        resources += total;
        updateUI();
    }
}
