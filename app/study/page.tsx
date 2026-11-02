import { requireChatGPTUser } from '../chatgpt-auth';
import StudyClient from './study-client';
export const dynamic = 'force-dynamic';
export default async function Study() {
 const user = await requireChatGPTUser('/study');
 return <StudyClient user={{id:user.userId,name:user.displayName,email:user.email}}/>;
}
