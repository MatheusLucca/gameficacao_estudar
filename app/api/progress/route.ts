import { getChatGPTUser } from '../../chatgpt-auth';
import { env } from 'cloudflare:workers';
import { writeSchema } from '../../../lib/progress-validation';
export const dynamic='force-dynamic';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function GET(){
 const user=await getChatGPTUser();if(!user)return response({error:'Entre na sua conta para recuperar o progresso.'},401);
 try{const row=await env.DB!.prepare('SELECT payload, revision, updated_at FROM study_accounts WHERE user_id = ?').bind(user.userId).first<{payload:string;revision:number;updated_at:string}>();
 return response(row?{state:JSON.parse(row.payload),revision:row.revision,updatedAt:row.updated_at}:{state:null,revision:0});
 }catch{return response({error:'Não foi possível recuperar seu progresso. Tente novamente.'},503)}
}
export async function PUT(request:Request){
 const user=await getChatGPTUser();if(!user)return response({error:'Sua sessão terminou. Entre novamente.'},401);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return response({error:'Origem inválida.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return response({error:'Formato inválido.'},415);
 if(Number(request.headers.get('content-length')||0)>250000)return response({error:'Arquivo muito grande.'},413);
 let parsed;try{const text=await request.text();if(text.length>250000)return response({error:'Arquivo muito grande.'},413);parsed=writeSchema.safeParse(JSON.parse(text))}catch{return response({error:'Dados inválidos.'},400)}
 if(!parsed.success)return response({error:'O progresso enviado tem um formato inválido.'},400);
 const {revision,state}=parsed.data,updatedAt=new Date().toISOString();
 try{let result;
 if(revision===0){result=await env.DB!.prepare('INSERT INTO study_accounts (user_id, payload, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING').bind(user.userId,JSON.stringify(state),updatedAt).run()}
 else{result=await env.DB!.prepare('UPDATE study_accounts SET payload = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ?').bind(JSON.stringify(state),updatedAt,user.userId,revision).run()}
 if(!result.meta.changes)return response({error:'O progresso foi atualizado em outro aparelho. Recarregue para continuar com a versão mais recente.'},409);
 return response({revision:revision+1,updatedAt});
 }catch{return response({error:'Não foi possível salvar online. Sua cópia neste aparelho foi preservada.'},503)}
}
