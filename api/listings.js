// Vercel same-origin proxy. No credentials or private endpoints are exposed.
module.exports=async function handler(req,res){
 if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return res.status(405).end();}
 try{
  const response=await fetch('https://system.amanat-group.af/api/amanat-workspace/catalog',{signal:AbortSignal.timeout(6000)});
  if(!response.ok)throw Error('unavailable');const json=await response.json();
  if(!Array.isArray(json.data)||!json.data.every(p=>typeof p.id==='string'&&p.title&&p.location&&Array.isArray(p.images)))throw Error('invalid');
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=30, stale-while-revalidate=60');
  return req.method==='HEAD'?res.status(200).end():res.status(200).json({data:json.data});
 }catch{res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'Listings are temporarily unavailable.'});}
};
