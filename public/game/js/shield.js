export const SHIELD_SECONDS=5;
// A sauce reward grants five seconds of protection. A new reward refreshes it.
export function grantShield(powers){powers.shield=SHIELD_SECONDS}
export function hasShield(powers){return (powers.shield||0)>0}
export function tickTimedPowers(powers,dt){for(const key in powers)powers[key]=Math.max(0,powers[key]-dt)}

export const SHIELD_RECOVERY_SECONDS=1.6;
// All hazards in the crossing frame share the same recovery window.
export function resolveHazards(hazards,player,world,powers,invincible){
 let absorbed=false;
 for(const obstacle of hazards){
  if(invincible>0||!player.collides(obstacle,obstacle.oldZ))continue;
  if(!hasShield(powers))return {dead:true,absorbed,invincible};
  world.remove(obstacle);
  invincible=SHIELD_RECOVERY_SECONDS;
  absorbed=true;
 }
 return {dead:false,absorbed,invincible};
}
