"""Dress the existing animated Blender rig as The King from the supplied references.
Run after build.py; preserves all seven rig actions and uses only packed materials.
"""
import bpy,bmesh,math,os
from mathutils import Vector
from math import sin,cos,pi
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../..'))
bpy.ops.wm.open_mainfile(filepath=ROOT+'/tools/character/burger-king-runner.blend')
arm=bpy.data.objects['BurgerKing_Rig']
arm.animation_data.action=None
for tr in arm.animation_data.nla_tracks:tr.mute=True
for p in arm.pose.bones:p.rotation_quaternion=(1,0,0,0);p.location=(0,0,0)
bpy.context.scene.frame_set(1)
def color(h):
 c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c)+(1,)
def mat(name,h,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=color(h);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=.38 if metal else .8;return m
red=mat('Royal crimson','BA202B');gold=mat('Crown and gold trim','F2BD39',.45);white=mat('Ivory ermine','FFF1D7');hair=mat('Chestnut beard','623523');ruby=mat('Crown rubies','E33139',.2);black=mat('Ermine spots','302017')
# Remove the employee cap, bag, straps and decals; retain the body and animation.
for ob in list(bpy.data.objects):
 if ob.type!='MESH':continue
 key=ob.data.materials[0].name
 if key in ('bk_cap','dfad48','logo'):
  bpy.data.objects.remove(ob,do_unlink=True);continue
 doomed=[]
 for ve in ob.data.vertices:
  weights={ob.vertex_groups[g.group].name:g.weight for g in ve.groups}
  x,y,z=ve.co
  if weights.get('pack',0)>.5:doomed.append(ve.index)
 if doomed:
  bm=bmesh.new();bm.from_mesh(ob.data);bm.verts.ensure_lookup_table();bmesh.ops.delete(bm,geom=[bm.verts[i] for i in doomed],context='VERTS');bm.to_mesh(ob.data);bm.free()
 if key in ('bk_uniform','bk_trousers','cf2037'):
  ob.data.materials.clear();ob.data.materials.append(red)
 if key in ('fff3df','efdfbd'):
  ob.data.materials.append(gold)
  for p in ob.data.polygons:
   if all(ob.data.vertices[i].co.z<.31 for i in p.vertices):p.material_index=1
# Added costume pieces are skinned to the same skeleton, not separate runtime props.
def bind(ob,name,material,bone):
 ob.name=name;ob.data.materials.clear();ob.data.materials.append(material)
 bpy.context.view_layer.objects.active=ob;ob.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);ob.select_set(False)
 for p in ob.data.polygons:p.use_smooth=True
 vg=ob.vertex_groups.new(name=bone);vg.add(list(range(len(ob.data.vertices))),1,'REPLACE')
 mod=ob.modifiers.new('Royal costume skin','ARMATURE');mod.object=arm;ob.parent=arm
 return ob
def ell(name,c,s,m,bone='head'):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=14,location=c);o=bpy.context.object;o.scale=s;return bind(o,name,m,bone)
def mesh(name,verts,faces,m,bone):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o);return bind(o,name,m,bone)
def tube(name,points,r,m,bone):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=r;cu.bevel_resolution=3;cu.resolution_u=10;s=cu.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
 for b,p in zip(s.bezier_points,points):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');return bind(bpy.context.object,name,m,bone)
# Scalloped gold crown with eight raised jewel tips, visible from the chase camera.
n=96;verts=[]
for inner,zbase in [(False,1.944),(False,None),(True,1.944),(True,None)]:
 for i in range(n):
  a=2*pi*i/n;z=zbase if zbase else 2.045+.14*max(0,cos(a*8))**3
  rx=.206-(.016 if inner else 0);ry=.184-(.016 if inner else 0)
  verts.append((rx*sin(a),-.012+ry*cos(a),z))
faces=[]
for i in range(n):
 j=(i+1)%n;faces.extend([(i,j,n+j,n+i),(2*n+j,2*n+i,3*n+i,3*n+j),(n+i,n+j,3*n+j,3*n+i),(j,i,2*n+i,2*n+j)])
mesh('Eight point royal crown',verts,faces,gold,'head')
for z in (1.95,2.005):tube('Crown rolled rim',[(.208*sin(2*pi*i/32),-.012+.186*cos(2*pi*i/32),z) for i in range(33)],.009,gold,'head')
for i in range(8):
 a=2*pi*i/8;ell('Crown finial',(.206*sin(a),-.012+.184*cos(a),2.184),(.020,.020,.020),gold)
 ell('Ruby jewel',(.211*sin(a),-.012+.190*cos(a),2.046),(.022,.022,.032),ruby)
# Full beard, curled moustache and shoulder-length curls.
ell('Full back hair',(0,-.098,1.803),(.166,.096,.170),hair)
ell('Full tapered beard',(0,.123,1.636),(.145,.091,.145),hair)
for side in (-1,1):
 ell('Sideburn',(side*.147,.054,1.753),(.052,.082,.135),hair)
 for i in range(4):
  ell('Royal hair curl',(side*(.163+.015*sin(i)), -.054-i*.029,1.789-i*.031),(.063,.062,.105),hair)
 tube('Swept moustache',[(side*.007,.202,1.739),(side*.050,.216,1.714),(side*.101,.195,1.731),(side*.12,.178,1.755)],.023,hair,'head')
ell('Smile',(0,.212,1.688),(.044,.010,.012),white)
# Open short royal mantle, pleated behind the runner; hem clears the knees.
verts=[];faces=[];cols=48;rows=12
for j in range(rows):
 t=j/(rows-1);z=1.50-.76*t
 for i in range(cols+1):
  a=.80+(2*pi-1.60)*i/cols;fold=.012*sin(i/cols*pi*12)*t
  verts.append(((.275+.062*t+fold)*sin(a),(.194+.08*t+fold)*cos(a)-.018*t,z+.035*sin(a)**2*t))
for j in range(rows-1):
 for i in range(cols):
  a=j*(cols+1)+i;faces.append((a,a+1,a+cols+2,a+cols+1))
cape=mesh('Pleated royal mantle',verts,faces,red,'spine')
bpy.context.view_layer.objects.active=cape;cape.select_set(True);mo=cape.modifiers.new('Lined mantle','SOLIDIFY');mo.thickness=.014;bpy.ops.object.modifier_apply(modifier=mo.name);cape.select_set(False)
for edge in (0,cols):tube('Mantle gold edging',[verts[j*(cols+1)+edge] for j in range(rows)],.012,gold,'spine')
tube('Mantle gold hem',verts[-(cols+1):],.011,gold,'spine')
# Ermine collar drapes over both shoulders with discrete dark spots.
for side in (-1,1):
 tube('Ermine collar',[(side*.035,.135,1.51),(side*.16,.145,1.48),(side*.264,.032,1.50),(side*.21,-.147,1.51),(0,-.179,1.51)],.055,white,'spine')
 for i in range(4):ell('Ermine marking',(side*(.08+i*.045),.177-i*.018,1.49),(.009,.008,.014),black,'spine')
 # Long red sleeves and gold cuffs.
 ell('Royal sleeve',(side*.279,0,1.067),(.063,.073,.148),red,'fore_'+('L' if side<0 else 'R'))
 ell('Gold cuff',(side*.279,0,.931),(.068,.077,.037),gold,'fore_'+('L' if side<0 else 'R'))
 ell('Tall gold boot',(side*.131,0,.30),(.082,.090,.172),gold,'shin_'+('L' if side<0 else 'R'))
 ell('Boot folded cuff',(side*.131,0,.439),(.090,.097,.047),gold,'shin_'+('L' if side<0 else 'R'))
# Front tunic gold panels, dark belt and a prominent royal medallion.
for side in (-1,1):tube('Tunic gold braid',[(side*.09,.168,1.43),(side*.12,.193,1.25),(side*.12,.193,1.06)],.017,gold,'spine')
tube('Leather royal belt',[(.218*sin(2*pi*i/32),.173*cos(2*pi*i/32),1.025) for i in range(33)],.024,black,'hips')
ell('Belt buckle',(0,.194,1.025),(.043,.015,.034),gold,'hips')
ell('Royal medallion',(0,.225,1.375),(.051,.016,.061),gold,'spine')
ell('Medallion ruby',(0,.241,1.375),(.023,.008,.031),ruby,'spine')
# Consolidate compatible surfaces to a mobile-sized material budget.
groups={}
for o in list(bpy.data.objects):
 if o.type=='MESH':groups.setdefault(tuple(m.name for m in o.data.materials),[]).append(o)
for group in groups.values():
 bpy.ops.object.select_all(action='DESELECT')
 for ob in group:ob.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join()
# Preserve the editable employee source; this file is the mascot authoring asset.
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/tools/character/burger-king-mascot.blend')
bpy.ops.export_scene.gltf(filepath=ROOT+'/public/game/assets/models/burger-king-runner.glb',export_format='GLB',export_yup=True,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_force_sampling=True,export_frame_range=False,export_materials='EXPORT',export_cameras=False,export_lights=False)
print('ROYAL_MASCOT_EXPORTED')
