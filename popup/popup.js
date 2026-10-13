const RULESET_ID = "imginn-redirects";

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function updateStatus() {
  status.textContent = toggle.checked
    ? "Redirecting Instagram → Imginn"
    : "Redirects disabled";
}

async function init() {
  const enabled = await browser.declarativeNetRequest.getEnabledRulesets();
  toggle.checked = enabled.includes(RULESET_ID);
  updateStatus();
}

toggle.addEventListener("change", async () => {
  await browser.declarativeNetRequest.updateEnabledRulesets(
    toggle.checked
      ? { enableRulesetIds: [RULESET_ID] }
      : { disableRulesetIds: [RULESET_ID] }
  );
  browser.runtime.sendMessage("sync-icon");
  updateStatus();
});

init();
