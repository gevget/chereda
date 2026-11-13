/** Best-effort browser persistence for the local-only investor demo. */
const volatileValues=new Map<string,string|null>();

export function readBrowserValue(key:string):string|null{
 if(volatileValues.has(key))return volatileValues.get(key)??null;
 try{return localStorage.getItem(key)}catch{return null}
}

export function writeBrowserValue(key:string,value:string):boolean{
 try{localStorage.setItem(key,value);volatileValues.delete(key);return true}catch{volatileValues.set(key,value);return false}
}

export function removeBrowserValues(keys:string[]):boolean{
 let removed=true;
 for(const key of keys){
  try{localStorage.removeItem(key);volatileValues.delete(key)}catch{volatileValues.set(key,null);removed=false}
 }
 return removed
}
