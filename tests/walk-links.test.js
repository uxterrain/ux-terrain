"use strict";
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
function load(file,key){const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),scope);return scope.window[key];}
const oslo=load('js/walks.js','UX_WALKS');
const eda=load('js/eda-walks.js','EDA_WALKS');
const pages=['work/zone-focus.html','work/armada.html','work/performance-monitoring.html','work/sbi.html','work/iqvia.html','work/oslo.html','work/eda.html','systems.html'];
for(const page of pages){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 for(const match of html.matchAll(/<p class="case-walks[^\"]*">([\s\S]*?)<\/p>/g)){
  for(const link of match[1].matchAll(/href="(?:\.\.\/)?walk\.html(?:#([^\"]+))?"[^>]*>([^<]+)/g)){
   if(link[1]){const id=link[1].split('/')[0];assert.ok(Object.hasOwn(oslo,id),page);assert.equal(oslo[id].readUrl,page,'case-specific CTA must open its own walk');}
   else {assert.equal(page,'work/oslo.html','generic Oslo picker is a product demonstration, not a case walkthrough');assert.match(link[2],/Explore/);}
  }
 }
 const button=html.match(/<button[^>]*id="eda-open"[^>]*>/);
 if(button && !button[0].includes('hidden')){
  const id=(button[0].match(/data-eda-walk="([^\"]+)"/)||[])[1]||'m365';
  assert.ok(Object.hasOwn(eda,id),page);assert.equal(eda[id].readUrl,page,'Eda entry must match the current case');
 }
}
assert.ok(!Object.values(oslo).some(walk=>walk.readUrl==='work/zone-focus.html'));
console.log('PASS walkthrough CTAs match authored routes; FloTrak has Eda only, with no misleading Oslo walkthrough link.');

const landing=fs.readFileSync(path.join(root,'walk.html'),'utf8');
const edaCards=[...landing.matchAll(/<a class="walk-choice" href="eda\.html#([^"#]+)">([\s\S]*?)<\/a>/g)];
assert.equal(edaCards.length,Object.keys(eda).length,'shared landing must expose every authored Eda walk');
assert.equal(new Set(edaCards.map(card=>card[1])).size,edaCards.length);
for(const [,id,content] of edaCards){
 assert.ok(Object.hasOwn(eda,id),'landing route must exist');
 assert.ok(content.includes(eda[id].title),'landing title must identify the authored walk');
 assert.ok(content.includes(eda[id].stations.length+' stops'),'station count must match the route');
}
for(const id of Object.keys(oslo)) assert.ok(landing.includes('data-walk="'+id+'"'),'existing Oslo route remains available');
console.log('PASS shared Walk landing: distinct guide groups and all eight authored Eda routes with accurate titles and station counts.');
