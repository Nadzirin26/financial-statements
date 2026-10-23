export async function persistenceStatus(){
  if(!navigator.storage?.persisted)return 'unsupported';
  try{return await navigator.storage.persisted()?'granted':'prompt';}catch{return 'unsupported';}
}
export async function requestPersistence(){
  if(!navigator.storage?.persist)return 'unsupported';
  try{return await navigator.storage.persist()?'granted':'denied';}catch{return 'denied';}
}
