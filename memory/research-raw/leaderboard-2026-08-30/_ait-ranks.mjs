import fs from 'fs';
const out = process.argv[2];
const items = JSON.parse(fs.readFileSync(out + '/integrations-raw.json','utf8'));
const ait = [];
for (const it of items) {
  for (const s of (it.scores||[])) {
    if (s.intent_id === 'AI_TEXT_DETECTION') {
      ait.push({slug:it.slug,id:it.id,rank:s.rank,score:s.score,epoch:s.epoch_id,endpoint:(it.endpoints||[])[0],yaml:it.yaml_url,mapping:it.signal_mapping,intents:it.supported_intents});
    }
  }
}
ait.sort((a,b)=>a.rank-b.rank);
fs.writeFileSync(out + '/ai-text-ranks.json', JSON.stringify(ait,null,2));
console.log(ait.map(x => 'r' + x.rank + ' ' + x.slug + ' id=' + x.id + ' score=' + x.score).join('\n'));
