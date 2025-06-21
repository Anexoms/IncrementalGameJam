export function createGoldMine() {
    return {
        level: 1,
        productionPerSecond: 1,
        upgradeCost: 10,
        upgrade(building, gameState) {
            if (gameState.resources.gold >= building.upgradeCost) {
                gameState.resources.gold -= building.upgradeCost;
                building.level++;
                building.productionPerSecond += 0.5;
                building.upgradeCost *= 1.5;
                return true;
            }
            return false;
        },
    };
}

export function createBarracks() {
    return {
        level: 1,
        soldiersPerSecond: 0.2,
        upgradeCost: 15,
        upgrade(building, gameState) {
            if (gameState.resources.gold >= building.upgradeCost) {
                gameState.resources.gold -= building.upgradeCost;
                building.level++;
                building.soldiersPerSecond += 0.2;
                building.upgradeCost *= 1.6;
                return true;
            }
            return false;
        },
    };
}