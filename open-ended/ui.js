export const $ = selector => document.querySelector(selector);
export function el(tag,props={},children=[]){
  const node=document.createElement(tag);
  for(const [key,value] of Object.entries(props)){
    if(key==='text')node.textContent=value;
    else if(key==='class')node.className=value;
    else if(key.startsWith('on'))node.addEventListener(key.slice(2),value);
    else if(key in node&&!key.startsWith('aria'))node[key]=value;
    else node.setAttribute(key,value);
  }
  node.append(...children);return node;
}
export const button=(text,action,className='')=>el('button',{text,onclick:action,class:className,type:'button'});
export function download(blob,name){const url=URL.createObjectURL(blob),a=el('a',{href:url,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
