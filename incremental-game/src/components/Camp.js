import { createGoldMine, createBarracks } from "./Building.js";

export function createCamp(name = "Le camp d epitech") {
    return {
        id: 1,
        name,
        goldMine: createGoldMine(),
        barracks: createBarracks(),
    };
}

export function updateCampProduction(camp, deltaTime, gameState) {
    const gold = camp.goldMine.productionPerSecond * deltaTime;
    const soldiers = camp.barracks.soldiersPerSecond * deltaTime;

    gameState.resources.gold += gold;
    gameState.resources.soldiers += soldiers;
}

export function upgradeBuildingInCamp(camp, buildingType, gameState) {
    if (buildingType === "goldMine") {
        return camp.goldMine.upgrade(camp.goldMine, gameState);
    } else if (buildingType === "barracks") {
        return camp.barracks.upgrade(camp.barracks, gameState);
    }
}