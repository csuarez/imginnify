// Simulates Firefox's declarativeNetRequest evaluation of rules.json:
// among matching rules the highest priority wins; "allow" means no redirect.
// Run: node scripts/test-rules.mjs
import { readFileSync } from "node:fs";

const rules = JSON.parse(readFileSync(new URL("../rules.json", import.meta.url)));

function evaluate(url) {
  let winner = null;
  for (const rule of rules) {
    const re = new RegExp(rule.condition.regexFilter);
    if (!re.test(url)) continue;
    if (!winner || rule.priority > winner.priority) winner = rule;
  }
  if (!winner || winner.action.type === "allow") return null;
  const sub = winner.action.redirect.regexSubstitution.replace(/\\(\d)/g, "$$$1");
  return url.replace(new RegExp(winner.condition.regexFilter), sub);
}

const cases = [
  // [input, expected redirect or null]
  ["https://www.instagram.com/instagram/", "https://imginn.com/instagram/"],
  ["https://instagram.com/some.user_name", "https://imginn.com/some.user_name/"],
  ["https://www.instagram.com/instagram/tagged/", "https://imginn.com/instagram/"],
  ["https://www.instagram.com/instagram/reels/", "https://imginn.com/instagram/"],
  ["https://www.instagram.com/instagram/?hl=en", "https://imginn.com/instagram/"],
  ["https://www.instagram.com/p/Cxyz123-_/", "https://imginn.com/p/Cxyz123-_/"],
  ["https://www.instagram.com/p/Cxyz123/?img_index=2", "https://imginn.com/p/Cxyz123/"],
  ["https://www.instagram.com/someuser/p/Cxyz123/", "https://imginn.com/p/Cxyz123/"],
  ["https://www.instagram.com/reel/Cabc456/", "https://imginn.com/reel/Cabc456/"],
  ["https://www.instagram.com/reels/Cabc456/", "https://imginn.com/reel/Cabc456/"],
  ["https://www.instagram.com/someuser/reel/Cabc456/", "https://imginn.com/reel/Cabc456/"],
  ["https://www.instagram.com/stories/someuser/", "https://imginn.com/stories/someuser/"],
  ["https://www.instagram.com/stories/someuser/3141592653589793238/", "https://imginn.com/stories/someuser/"],
  ["https://www.instagram.com/", "https://imginn.com/"],
  ["http://instagram.com", "https://imginn.com/"],
  // must NOT redirect:
  ["https://www.instagram.com/accounts/login/", null],
  ["https://www.instagram.com/accounts/login/?next=%2F", null],
  ["https://www.instagram.com/explore/", null],
  ["https://www.instagram.com/direct/inbox/", null],
  ["https://www.instagram.com/reels/", null],
  ["https://www.instagram.com/api/v1/whatever", null],
  ["https://www.instagram.com/challenge/", null],
];

let failed = 0;
for (const [url, expected] of cases) {
  const got = evaluate(url);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${url}\n      -> ${got}${ok ? "" : `  (expected ${expected})`}`);
}
console.log(failed ? `\n${failed} failing case(s)` : "\nAll cases pass");
process.exit(failed ? 1 : 0);
