"use strict";
// Explicit opt-in: this calls the configured model through the running local app.
const fs = require('node:fs');
const path = require('node:path');
const suites = require('../tests/fixtures/agent-quality.json');
if (!process.argv.includes('--live')) {
  console.error('Start the local app, then run: node scripts/check-agent-quality.js --live --output=/tmp/agent-quality.json');
  process.exit(1);
}
const output = (process.argv.find(a=>a.startsWith('--output=')) || '--output=/tmp/agent-quality.json').slice(9);
const results=[];
async function run(suite) {
  const history=[];
  for (const question of suite.questions) {
    const start=Date.now();
    try {
      const response = await fetch('http://127.0.0.1:3000/api/chat', {
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({agent:suite.agent,context:suite.context,message:question,history,responseFormat:suite.agent==='oslo'?'grounded-v1':undefined}),
        signal:AbortSignal.timeout(90000)
      });
      const raw=await response.text();
      const answer=suite.agent==='oslo' && response.ok?JSON.parse(raw):raw;
      const text=typeof answer==='string'?answer:answer.claims.map(c=>c.text).join('\n');
      const linksValid=typeof answer==='string'?null:answer.claims.every(c=>c.evidence.every(e=>{
        const [file,anchor]=e.url.split('#');
        const local=path.join(__dirname,'..',file);
        return fs.existsSync(local) && fs.readFileSync(local,'utf8').includes('id="'+anchor+'"');
      }));
      results.push({agent:suite.agent,context:suite.context,question,status:response.status,ms:Date.now()-start,words:text.split(/\s+/).length,linksValid,answer});
      if(response.ok)history.push({role:'user',content:question},{role:'assistant',content:text});
      console.log(suite.agent,suite.context.projectId||suite.context.walkId,response.status);
    } catch(error) {
      results.push({agent:suite.agent,context:suite.context,question,error:error.message});
    }
  }
}
(async()=>{
 for(let i=0;i<suites.length;i+=3)await Promise.all(suites.slice(i,i+3).map(run));
 fs.writeFileSync(output,JSON.stringify({note:'Live answer samples; factual quality requires reading against the authored evidence. HTTP success and valid links are not semantic accuracy scores.',results},null,2)+'\n');
 console.log('Saved',results.length,'answer samples to',output);
 if(results.some(r=>r.error || r.status!==200 || r.linksValid===false))process.exitCode=1;
})();
