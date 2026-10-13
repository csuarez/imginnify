const RULESET_ID = "imginn-redirects";

async function syncIcon() {
  const enabled = await browser.declarativeNetRequest.getEnabledRulesets();
  const on = enabled.includes(RULESET_ID);
  await browser.action.setIcon({ path: on ? "icons/icon.svg" : "icons/icon-off.svg" });
  await browser.action.setTitle({ title: on ? "Imginnify — redirects on" : "Imginnify — redirects off" });
}

browser.runtime.onInstalled.addListener(syncIcon);
browser.runtime.onStartup.addListener(syncIcon);

browser.runtime.onMessage.addListener((message) => {
  if (message === "sync-icon") {
    syncIcon();
  }
});
