const fs = require('fs');
const path = require('path');
const out = process.argv[2];
let raw = fs.readFileSync(path.join(out,'integrations-raw.json'));
if (raw[0]===0xEF && raw[1]===0xBB && raw[2]===0xBF) raw = raw.subarray(3);
const items = JSON.parse(raw.toString('utf8'));
const needles = ['livecert','veritarach','faceplus','bittensor-sn34','preflight-ssl','sarzops','tavily','caliber','itsai'];
const hits = items.filter(it => {
  const blob = JSON.stringify(it).toLowerCase();
  return needles.some(n => blob.includes(n.toLowerCase()));
});
const slim = hits.map(it => ({
  id: it.id, slug: it.slug, kind: it.kind, protocol: it.protocol, name: it.name,
  yaml_url: it.yaml_url, base_url: it.base_url,
  supported_intents: it.supported_intents, endpoints: it.endpoints,
  activation_status: it.activation_status, scored: it.scored,
  last_scored_at: it.last_scored_at, scores: it.scores,
  docs: it.docs, signal_mapping: it.signal_mapping,
  min_price_usdc: it.min_price_usdc,
  has_input_schema: !!it.input_schema, has_output_schema: !!it.output_schema,
  limitations: it.limitations
}));
fs.writeFileSync(path.join(out,'peer-integrations.json'), JSON.stringify(slim,null,2));
console.log('hits', slim.length);
for (const s of slim) {
  const intents = (s.supported_intents||[]).join('|');
  const rank = (s.scores||[]).map(x => x.intent_id+':r'+x.rank).join(',');
  console.log([s.id,s.slug,s.activation_status,String(s.scored),intents,rank,s.yaml_url].join('\t'));
}
