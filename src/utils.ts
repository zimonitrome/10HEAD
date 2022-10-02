import * as ex from "excalibur";
import { Corpse } from "./actors/corpse";
import { Player } from "./actors/player";

export const snap = (coord: number, tileSize = 50) => tileSize * Math.floor(coord / tileSize) + tileSize / 2;

export const getCorpses = (engine: ex.Engine) => engine.currentScene.world.entityManager.entities.filter(a => a.name == "corpse") as Array<Corpse>;

export const getPlayer = (engine: ex.Engine) => engine.currentScene.world.entityManager.entities.find(a => a.name == "player") as Player;

export const overlapsCorpse = (engine: ex.Engine, x: number, y: number) => getCorpses(engine).some(c => c.pos.distance(ex.vec(x, y)) < 25);

export const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];