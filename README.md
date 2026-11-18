# Ali Arefipoor — Portfolio & CMS

A bilingual (English/Persian) personal portfolio with a small self-hosted CMS. It uses only Node.js built-ins: no framework install, database service, or paid account is needed.

## Architecture review and implementation plan

The supplied workspace was empty, so there was no prior implementation or data to retain. I established the project in these phases:

1. **Foundation:** Node HTTP server, responsive CSS, English/Persian direction and text, persistent theme choice, and clean routes.
2. **CMS:** password setup with scrypt, signed HTTP-only admin sessions, content editing, JSON file persistence, and a validated media library.
3. **Public pages:** home, projects and detail pages, About, achievements, experience, education, and contact, all rendered from stored content.
4. **Operations:** local setup, backup and restore, environment variables, and a production deployment outline.

I chose a dependency-free Node server and atomic JSON-file writes to keep the project portable and easy to back up. The CMS and uploaded media persist under `data/`. This is a single-server deployment design; use managed database/object storage if you later need multiple app instances, concurrent editors, or larger media volumes.

## Requirements

- Node.js 20 or newer. Install the project dependencies with `npm install` before starting the app.
- PowerShell on Windows can call npm as `npm.cmd` if script execution blocks `npm.ps1`.

## First run

Install dependencies first with `npm install`. Then run the setup commands **one at a time**. When `admin:create` asks for a password, type only the password and press Enter. Wait until it says the credential was saved before entering the next command. The password input is hidden.

### Command Prompt (cmd.exe)

```bat
npm.cmd run admin:create
```

After the password setup finishes, generate a session secret and copy the printed value:

```bat
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then set the variables in this same Command Prompt window and start the server:

```bat
set SESSION_SECRET=paste-the-generated-value-here
set HOST=127.0.0.1
set PORT=3000
npm.cmd run dev
```

### PowerShell

```powershell
npm.cmd run admin:create
```

After the password prompt finishes, run these commands in the same PowerShell window:

```powershell
$env:SESSION_SECRET = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$env:HOST = '127.0.0.1'
$env:PORT = '3000'
npm.cmd run dev
```

Open `http://127.0.0.1:3000` for the site and `/admin` for the CMS. The first run creates `data/content.json` from the bundled starter content. Keep `data/admin.json`, `data/content.json`, and `data/media/` private and backed up; they are excluded from Git.

Generate a new `SESSION_SECRET` for each environment. It must be at least 32 characters. In production, set `COOKIE_SECURE=1` and terminate HTTPS at your web server or hosting platform. Set `HOST=0.0.0.0` only when the app must accept traffic from a reverse proxy/container network. `PUBLIC_URL=https://example.com` sets the sitemap host. Do not commit secrets or credential files.

Environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | required | HMAC key for signed admin sessions (32+ characters) |
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `127.0.0.1` | Listen interface |
| `COOKIE_SECURE` | unset | Set to `1` behind HTTPS to mark the session cookie Secure |
| `PUBLIC_URL` | request host | Canonical origin used by sitemap.xml |

## CMS

The admin screen has graphical forms for the homepage, projects, pages, capabilities, skills, achievements, experience, certificates/education, social links, contact, resume exports, global settings, and media. English and Persian fields are separate. Collection forms include search, visibility controls, ordering, labeled project links, categories, and media pickers. Resume export settings control whether downloads are enabled, the default language, PDF accent, filenames and document titles, included sections, and section order. The resume uses the existing published CMS records; it does not maintain a second content editor. Project galleries, certificate images/PDFs, and achievement images can use the shared library; gallery images can be reordered in the form.

The public homepage offers PDF and editable Word (.docx) downloads in its current language. Each request reads current CMS data and excludes hidden records. The PDF is rendered with Puppeteer/Chrome and the local Vazir fonts for Persian shaping, RTL layout, and pagination. Word documents are OOXML files generated with `docx`; Persian paragraphs use RTL settings and the Vazir regular and bold TTF faces are embedded in the document. Profile and project images are included when supplied. Generated documents are sent directly and are not saved on the server.

Supported media: PNG, JPEG, WebP, GIF, and PDF, up to 5 MB each. Upload content is checked against its file signature. The portrait uses `object-fit: cover`; set its crop focus in the portrait settings and edit its alternative text in each language. The Persian interface and website use the bundled local Vazir WOFF2 font files; no remote font service is required.

## Pages and routes

- `/`, `/about`, `/projects`, `/projects/:slug`
- `/achievements`, `/experience`, `/certificates`, `/contact`
- `/admin`
- `/robots.txt`, `/sitemap.xml`, `/health`

Use `?lang=fa` for Persian. The language switch is preserved on internal navigation. The dark and light themes are independently styled; a visitor's selected theme is stored in browser local storage. Local storage is used only for this preference, never as CMS persistence.

## Development and production

```powershell
npm.cmd run dev       # watch/restart server during local work
npm.cmd run check     # syntax validation
npm.cmd start         # production server
```

The app has no separate compilation/build step. For deployment, run `npm install` and `npm start` under a process manager on a Node 20+ host, set the environment variables above, and put an HTTPS reverse proxy in front. Puppeteer needs a compatible Chrome/Chromium executable; it downloads a pinned browser during installation where package install scripts are permitted. On hosts that provide their own browser, set `PUPPETEER_EXECUTABLE_PATH` to its absolute path. The writable `data/` directory must live on persistent disk and be excluded from public static hosting. Back up that directory regularly. Restrict `/admin` at the proxy too if your host offers access controls.

## Backup and restore

Stop the server or take a consistent filesystem snapshot, then copy the full `data/` directory to private backup storage. To restore, stop the server, replace `data/content.json`, `data/admin.json`, and `data/media/` from the same backup, and restart. A fresh admin password can be created with `npm run admin:create` (this replaces the credential file). Keep the content file and referenced media together.

## Moving hosts or storage

Copy the app files and `data/` folder to the new Node host, set its environment variables, and start it. No provider-specific migration is required. For a later move to a database, export the current JSON content and media directory first; the content file is deliberately plain JSON to make that migration straightforward.

## Initial content

Starter content uses only the supplied professional background, training, achievements, collaboration names, and verified social/project links. Project descriptions are intentionally modest and should be refined to match your exact contributions. Contact email and phone are blank until you provide verified details.
