import {brandedCup} from './branded-cup.js';
import {brandedFries} from './branded-fries.js';
import * as T from './three.module.js';
export const palette={red:new T.MeshStandardMaterial({color:'#d62300',roughness:.55}),cream:new T.MeshStandardMaterial({color:'#f5ebdc',roughness:.8}),metal:new T.MeshStandardMaterial({color:'#9aadb4',roughness:.35,metalness:.5}),dark:new T.MeshStandardMaterial({color:'#502314',roughness:.7}),wood:new T.MeshStandardMaterial({color:'#ae7446',roughness:.9}),green:new T.MeshStandardMaterial({color:'#519252',roughness:.95}),gold:new T.MeshStandardMaterial({color:'#ff8733',roughness:.6}),white:new T.MeshStandardMaterial({color:'#fffdf4',roughness:.85})};
const box=new T.BoxGeometry(),cyl=new T.CylinderGeometry(1,1,1,16),sphere=new T.SphereGeometry(1,12,8);const cached=new Map();
export function part(parent,geo,mat,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
export function prop(type){if(cached.has(type))return cached.get(type).clone(true);const g=new T.Group(),m=palette,b=(color,x,y,z,sx,sy,sz)=>part(g,box,color,x,y,z,sx,sy,sz);
 if(type==='mayo'){
 // Sauce bottle collectible: the red ketchup silhouette reads clearly at running speed.
 const yellow=new T.MeshStandardMaterial({color:'#d62300',roughness:.32}),cap=new T.MeshStandardMaterial({color:'#f5ebdc',roughness:.4});
 const profile=[[0,-.38],[.19,-.38],[.224,-.35],[.23,-.30],[.23,.25],[.22,.29],[.18,.32],[0,.32]].map(([r,y])=>new T.Vector2(r,y));
 part(g,new T.LatheGeometry(profile,24),yellow,0,0,0);
 const ribs=new T.CylinderGeometry(.235,.235,.10,112);const vertices=ribs.attributes.position;for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),z=vertices.getZ(i);if(Math.hypot(x,z)>.2){const angle=Math.atan2(x,z),factor=1+.025*Math.cos(angle*28);vertices.setX(i,x*factor);vertices.setZ(i,z*factor);}}ribs.computeVertexNormals();part(g,ribs,cap,0,.345,0);
 part(g,cyl,yellow,0,.409,0,.14,.04,.14);
 part(g,new T.CylinderGeometry(.022,.062,.20,16),yellow,0,.524,0);
 part(g,cyl,cap,0,.629,0,.023,.013,.023);
 part(g,box,m.cream,0,-.03,.228,.22,.21,.013);
 }else if(type==='napkins'){
 // Stainless steel dispenser with a dark dispensing slot and visible paper stack.
 b(m.dark,0,.06,0,1.8,.12,1.05);b(m.metal,0,.43,0,1.72,.74,.92);
 b(m.white,0,.56,.475,1.43,.31,.028);b(m.dark,0,.59,.493,1.30,.10,.022);
 for(let i=0;i<5;i++)b(m.white,(i-2)*.06,.83+i*.014,-.02,1.06,.022,.59);
 const tissue=b(m.white,0,.92,.1,1.0,.15,.025);tissue.rotation.x=-.25;
 b(m.metal,0,.27,.50,.70,.16,.025);
 }else if(type==='cup'){g.add(brandedCup());
 }else if(type==='tray'){
 // Moving kitchen trolley: silver legs, metal shelves, blue cup and the matching fries sleeve.
 for(const side of [-1,1]){
  b(m.metal,side*1.03,.86,0,.13,1.72,.78);
  for(const z of [-.34,.34])part(g,cyl,m.dark,side*1.03,.13,z,.15,.10,.15,0,0,Math.PI/2);
 }
 b(m.metal,0,.68,0,2.20,.09,1.00);b(m.metal,0,1.78,0,2.25,.19,1.06);
 for(const z of [-.51,.51])b(m.metal,0,1.93,z,2.25,.15,.08);
 const cup=brandedCup();cup.scale.setScalar(.22);cup.position.set(-.55,1.89,0);g.add(cup);
 const fries=brandedFries();fries.scale.setScalar(.72);fries.position.set(.45,1.90,0);g.add(fries);
 b(m.dark,.72,1.91,-.36,.18,.045,.18);
 }else if(type==='floorTray'){
 b(m.dark,0,.14,0,1.75,.14,1.1);b(m.metal,0,.23,0,1.64,.045,.97);
 for(const z of [-.51,.51])b(m.metal,0,.28,z,1.75,.15,.065);
 const bun=new T.MeshStandardMaterial({color:'#e7ad61',roughness:.9}),patty=new T.MeshStandardMaterial({color:'#65402b',roughness:1});
 part(g,cyl,bun,-.35,.37,0,.35,.14,.35);part(g,cyl,patty,-.35,.47,0,.34,.10,.34);part(g,sphere,bun,-.35,.55,0,.35,.16,.35);
 const cup=brandedCup();cup.scale.setScalar(.20);cup.position.set(.46,.31,-.14);g.add(cup);
 const fries=brandedFries();fries.scale.setScalar(.4);fries.position.set(.08,.27,.24);g.add(fries);
 }else if(type==='table'){
 part(g,cyl,m.wood,0,1.06,0,1.1,.12,1.1);part(g,cyl,m.metal,0,.54,0,.075,1.0,.075);part(g,cyl,m.dark,0,.07,0,.5,.08,.5);
 for(const side of [-1,1]){b(m.red,side*1.35,.58,0,.66,.12,.68);b(m.red,side*1.68,.98,0,.10,.76,.68);for(const z of [-.25,.25]){b(m.dark,side*1.35,.30,z,.06,.53,.06)}}
 const cup=brandedCup();cup.scale.setScalar(.13);cup.position.set(.28,1.12,.20);g.add(cup);b(m.cream,-.24,1.14,-.15,.45,.025,.35);
 }else if(type==='umbrella'){
 part(g,cyl,m.metal,0,1.72,0,.055,3.4,.055);part(g,cyl,m.dark,0,.05,0,.45,.08,.45);
 const canopy=new T.ConeGeometry(2.05,.70,12,1,true);part(g,canopy,m.red,0,3.40,0);part(g,cyl,m.gold,0,3.79,0,.09,.10,.09);
 }else if(type==='planter'){
 b(m.cream,0,.30,0,1.7,.6,1.0);b(m.dark,0,.60,0,1.5,.02,.85);
 for(let i=0;i<3;i++)part(g,sphere,m.green,(i-1)*.52,.87,0,.58,.48,.48);
 }else if(type==='tree'){
 // Slim palms and long fronds give this boulevard a distinct skyline at low polygon cost.
 const bark=new T.MeshStandardMaterial({color:'#856047',roughness:1});
 for(let i=0;i<5;i++)part(g,new T.CylinderGeometry(.13-i*.012,.19-i*.012,1.12,7),bark,.08*i,.55+i*1.06,0,1,1,1,0,0,-.07);
 const verts=[],colors=[],tones=['#3b7442','#438957','#64a56c','#286e56'];
 const put=(p,c)=>{verts.push(...p);const color=new T.Color(c);colors.push(color.r,color.g,color.b)};
 for(let i=0;i<13;i++){
  const angle=i*2.399,dx=Math.sin(angle),dz=Math.cos(angle),px=-dz,pz=dx,shade=tones[i%4];
  const center=[.36,5.48,0];
  for(let j=0;j<5;j++){
   const a=j/5,b=(j+1)/5,w=.54*Math.sin((a+.11)*Math.PI),w2=.54*Math.sin((b+.11)*Math.PI);
   const spine=t=>[center[0]+dx*2.65*t,center[1]+.62*Math.sin(Math.PI*t)-1.95*t*t,center[2]+dz*2.65*t];
   const left=t=>{const p=spine(t);const width=.54*Math.sin((t+.11)*Math.PI);return [p[0]+px*width,p[1]-.04,p[2]+pz*width]};
   const right=t=>{const p=spine(t);const width=.54*Math.sin((t+.11)*Math.PI);return [p[0]-px*width,p[1]-.04,p[2]-pz*width]};
   const a0=spine(a),b0=spine(b);
   for(const tri of [[a0,left(a),left(b)],[a0,left(b),b0],[a0,b0,right(b)],[a0,right(b),right(a)]])for(const vertex of tri)put(vertex,shade);
  }
 }
 const leaves=new T.BufferGeometry();leaves.setAttribute('position',new T.Float32BufferAttribute(verts,3));leaves.setAttribute('color',new T.Float32BufferAttribute(colors,3));leaves.computeVertexNormals();
 part(g,leaves,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.9}),0,0,0);
 }else if(type.startsWith('building')){
 // Reusable street-facing apartment and office shells. The instancer in Scenery
 // draws repeated facades together, keeping the extra city density affordable.
 const style=Number(type.slice(8))||0;
 const height=[8.4,11.1,9.7,14.2,10.8,12.5][style%6];
 const wall=new T.MeshStandardMaterial({color:['#c5aa99','#c8c7ba','#a58b78','#98b6bc','#d4b8a5','#b8b2a9'][style%6],roughness:.91});
 const trim=new T.MeshStandardMaterial({color:['#745e52','#5a6870','#705348','#4e6870','#866657','#6b655d'][style%6],roughness:.84});
 const glass=new T.MeshStandardMaterial({color:['#718f9b','#7eacb4','#657e8a','#91b7c4','#7c9da6','#7aa3ac'][style%6],roughness:.26,metalness:.12});
 const accent=[m.gold,m.cream,m.red,m.metal,m.wood,m.green][style%6];
 b(wall,0,height/2,0,6.5,height,5.1);
 b(trim,0,height+.10,0,6.8,.20,5.35);
 for(const x of [-3.30,3.30])b(trim,x,height+.38,0,.14,.60,5.35);
 // Ground-floor shop fronts break up the old residential silhouette.
 b(trim,0,1.45,2.60,6.12,2.72,.08);
 for(const x of [-2,0,2]){b(glass,x,1.38,2.66,1.77,2.38,.035);b(trim,x+.96,1.38,2.70,.08,2.45,.08)}
 b(accent,0,2.93,3.02,6.4,.18,1.02);
 const floors=Math.floor((height-3.35)/2.05);
 for(let floor=0;floor<floors;floor++){
  const y=4.15+floor*2.05;
  for(const x of [-2.12,0,2.12]){
   b(trim,x,y,2.57,1.42,1.36,.095);
   b(glass,x,y,2.63,1.18,1.14,.035);
   b(trim,x,y-.72,2.83,1.58,.13,.35);
  }
  if(style%3===1){b(trim,0,y-.85,2.99,5.5,.11,.70);for(const x of [-2.4,0,2.4])b(m.metal,x,y-.49,3.27,.07,.70,.07)}
 }
 if(style%2===0){b(trim,-1.7,height+.63,-.8,1.1,.88,1.2);b(m.metal,-1.7,height+1.12,-.8,1.2,.09,1.3)}
 else for(const x of [-2.55,2.55])b(trim,x,height+.60,0,.08,.85,4.9);
 }else if(type.startsWith('tower')){
 // Low-detail second-row buildings add depth without dozens of window meshes.
 const style=Number(type.slice(5))||0,height=[17,21,25,19][style%4];
 const wall=new T.MeshStandardMaterial({color:['#8e9ca0','#b9a99d','#87999c','#ac9c91'][style%4],roughness:.91});
 const glass=new T.MeshStandardMaterial({color:['#6e919c','#829aa4','#7096a6','#849fa9'][style%4],roughness:.35});
 b(wall,0,height/2,0,7.2,height,6.0);
 for(const x of [-2.2,0,2.2])b(glass,x,height/2,3.03,1.35,height-2,.055);
 for(let y=4;y<height-1;y+=3)b(wall,0,y,3.11,7.35,.23,.1);
 b(m.dark,0,height+.13,0,7.4,.26,6.2);
 if(style%2===0)b(m.metal,1.8,height+.8,-1,.1,1.4,.1);
 }else if(type.startsWith('house')){
 const shade=Number(type.slice(-1))||0,height=4.4+(shade%3)*.65;
 const walls=new T.MeshStandardMaterial({color:['#dfb594','#f3dfbd','#abc3b6','#d89c84','#dac7a4','#abc8cb'][shade%6],roughness:.91});
 const trim=new T.MeshStandardMaterial({color:['#865044','#b17750','#537b68','#a35443','#89674a','#5e8586'][shade%6],roughness:.81});
 const glass=new T.MeshStandardMaterial({color:'#628b91',roughness:.22,metalness:.09});
 b(walls,0,height/2,0,5.6,height,4.8);b(trim,0,height+.15,0,5.85,.30,5.05);
 for(const side of [-1,1])b(trim,side*2.72,height+.40,0,.12,.42,5.0);
 b(m.dark,0,1.25,2.45,4.85,2.45,.04);b(glass,0,1.25,2.49,4.64,2.25,.04);
 for(const x of [-1.55,0,1.55])b(trim,x,1.25,2.55,.08,2.35,.10);
 b(trim,0,2.62,2.70,5.1,.16,1.05);
 for(let i=-5;i<=5;i+=2)b(i%4===1?m.gold:m.cream,i*.45,2.53,2.74,.43,.08,1.06);
 for(const x of [-1.55,1.55]){
  b(trim,x,height-.97,2.44,1.31,1.28,.10);b(glass,x,height-.97,2.51,1.10,1.05,.035);
  b(m.cream,x,height-1.57,2.65,1.45,.13,.38);
 }
 if(shade%2===0){b(trim,-1.45,height+.50,-.7,1.35,.60,1.35);b(m.cream,-1.45,height+.83,-.7,1.52,.08,1.52)}
 else for(let i=0;i<5;i++)b(trim,-2.15+i*1.07,height+.43,0,.055,.55,4.6);
 }else if(type==='bench'){
 b(m.wood,0,.65,0,2.7,.12,.72);b(m.wood,0,1.05,-.30,2.7,.62,.10);for(const side of [-1,1])b(m.dark,side*1,.33,0,.08,.6,.58);
 }else if(type==='busStop'){
 // Open-sided shelter with transparent panels, visible off the running lanes.
 for(const x of [-1.5,1.5])b(m.dark,x,1.35,-.42,.09,2.7,.10);
 b(m.dark,0,2.71,-.42,3.35,.16,1.55);
 const glass=new T.MeshStandardMaterial({color:'#7fb3bf',transparent:true,opacity:.40,depthWrite:false,roughness:.2});
 part(g,box,glass,0,1.36,-1.15,3.02,2.48,.045);
 b(m.wood,0,.68,-.57,2.10,.13,.48);for(const x of [-.85,.85])b(m.dark,x,.34,-.57,.08,.65,.43);
 b(m.gold,1.54,2.3,.39,.06,.28,.5);
 }else if(type==='trafficLight'){
 part(g,cyl,m.dark,0,2.3,0,.055,4.6,.055);
 b(m.dark,.34,4.4,0,.75,.09,.10);b(m.dark,.72,3.98,0,.26,.94,.29);
 for(const [y,color] of [[4.26,m.red],[3.98,m.gold],[3.70,m.green]])part(g,sphere,color,.72,y,.16,.088,.088,.04);
 }else if(type==='shop'){
 b(m.cream,0,2.3,0,5.8,4.6,3.3);b(m.dark,0,4.37,0,6.25,.28,3.7);b(m.red,0,3.9,1.76,6.0,.65,.35);b(m.dark,0,2.1,1.68,4.8,2.65,.05);for(let i=-1;i<=1;i++)b(m.metal,i*1.5,2.1,1.75,.07,2.65,.08);b(m.gold,0,3.4,2.3,6,.12,1.1);
 // Sun shade and alternating warm stripes add a recognizable fast-food terrace silhouette.
 b(m.cream,0,3.14,2.2,5.7,.08,1.15);for(let i=-5;i<=5;i+=2)b(m.red,i*.48,3.10,2.2,.47,.085,1.16);
 }
 cached.set(type,g);return g.clone(true)}
