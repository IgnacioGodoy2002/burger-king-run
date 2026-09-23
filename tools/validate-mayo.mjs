import assert from 'node:assert/strict';
import * as T from '../public/game/js/three.module.js';
import {mayonnaiseReward,MAYO_PER_SHIELD} from '../public/game/js/mayonnaise.js';
import {grantShield,resolveHazards,SHIELD_RECOVERY_SECONDS,SHIELD_SECONDS,tickTimedPowers} from '../public/game/js/shield.js';
import {World} from '../public/game/js/world.js';
import {PlayerPhysics} from '../public/game/js/physics.js';
import {brandedCup} from '../public/game/js/branded-cup.js';
assert.equal(MAYO_PER_SHIELD,100);
for(let n=0;n<=301;n++){const r=mayonnaiseReward(n);assert.equal(r.activate,[100,200,300].includes(n));assert.equal(r.charge,n%100)}
assert.equal(mayonnaiseReward(0).activate,false);
const powers={speed:6};for(let n=1;n<=100;n++)if(mayonnaiseReward(n).activate)grantShield(powers);
assert.equal(powers.shield,SHIELD_SECONDS);tickTimedPowers(powers,4.99);assert(powers.shield>0);
tickTimedPowers(powers,.02);assert.equal(powers.shield,0);assert.ok(Math.abs(powers.speed-.99)<1e-9);
// Exercise the actual swept collision and removal path used by the game.
const impactWorld=new World(new T.Scene(),{loadAssets:false}),player=new PlayerPhysics(),active={};
grantShield(active);impactWorld.spawn('wall',0,-.4);impactWorld.spawn('low',0,-.4);
for(const hazard of impactWorld.items){hazard.oldZ=-.4;hazard.z=.4}
const first=resolveHazards([...impactWorld.items],player,impactWorld,active,0);
assert.equal(first.dead,false);assert.equal(first.absorbed,true);assert(active.shield>0);
assert.equal(first.invincible,SHIELD_RECOVERY_SECONDS);
assert.equal(impactWorld.items.length,1);
assert.equal(resolveHazards([...impactWorld.items],player,impactWorld,active,first.invincible).dead,false);
tickTimedPowers(active,SHIELD_SECONDS);
assert.equal(resolveHazards([...impactWorld.items],player,impactWorld,active,0).dead,true);
const world=new World(new T.Scene(),{loadAssets:false});for(let i=0;i<100;i++){world.clear();world.rows=i;world.row(32);assert(world.items.every(o=>!['shield','magnet','double'].includes(o.type)))}
const cup=brandedCup(),box=new T.Box3().setFromObject(cup);assert(box.max.y>3&&box.max.y<3.1);assert(box.max.x<.8);
console.log('PASS: shield earned every 100 bottles, lasts exactly five seconds, absorbs collisions while active, no street shield/x2/magnet pickups.');
