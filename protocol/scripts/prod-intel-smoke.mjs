const urls = [
  "https://caliber-teamtitanlink.vercel.app",
  "https://caliber-smoky.vercel.app",
];

async function probe(base) {
  console.log("\n===", base);
  const get = await fetch(`${base}/intel`);
  console.log("GET /intel", get.status, (await get.text()).slice(0, 160));

  const post = await fetch(`${base}/intel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "AI_TEXT_DETECTION",
      query: "The committee will convene at noon to review the quarterly report.",
    }),
  });
  const body = await post.text();
  console.log("POST /intel AI_TEXT", post.status, body.slice(0, 400));

  const page = await fetch(`${base}/demand-app`);
  const html = await page.text();
  console.log(
    "GET /demand-app",
    page.status,
    html.includes("Is this text") || html.includes("AI") ? "has checker UI" : "missing UI marker",
  );
}

for (const u of urls) await probe(u);
