import * as T from './three.module.js';

let template;
// White and light-blue fries sleeve with an orange rim and fries protruding above it.
export function brandedFries(){
 if(template)return template.clone(true);
 const g=new T.Group(),shape=new T.Shape();
 shape.moveTo(-.29,0);shape.lineTo(.29,0);shape.lineTo(.37,.54);shape.lineTo(-.37,.54);shape.closePath();
 const paper=new T.MeshStandardMaterial({color:'#f7f6eb',roughness:.85,side:T.DoubleSide});
 const sleeve=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.28,bevelEnabled:false}),paper);
 sleeve.position.z=-.14;sleeve.castShadow=true;sleeve.receiveShadow=true;g.add(sleeve);
 const blue=new T.MeshStandardMaterial({color:'#bce4ee',roughness:.88});
 const band=new T.Mesh(new T.BoxGeometry(.70,.14,.286),blue);band.position.set(0,.13,0);g.add(band);
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const c=canvas.getContext('2d');
  c.fillStyle='#f47d20';c.beginPath();c.ellipse(128,58,90,26,0,Math.PI,2*Math.PI);c.fill();
  c.fillStyle='#d62300';c.textAlign='center';c.font='900 43px Arial,sans-serif';c.fillText('BURGER',128,127,228);c.fillText('KING',128,181,195);
  c.fillStyle='#f47d20';c.beginPath();c.ellipse(128,206,90,14,0,0,Math.PI);c.fill();
  const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;
  const mark=new T.Mesh(new T.PlaneGeometry(.34,.34),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));
  mark.position.set(0,.40,.148);mark.castShadow=false;g.add(mark);
 }
 const fry=new T.MeshStandardMaterial({color:'#f9c84c',roughness:.8});
 for(let i=0;i<9;i++){
  const piece=new T.Mesh(new T.BoxGeometry(.045,.48+(i%3)*.08,.048),fry);
  piece.position.set(-.27+(i%5)*.135,.55+(i%3)*.025,(Math.floor(i/5)-.5)*.13);
  piece.rotation.z=(i%3-1)*.13;piece.castShadow=true;g.add(piece);
 }
 template=g;return g.clone(true);
}
