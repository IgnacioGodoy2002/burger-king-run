import * as T from './three.module.js';
let template;
// Pale-blue paper cup with orange foot and compact bun logo, shared across the scene.
export function brandedCup(){
 if(template)return template.clone(true);
 const g=new T.Group(),paper=new T.MeshStandardMaterial({color:'#bce4ee',roughness:.88});
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const c=canvas.getContext('2d');
  c.fillStyle='#bce4ee';c.fillRect(0,0,1024,1024);
  c.fillStyle='#f47d20';c.fillRect(0,920,1024,104);
  for(const center of [256,768]){
   c.fillStyle='#d62300';c.font='900 108px Arial, sans-serif';c.textAlign='center';
   c.fillText('BURGER',center,460,440);c.fillText('KING',center,572,370);
   c.fillStyle='#f47d20';c.beginPath();c.ellipse(center,348,195,55,0,Math.PI,2*Math.PI);c.fill();
   c.beginPath();c.ellipse(center,613,195,30,0,0,Math.PI);c.fill();
  }
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=2;paper.map=texture;paper.color.set('#ffffff');
 }
 const lid=new T.MeshStandardMaterial({color:'#d7eef2',roughness:.46}),rim=new T.MeshStandardMaterial({color:'#f5faf8',roughness:.72});
 const add=(geo,material,y)=>{const mesh=new T.Mesh(geo,material);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh};
 const body=add(new T.CylinderGeometry(.67,.49,2.9,28),paper,1.48);body.rotation.y=-Math.PI/2;
 add(new T.CylinderGeometry(.506,.506,.045,32),rim,.047);
 add(new T.CylinderGeometry(.705,.705,.075,28),lid,2.945);
 const lip=add(new T.TorusGeometry(.69,.027,6,28),rim,3.02);lip.rotation.x=Math.PI/2;
 template=g;return g.clone(true);
}
