"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Node {
 constructor(tag='', text='') { this.tag=tag;this.children=[];this.value=text; }
 append(...nodes) { this.children.push(...nodes); }
 appendChild(node) { this.children.push(node);return node; }
 replaceChildren(...nodes) { this.children=nodes;this.value=''; }
 setAttribute(key,value) { this[key]=value; }
 set textContent(text) { this.value=text;this.children=[]; }
 get textContent() { return this.value+this.children.map(c=>c.textContent).join(''); }
}
const requests=[];let mode='oslo';let fail=false;
const document={createElement:tag=>new Node(tag),createTextNode:text=>new Node('',text)};
const source={id:'sbi:3',title:'What I owned',url:'/work/sbi.html#oslo-evidence-3'};
const window={};
const fetch=async (_,options)=>{
 const body=JSON.parse(options.body);requests.push(body);
 if(fail){fail=false;return {ok:false,json:async()=>({error:'Temporary failure'})};}
 if(mode==='oslo')return {ok:true,json:async()=>({claims:[{kind:'documented',text:'The designer organized the dashboard.',evidence:[source,source]},{kind:'gap',text:'No measured result is supplied.',evidence:[]}]})};
 const chunks=['A selected condition ', 'changes the supporting inputs.'];
 return {ok:true,body:{getReader:()=>({read:async()=>chunks.length?{value:new TextEncoder().encode(chunks.shift()),done:false}:{done:true},cancel:async()=>{}})}};
};
const code=fs.readFileSync(require.resolve('../js/app.js'),'utf8');
vm.runInNewContext(code.slice(0,code.indexOf('  const THEME_KEY'))+'})();',{window,document,fetch,TextDecoder,Map});
async function run(){
 const body=new Node();
 await window.UX_OSLO.answer('Who designed it?',body,{projectId:'sbi'});
 assert.ok(!body.textContent.includes('From the case study'));
 assert.ok(!body.textContent.includes('Not documented.'));
 const links=body.children.at(-1).children;
 assert.equal(links.length,1,'duplicate references should render once');
 assert.equal(links[0].textContent,'What I owned');
 await window.UX_OSLO.answer('What did that change?',body,{projectId:'sbi'});
 assert.equal(requests.at(-1).history.length,2);
 await window.UX_OSLO.answer('What about FloTrak?',body,{projectId:'zone-focus'});
 assert.equal(requests.at(-1).history.length,0,'projects must not share memory');
 mode='eda';const context={walkId:'sbi',stationIndex:2};
 await window.UX_EDA.answer('What changes?',body,context);
 await window.UX_EDA.answer('How would you test that?',body,context);
 assert.equal(requests.at(-1).history.length,2);
 assert.equal(requests.at(-1).history[1].content,'A selected condition changes the supporting inputs.');
 await window.UX_EDA.answer('A different screen',body,{walkId:'sbi',stationIndex:3});
 assert.equal(requests.at(-1).history.length,0,'stations must not share memory');
 window.UX_EDA.reset(context);
 fail=true;
 await assert.rejects(window.UX_EDA.answer('A failed question',body,context),/Temporary failure/);
 await window.UX_EDA.answer('Retry',body,context);
 assert.equal(requests.at(-1).history.length,0,'failed turns must not pollute memory');
 for(let i=0;i<5;i++)await window.UX_EDA.answer('Follow-up '+i,body,context);
 assert.equal(requests.at(-1).history.length,6,'history must remain bounded');
 const controller=new AbortController();controller.abort();window.UX_EDA.reset(context);
 await window.UX_EDA.answer('Canceled',body,context,controller.signal);
 await window.UX_EDA.answer('After cancellation',body,context);
 assert.equal(requests.at(-1).history.length,0,'canceled turns must not enter history');
 console.log('PASS guide UI: concise labels, deduplicated references, follow-up memory, project/station isolation, resets, failed/canceled turns, and history bounds.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
