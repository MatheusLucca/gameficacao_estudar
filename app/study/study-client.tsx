'use client';
import { useEffect } from 'react';
export default function StudyClient({user}:{user:{id:string;name:string;email:string}}) {
 useEffect(()=>{
  const runtime=window as Window & {__passoLoaded?:boolean};
  if(runtime.__passoLoaded)return;
  runtime.__passoLoaded=true;
  async function load(){
   for(const src of ['/passo-data.js','/lesson-content.js','/reader-ui.js','/passo-app.js']){
    await new Promise<void>((ok,fail)=>{const script=document.createElement('script');script.src=src;script.onload=()=>ok();script.onerror=()=>fail(new Error('Falha ao carregar.'));document.body.appendChild(script)});
   }
  }
  load().catch(()=>{const node=document.getElementById('app');if(node)node.innerHTML='<div class="empty"><h2>Não foi possível carregar.</h2><p>Confira sua conexão e recarregue esta página.</p><a href="/study">Tentar novamente</a></div>'});
 },[]);
 return <><div id="account" data-id={user.id} data-name={user.name} data-email={user.email} hidden/><div id="app"><div className="empty"><h2>Preparando seus próximos passos…</h2><p>Buscando seu progresso salvo.</p></div></div><div id="modal"/><div id="toast" role="status"/></>;
}
