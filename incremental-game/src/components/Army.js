export function createArmy(start_size = 0) {
    return {
        size: start_size,
        strength: 1,
        hp: 10,
        cost: 100,
    };
}

export function upgradeArmy(army, cost, gameState) {
    if (gameState.resources.gold >= cost) {
        gameState.resources.gold -= cost;
        army.strength *= 1.5;
        army.hp *= 1.5;
        army.cost *= 1.8;
        return true
    }
    return false
}

export function recruitSoldiers(army, gameState, amount) {
    if (gameState.resources.soldiers >= amount) {
        army.size += amount;
        gameState.resources.soldiers -= amount;
        return true;
    }
    return false;
}