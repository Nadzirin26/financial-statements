import {read,write,remove} from './storage.js';
import {seedUsers} from '../data/seedUsers.js';
export async function hash(password,salt){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+password));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export async function passwordRecord(password){const salt=crypto.randomUUID();return {salt,hash:await hash(password,salt)};}
export async function initialize(){
  if(read('users',null)===null){
    const initial=await Promise.all(seedUsers.map(async({password,...u})=>({...u,...await passwordRecord(password)})));
    if(read('users',null)===null)write('users',initial);
  }
  // Tambahkan akun baru sekali ke browser lama, tanpa mereset akun atau catatan.
  // Penanda tetap ada jika admin menghapus akun testing secara sengaja.
  const migration='migration:testing-user-v1';
  if(!read(migration,false)){
    const {password,...seed}=seedUsers.find(x=>x.id==='testing');
    const record={...seed,...await passwordRecord(password)};
    const current=users();
    if(!current.some(x=>x.id===seed.id||x.username.toLowerCase()===seed.username))write('users',[...current,record]);
    write(migration,true);
  }
}
export const users=()=>read('users',[]);
export async function login(username,password){const u=users().find(x=>x.username===username);if(!u||u.hash!==await hash(password,u.salt))throw Error('Username atau kata sandi salah.');write('session',{id:u.id});return u;}
export const session=()=>users().find(x=>x.id===read('session',{})?.id)||null;
export const logout=()=>remove('session');
export async function addUser(name,username,password){if(users().some(x=>x.username.toLowerCase()===username.toLowerCase()))throw Error('Username sudah digunakan.');write('users',[...users(),{id:crypto.randomUUID(),name,username,role:'user',...await passwordRecord(password)}]);}
export async function resetPassword(id,password){const record=await passwordRecord(password);write('users',users().map(x=>x.id===id?{...x,...record}:x));}
export async function changePassword(id,currentPassword,newPassword){const u=users().find(x=>x.id===id);if(!u||u.hash!==await hash(currentPassword,u.salt))throw Error('Kata sandi saat ini tidak sesuai.');if(newPassword.length<8)throw Error('Kata sandi baru minimal 8 karakter.');await resetPassword(id,newPassword);}
export function deleteUser(id){if(users().find(x=>x.id===id)?.role==='admin')throw Error('Akun admin tidak dapat dihapus.');write('users',users().filter(x=>x.id!==id));for(const kind of ['profile','transactions','settings'])remove(`user:${id}:${kind}`);}
