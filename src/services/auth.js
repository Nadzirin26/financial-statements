import {read,write,remove} from './storage';
import {seedUsers} from '../data/seedUsers';
export async function hash(password,salt){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+password));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export async function passwordRecord(password){const salt=crypto.randomUUID();return {salt,hash:await hash(password,salt)};}
export async function initialize(){if(read('users',null)===null){const users=await Promise.all(seedUsers.map(async({password,...u})=>({...u,...await passwordRecord(password)})));write('users',users);}}
export const users=()=>read('users',[]);
export async function login(username,password){const u=users().find(x=>x.username===username);if(!u||u.hash!==await hash(password,u.salt))throw Error('Username atau kata sandi salah.');write('session',{id:u.id});return u;}
export const session=()=>users().find(x=>x.id===read('session',{})?.id)||null;
export const logout=()=>remove('session');
export async function addUser(name,username,password){if(users().some(x=>x.username.toLowerCase()===username.toLowerCase()))throw Error('Username sudah digunakan.');write('users',[...users(),{id:crypto.randomUUID(),name,username,role:'user',...await passwordRecord(password)}]);}
export async function resetPassword(id,password){const record=await passwordRecord(password);write('users',users().map(x=>x.id===id?{...x,...record}:x));}
export function deleteUser(id){if(users().find(x=>x.id===id)?.role==='admin')throw Error('Akun admin tidak dapat dihapus.');write('users',users().filter(x=>x.id!==id));for(const kind of ['transactions','settings'])remove(`user:${id}:${kind}`);}
