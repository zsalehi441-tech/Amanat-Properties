import {useEffect,useState} from 'react';
import {Property} from './types';
const key='amanat-public-catalog-v1';
function valid(value:any):value is Property[]{return Array.isArray(value)&&value.every(p=>typeof p?.id==='string'&&p.title&&p.location&&p.features&&Array.isArray(p.images));}
export async function loadCatalog(signal?:AbortSignal):Promise<{data:Property[],stale:boolean}>{
 try{
  const response=await fetch('/api/listings',{signal,cache:'no-store'});if(!response.ok)throw Error('unavailable');const body=await response.json();if(!valid(body.data))throw Error('invalid');
  try{localStorage.setItem(key,JSON.stringify({data:body.data,savedAt:Date.now()}));}catch{}
  return {data:body.data,stale:false};
 }catch(error){
  if(signal?.aborted)throw error;
  try{const cached=JSON.parse(localStorage.getItem(key)||'null');if(valid(cached?.data)&&Date.now()-cached.savedAt<7*86400000)return {data:cached.data,stale:true};}catch{}
  const response=await fetch('/data/listings.json',{signal});if(!response.ok)throw Error('Listings unavailable');const data=await response.json();if(!valid(data))throw Error('Invalid listing data');return {data,stale:true};
 }
}
export function useCatalog(){
 const [state,setState]=useState<{data:Property[],loading:boolean,stale:boolean,error:boolean}>({data:[],loading:true,stale:false,error:false});
 useEffect(()=>{let active=true,controller:AbortController;async function refresh(){controller?.abort();controller=new AbortController();try{const result=await loadCatalog(controller.signal);if(active)setState({...result,loading:false,error:false});}catch(e){if(active&&(e as Error).name!=='AbortError')setState(s=>({...s,loading:false,error:true}));}}
 refresh();const timer=setInterval(refresh,60000);window.addEventListener('online',refresh);return()=>{active=false;controller?.abort();clearInterval(timer);window.removeEventListener('online',refresh);};},[]);return state;
}
