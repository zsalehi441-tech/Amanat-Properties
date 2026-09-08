(() => {
 const canvas=document.querySelector('#architecture'); if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width=0,height=0,scale=1,frame=0,last=0,visible=true,dragging=false,startX=0,lastX=0;
 let angle=-.63,targetAngle=-.63,pitch=.46,targetPitch=.46,blueprint=false;
 const reduced=()=>document.documentElement.classList.contains('reduce-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const faces=[];
 const colors={roof:'#d9d7bb',front:'#a7b498',side:'#708c70',dark:'#2c5143',glass:'#365d4c',trim:'#c2c8a8'};
 function face(points,color,line='#d8dfbd33'){faces.push({points,color,line});}
 function box(x,y,z,w,h,d,c=colors){
  face([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],c.front);
  face([[x+w,y,z+d],[x,y,z+d],[x,y+h,z+d],[x+w,y+h,z+d]],c.side);
  face([[x,y,z+d],[x,y,z],[x,y+h,z],[x,y+h,z+d]],c.side);
  face([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],c.front);
  face([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],c.roof);
 }
 // A conceptual architectural model, not a representation of an Amanat-owned property.
 box(-112,-8,-86,224,8,172,{front:'#697e62',side:'#415c47',roof:'#5e785755'});
 box(-94,0,-58,71,86,80);box(-22,0,-45,102,135,69);box(19,0,24,64,48,43);
 for(let y=17;y<128;y+=25){
  for(let x=-13;x<75;x+=19) box(x,y,24.3,12,17,.8,{front:colors.glass,side:colors.dark,roof:colors.dark});
  for(let z=-36;z<17;z+=19)box(80.3,y,z,.8,17,12,{front:colors.dark,side:colors.glass,roof:colors.dark});
  box(-26,y-3,-49,110,3,77,{front:colors.trim,side:'#8c9f7e',roof:colors.roof});
 }
 for(let y=16;y<80;y+=23){for(let x=-87;x<-29;x+=19)box(x,y,22.3,11,15,.8,{front:colors.glass,side:colors.dark,roof:colors.dark});box(-98,y-3,-62,79,3,88);}
 box(-27,135,-50,112,5,79);box(-99,86,-63,81,4,90);box(15,48,21,73,4,50);
 for(let x=24;x<78;x+=12)box(x,5,67.3,8,37,.8,{front:colors.glass,side:colors.dark,roof:colors.dark});
 for(let i=0;i<3;i++)box(12-i*5,0,71+i*5,82+i*10,6-i*2,5,{front:'#9ea58a',side:'#718565',roof:'#b8bea0'});
 // Courtyard paving and slender architectural trees.
 for(let x=-80;x<-5;x+=18)box(x,.2,44,12,.5,27,{front:'#adbd96',side:'#adbd96',roof:'#a6b78b'});
 for(const [x,z] of [[-101,45],[-92,70],[102,-65],[102,34]]){
  box(x,0,z,2,20,2,{front:'#a8a785',side:'#738369',roof:'#a8a785'});
  box(x-4,15,z-4,11,16,11,{front:'#859d68',side:'#566f49',roof:'#a4b382'});
 }
 function transform([x,y,z]){const xx=x*Math.cos(angle)-z*Math.sin(angle),zz=x*Math.sin(angle)+z*Math.cos(angle);return [width*.51+xx*scale,height*.58+(-y*Math.cos(pitch)+zz*Math.sin(pitch))*scale,zz*Math.cos(pitch)+y*Math.sin(pitch)];}
 function draw(){
  ctx.clearRect(0,0,width,height);
  const glow=ctx.createRadialGradient(width*.55,height*.42,0,width*.55,height*.42,width*.5);glow.addColorStop(0,'#a5b17d12');glow.addColorStop(1,'#a5b17d00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  ctx.strokeStyle='#9bac7619';ctx.lineWidth=.65;
  for(let i=-140;i<=140;i+=28){for(const line of [[[i,-10,-115],[i,-10,115]],[[-140,-10,i],[140,-10,i]]]){ctx.beginPath();line.forEach((p,j)=>{const q=transform(p);j?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();}}
  const projected=faces.map(f=>({...f,p:f.points.map(transform)})).sort((a,b)=>a.p.reduce((s,p)=>s+p[2],0)/a.p.length-b.p.reduce((s,p)=>s+p[2],0)/b.p.length);
  for(const f of projected){ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=blueprint?'#15392d24':f.color;ctx.fill();ctx.strokeStyle=blueprint?'#d8c38960':f.line;ctx.lineWidth=blueprint?.55:.65;ctx.stroke();}
  ctx.setLineDash([3,5]);ctx.strokeStyle='#b9ca933a';ctx.lineWidth=.6;
  for(const line of [[[-112,-8,105],[112,-8,105]],[[125,0,-45],[125,140,-45]]]){ctx.beginPath();line.forEach((p,i)=>{const q=transform(p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();}ctx.setLineDash([]);
 }
 function animate(now){frame=0;if(!visible||document.hidden)return;const dt=Math.min((now-last)/16.67||1,3);last=now;const ease=reduced()?1:1-Math.pow(.9,dt);angle+=(targetAngle-angle)*ease;pitch+=(targetPitch-pitch)*ease;draw();if(Math.abs(targetAngle-angle)>.0005||Math.abs(targetPitch-pitch)>.0005)frame=requestAnimationFrame(animate);}
 function render(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(animate);}
 function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);scale=Math.min(width/310,height/310)*.88;render();}
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(canvas);
 canvas.addEventListener('pointerdown',e=>{dragging=true;startX=lastX=e.clientX;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetAngle+=(e.clientX-lastX)*.007;lastX=e.clientX;render();});
 canvas.addEventListener('pointerup',()=>{dragging=false;});canvas.addEventListener('pointercancel',()=>{dragging=false;});
 document.querySelectorAll('.scene-view').forEach(button=>button.addEventListener('click',()=>{blueprint=button.dataset.view==='plan';targetPitch=blueprint?1.05:.46;targetAngle=blueprint?-.2:-.63;document.querySelectorAll('.scene-view').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();}));
 document.querySelector('.scene-reset')?.addEventListener('click',()=>{targetAngle=blueprint?-.2:-.63;render();});
 document.querySelectorAll('[data-rotate]').forEach(b=>b.addEventListener('click',()=>{targetAngle+=Number(b.dataset.rotate)*.35;render();}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else render();});
 document.addEventListener('amanat-motion-change',render);
 resize();
})();
