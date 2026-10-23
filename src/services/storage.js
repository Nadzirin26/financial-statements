const prefix='catatan:v1:';
export function read(key,fallback){const raw=localStorage.getItem(prefix+key);if(raw===null)return fallback;try{return JSON.parse(raw);}catch{throw Error('Data lokal tidak dapat dibaca. Data asli tetap disimpan; jangan bersihkan data situs. Pulihkan dari backup JSON atau hubungi pengelola.');}}
export function write(key,value){localStorage.setItem(prefix+key,JSON.stringify(value));}
export function remove(key){localStorage.removeItem(prefix+key);}
export const userKey=(id,kind)=>`user:${id}:${kind}`;
export const isAppStorageKey=key=>key===null||key.startsWith(prefix);
