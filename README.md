<p align="center">
  <img src="assets/icon-128.png" alt="Imginnify icon" width="96" height="96">
</p>

# Imginnify

Firefox extension that automatically redirects Instagram URLs to [Imginn](https://imginn.com), an anonymous Instagram viewer — no login walls, no tracking by Instagram.

## What gets redirected

| Instagram URL | Redirects to |
|---|---|
| `instagram.com/{username}/` (and `/tagged`, `/reels`, `/followers`… tabs) | `imginn.com/{username}/` |
| `instagram.com/p/{shortcode}/` (also `/{user}/p/{shortcode}/`) | `imginn.com/p/{shortcode}/` |
| `instagram.com/reel/{shortcode}/` (also `/reels/{shortcode}/`) | `imginn.com/reel/{shortcode}/` |
| `instagram.com/stories/{username}/` | `imginn.com/stories/{username}/` |
| `instagram.com/` (homepage) | `imginn.com/` |

App routes with no Imginn equivalent (`/accounts/`, `/explore/`, `/direct/`, the `/reels/` feed, etc.) are never redirected, so logging in to real Instagram still works.

Only top-level page navigations are redirected — embedded images and API requests are untouched.

## Toggle

Click the toolbar button to switch redirects on or off (e.g. when you need the real Instagram). The state persists across browser restarts, and the icon goes gray while disabled.

## Development

Run in a temporary Firefox profile:

```sh
npx web-ext run
```

Lint the extension:

```sh
npx web-ext lint
```

Test the redirect rules (simulates declarativeNetRequest matching against `rules.json`):

```sh
node scripts/test-rules.mjs
```

Or load it manually: open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `manifest.json`.

Requires Firefox 142+ (Manifest V3 with `declarativeNetRequest` regex substitution).

## License

[MIT](LICENSE)

## Note on Imginn domains

Imginn occasionally changes domains and has clone sites. The target domain appears only in `rules.json` — if imginn.com moves, update the `regexSubstitution` values there.
