/** Best-effort browser persistence for the local-only investor demo. */
export function writeBrowserValue(key:string,value:string):boolean{
 try{localStorage.setItem(key,value);return true}catch{return false}
}

export function removeBrowserValues(keys:string[]):boolean{
 try{for(const key of keys)localStorage.removeItem(key);return true}catch{return false}
}
