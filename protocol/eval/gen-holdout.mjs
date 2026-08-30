import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const humans = [
  "yeah so i tried the new cafe on 4th — coffee was fine but the wifi kept dropping. waitr said they'd fix it 'soon' lol",
  "My kid's school bus was late AGAIN. 25 mins. I called and got a voicemail maze. Not mad, just tired.",
  "ok quick note: the PR builds on my machine but CI fails on lint? didn't change prettier config... weird",
  "Went hiking sunday. Trail was muddier than expected — almost slipped near the creek. Worth it tho, views were crazy.",
  "honestly idk if we should ship friday. tests pass but the edge case with empty carts still feels sketchy",
  "Forgot my umbrella. Of course. Soaked. Bought a cheap one that broke in like 10 minutes. Classic.",
  "She said 'maybe next week' which usually means never. I'll follow up tuesday anyway.",
  "The lasagna recipe said 45 min. Oven's lying. Took closer to 70 and the cheese still wasn't browned enough.",
  "btw can you grab milk? 2% not skim. Also eggs if they're not expensive this week.",
  "I keep misreading that Slack thread. Are we delaying the launch or just the blog post??",
  "Dog chewed the charger cable. Third time this month. Looking at those bitter sprays — anyone tried them?",
  "rain started mid-run so i cut it short. legs felt heavy anyway. maybe rest day tomorrow.",
  "Not gonna lie the meeting couldve been an email. 40 mins for what was basically status same.",
  "Found a parking ticket under the wiper. Meter says I had 4 mins left?? Fighting it if I can find the receipt.",
  "try restarting? usually fixes my weird bluetooth headphones. if not, forget device and re-pair.",
  "Mom called about thanksgiving. She's thinking earlier this year cuz travel. I said maybe — need to check work.",
  "The API returned 502 for like an hour. Status page still green. Cool cool cool.",
  "painted half the bedroom before running out of primer. hardware store closes at 6. racing the clock rn",
  "Ugh autocorrect changed meet at noon to meat at noon. He replied with a steak emoji. Mortifying.",
  "I've been meaning to organize that drawer for months. Opened it today. Closed it. Tomorrow problem.",
  "game went to OT and then they blew it. couch cushions took the brunt of my feelings",
  "Is the bakery on pine still cash-only? last time they looked at my card like I'd insulted them",
  "slept weird. neck hurts. coffee helps until it doesn't. send help or a heating pad",
  "We argued about dishes again. Petty. Both of us. Making pasta tonight as a peace offering I guess.",
  "That podcast episode dragged. Skipped ahead twice. Hosts kept laughing at their own jokes.",
  "cant find my keys. checked jacket, bowl, fridge (dont ask). they're probably in the laundry again",
  "Neighbor's leaf blower at 7am. I get it, fall exists, but come ON.",
  "Drafted the email three times. Still sounds passive-aggressive. Sending tomorrow after sleep.",
  "the thrift store had a weirdly good jacket. sleeves long but whatever. 12 bucks. win",
  "Forgot today was a holiday until the office lobby was empty. Turned around. Free day? sort of.",
  "Kid asked why the sky is blue mid-drive. Gave a half-wrong answer. Google later. Honesty later.",
  "This password reset loop is evil. Code expired, new code, expire, rage.",
  "made chili too spicy. added yogurt. now it's weird spicy soup. edible though",
  "Saw an old coworker at the store. Did the awkward half-wave. Neither of us stopped. Fine by me.",
  "Playlist shuffled onto that one song and now I'm in my feelings on a tuesday. unfair.",
  "The printer jammed again. IT says clear the path. There is no path. Only sadness and toner.",
  "might cancel plans. energy at like 20%. they'll understand... hopefully",
  "Bought plants. Named none of them. Two already crispy. Learning curve is steep.",
  "Train delayed due to earlier delay. Thanks, very informative.",
  "I told myself one episode. Three hours later. Sleep is a social construct apparently.",
];

const ais = [
  "In today's rapidly evolving digital landscape, it is important to note that organizations must leverage robust frameworks to optimize outcomes across multifaceted domains.\n\n- Enhance visibility\n- Streamline workflows\n- Facilitate collaboration\n\nUltimately, a holistic approach yields sustainable value.",
  "Furthermore, stakeholders should consider comprehensive strategies that delve into the tapestry of modern innovation. Moreover, cutting-edge solutions can enhance operational excellence.\n\n1. Assess current baselines\n2. Implement best practices\n3. Measure key results\n\nIn conclusion, continuous improvement remains essential.",
  "It is essential to recognize that effective communication underpins successful initiatives. Additionally, teams should utilize scalable architectures to facilitate growth.\n\n- Prioritize clarity\n- Optimize resource allocation\n- Maintain alignment\n\nOverall, these principles support long-term resilience.",
  "A state-of-the-art methodology enables organizations to navigate complexity with confidence. Notably, synergy across departments amplifies impact.\n\n1. Define objectives\n2. Execute iteratively\n3. Review outcomes\n\nUltimately, disciplined execution drives meaningful progress.",
  "Moreover, leaders must foster an environment that encourages innovation while maintaining rigorous standards. It is important to note that transparency builds trust.\n\n- Establish clear metrics\n- Communicate frequently\n- Iterate thoughtfully\n\nIn conclusion, balanced governance is foundational.",
  "In the broader landscape of technological advancement, enterprises should leverage data-driven insights. Furthermore, robust analytics facilitate informed decision-making.\n\n1. Collect relevant signals\n2. Validate assumptions\n3. Act with precision\n\nOverall, evidence-based practice remains paramount.",
  "Additionally, a comprehensive roadmap helps teams align on priorities. Essentially, clarity reduces friction and unlocks productivity.\n\n- Map dependencies\n- Sequence deliverables\n- Monitor risk\n\nUltimately, structured planning supports reliable delivery.",
  "It is worth emphasizing that customer-centric design enhances engagement. Moreover, iterative feedback loops optimize the user experience.\n\n1. Research needs\n2. Prototype rapidly\n3. Refine continuously\n\nIn conclusion, empathy and rigor must coexist.",
  "Furthermore, scalable infrastructure underpins modern digital products. Notably, cloud-native patterns facilitate resilience and elasticity.\n\n- Automate provisioning\n- Observe system health\n- Respond to incidents\n\nOverall, operational excellence is non-negotiable.",
  "In today's competitive environment, organizations should streamline processes to unlock efficiency. Additionally, cross-functional collaboration enhances outcomes.\n\n1. Identify bottlenecks\n2. Remove waste\n3. Standardize workflows\n\nUltimately, continuous improvement compounds advantages.",
  "It is important to note that ethical considerations must guide AI adoption. Moreover, transparent governance frameworks build stakeholder confidence.\n\n- Document model limits\n- Audit for bias\n- Provide recourse\n\nIn conclusion, responsible innovation sustains trust.",
  "Additionally, knowledge sharing accelerates organizational learning. Fundamentally, documented practices reduce repeated mistakes.\n\n1. Capture decisions\n2. Publish playbooks\n3. Review retrospectively\n\nOverall, institutional memory is a strategic asset.",
  "Moreover, proactive risk management mitigates downstream disruption. Essentially, early detection enables calibrated responses.\n\n- Surface weak signals\n- Rank by impact\n- Assign ownership\n\nUltimately, preparedness preserves optionality.",
  "In the evolving landscape of remote collaboration, teams should utilize asynchronous communication thoughtfully. Furthermore, clear written updates enhance alignment.\n\n1. Set expectations\n2. Summarize decisions\n3. Track action items\n\nIn conclusion, deliberate habits improve distributed work.",
  "Notably, high-quality documentation reduces onboarding friction. Additionally, consistent naming conventions facilitate maintainability.\n\n- Write for the next reader\n- Prefer examples\n- Keep docs current\n\nOverall, clarity compounds over time.",
  "Furthermore, performance optimization should be guided by measurement. It is important to note that premature tuning often wastes effort.\n\n1. Establish baselines\n2. Profile hotspots\n3. Validate improvements\n\nUltimately, evidence should drive change.",
  "Additionally, inclusive design expands accessibility and reach. Moreover, diverse perspectives strengthen product decisions.\n\n- Test with real users\n- Remove barriers\n- Iterate on feedback\n\nIn conclusion, inclusion is both ethical and strategic.",
  "In today's interconnected systems, security must be treated as a first-class concern. Furthermore, defense-in-depth reduces residual risk.\n\n1. Least privilege\n2. Continuous monitoring\n3. Incident readiness\n\nOverall, hardening lowers but never eliminates risk.",
  "Moreover, thoughtful API design improves developer experience. Essentially, predictable interfaces reduce integration cost.\n\n- Stable contracts\n- Explicit errors\n- Version carefully\n\nUltimately, empathy for consumers pays dividends.",
  "It is essential to recognize that culture shapes delivery more than tools alone. Additionally, psychological safety enables candid problem-solving.\n\n1. Model curiosity\n2. Reward learning\n3. Address conflict early\n\nIn conclusion, healthy teams ship sustainably.",
  "Furthermore, capacity planning prevents chronic overload. Notably, invisible work still consumes attention.\n\n- Make WIP visible\n- Protect focus time\n- Renegotiate scope\n\nOverall, sustainable pace preserves quality.",
  "Additionally, experiment design should isolate variables carefully. It is important to note that confounded tests mislead stakeholders.\n\n1. State hypotheses\n2. Choose metrics\n3. Interpret cautiously\n\nUltimately, rigor protects decision quality.",
  "In the broader context of digital transformation, incremental delivery reduces risk. Moreover, feedback accelerates learning cycles.\n\n- Ship thin slices\n- Measure adoption\n- Adjust course\n\nIn conclusion, momentum beats perfectionism.",
  "Notably, observability turns unknowns into actionable signals. Furthermore, correlated traces shorten mean time to recovery.\n\n1. Instrument critically\n2. Alert on symptoms\n3. Review noise regularly\n\nOverall, signal quality matters more than volume.",
  "Moreover, vendor selection should weigh lock-in explicitly. Essentially, exit costs are part of total cost of ownership.\n\n- Prefer open formats\n- Document dependencies\n- Rehearse migration\n\nUltimately, optionality is a form of resilience.",
  "Additionally, clear ownership boundaries reduce coordination tax. It is important to note that shared-everything models often stall.\n\n1. Define interfaces\n2. Assign stewards\n3. Review coupling\n\nIn conclusion, modularity enables parallel progress.",
  "Furthermore, training investments compound when practice is deliberate. Notably, one-off workshops rarely change behavior alone.\n\n- Pair on real work\n- Review artifacts\n- Reinforce habits\n\nOverall, learning systems outperform events.",
  "In today's information-rich environments, prioritization is a core skill. Moreover, saying no protects strategic focus.\n\n1. Rank by impact\n2. Timebox exploration\n3. Revisit quarterly\n\nUltimately, focus is a competitive advantage.",
  "Additionally, post-incident reviews should seek systemic fixes. Essentially, blame-centric narratives suppress reporting.\n\n- Timeline facts\n- Identify contributing factors\n- Assign follow-ups\n\nIn conclusion, learning cultures reduce recurrence.",
  "Moreover, data quality underpins trustworthy analytics. It is important to note that silent schema drift corrupts dashboards.\n\n1. Validate inputs\n2. Monitor freshness\n3. Publish definitions\n\nOverall, governance enables confident decisions.",
  "Furthermore, thoughtful onboarding shortens time-to-productivity. Notably, checklists beat tribal knowledge transfers.\n\n- Environment setup\n- First meaningful task\n- Buddy support\n\nUltimately, structured welcome improves retention.",
  "Additionally, product discovery should precede large builds. Essentially, assumptions untested become expensive surprises.\n\n1. Interview users\n2. Prototype cheaply\n3. Kill weak ideas early\n\nIn conclusion, learning early is cheaper than rebuilding late.",
  "In the landscape of platform engineering, self-service reduces tickets and delays. Moreover, paved roads encode best practices.\n\n- Golden paths\n- Guardrails by default\n- Escape hatches documented\n\nOverall, leverage multiplies team throughput.",
  "Notably, financial controls should match organizational scale. Furthermore, lightweight processes beat heavy bureaucracy for early teams.\n\n1. Transparent budgets\n2. Clear approval thresholds\n3. Regular reconciliation\n\nUltimately, trust and verification can coexist.",
  "Moreover, content strategies benefit from consistent voice guidelines. It is important to note that uneven tone erodes brand recognition.\n\n- Define principles\n- Provide examples\n- Review samples\n\nIn conclusion, coherence strengthens credibility.",
  "Additionally, release trains create predictable delivery cadence. Essentially, batching reduces coordination overhead.\n\n1. Freeze windows\n2. Shared checklists\n3. Rollback drills\n\nOverall, rhythm improves operational calm.",
  "Furthermore, stakeholder updates should emphasize outcomes over activity. Notably, vanity metrics obscure true progress.\n\n- Tie work to goals\n- Surface risks early\n- Request decisions clearly\n\nUltimately, crisp communication accelerates alignment.",
  "In today's hybrid workplaces, intentional rituals replace accidental hallway sync. Moreover, documented decisions travel better than verbal ones.\n\n1. Weekly priorities\n2. Written ADRs\n3. Open office hours\n\nIn conclusion, design the collaboration you need.",
  "Additionally, capacity for exploratory work should be protected explicitly. Essentially, all roadmap and no slack yields brittle systems.\n\n- Budget innovation time\n- Share learnings\n- Retire dead ends\n\nOverall, exploration fuels durable advantage.",
  "Moreover, customer support insights are a product input, not only a cost center. It is important to note that repeated tickets signal design debt.\n\n1. Tag themes\n2. Quantify frequency\n3. Feed backlog\n\nUltimately, listening loops improve the core experience.",
];

const items = [];
for (let i = 0; i < humans.length; i++) {
  items.push({
    id: `h-${String(i + 1).padStart(3, "0")}`,
    text: humans[i],
    label: 0,
    source: "synthetic-ci",
    partition: i < 32 ? "holdout" : "train_cal",
  });
}
for (let i = 0; i < ais.length; i++) {
  items.push({
    id: `a-${String(i + 1).padStart(3, "0")}`,
    text: ais[i],
    label: 1,
    source: "synthetic-ci",
    partition: i < 32 ? "holdout" : "train_cal",
  });
}

const out = join(dirname(fileURLToPath(import.meta.url)), "holdout.fixture.json");
writeFileSync(out, JSON.stringify(items, null, 2) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
