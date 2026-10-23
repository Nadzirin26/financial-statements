const prefix='catatan:v1:';
export function read(key,fallback){const raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw);}
export function write(key,value){localStorage.setItem(prefix+key,JSON.stringify(value));}
export function remove(key){localStorage.removeItem(prefix+key);}
export const userKey=(id,kind)=>`user:${id}:${kind}`;
