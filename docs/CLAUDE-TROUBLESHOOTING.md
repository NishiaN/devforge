# CLAUDE.md Troubleshooting Guide

This document contains environment setup, deployment, and troubleshooting information for DevForge v9. See `CLAUDE.md` for core development guidelines.

---

## Environment

- **Node.js**: Required for build/test. If using WSL with nvm, ensure nvm is loaded in shell
- **Browser**: Generated HTML runs in any modern browser (Chrome, Firefox, Safari, Edge)
- **CDN Dependencies**: marked.js, mermaid.js, JSZip (loaded at runtime)

---

## Git Workflow & Deployment

### First-Time Setup
```bash
# Configure Git identity (if not set)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Or use GitHub noreply email
git config user.email "[username]@users.noreply.github.com"
```

### Standard Commit Flow
```bash
# 1. Make changes in src/
# 2. Test
npm test

# 3. Build
node build.js

# 4. Review changes
git status
git diff

# 5. Stage files (prefer specific files over git add .)
git add src/core/state.js devforge-v9.html

# 6. Commit with Co-Authored-By
git commit -m "feat: Add new feature

Description of changes here.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 7. Push
git push
```

### SSH vs HTTPS
- **SSH** (recommended): Requires SSH key setup, no password prompts
- **HTTPS**: Requires Personal Access Token (PAT), passwords deprecated

**Set up SSH:**
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy and add to GitHub Settings → SSH Keys
git remote set-url origin git@github.com:user/repo.git
```

### Built HTML Tracking
- By default, `devforge-v9.html` is gitignored (build artifact)
- For GitHub Pages: **must commit** the built HTML
- Trade-off: Larger diffs, but enables static hosting

---

## GitHub Pages Deployment

### Initial Setup
1. Repository must be **Public** (Pages unavailable for Private repos on Free plan)
2. Settings → Pages → Source: `Deploy from a branch`
3. Branch: `main`, Folder: `/ (root)`

### Important: Built HTML Must Be Committed
- `devforge-v9.html` is in `.gitignore` by default (build artifact)
- For GitHub Pages, **comment out** the line in `.gitignore`:
  ```gitignore
  # devforge-v9.html  ← Comment this for Pages deployment
  ```
- Commit the built HTML: `git add -f devforge-v9.html`
- Push to trigger deployment

### Troubleshooting Pages
- **"Not Found" on Pages settings**: Repository must be Public
- **404 on site**: Ensure `index.html` and `devforge-v9.html` are committed
- **Changes not reflected**: Hard refresh (`Ctrl+Shift+R`) or wait 1-2 minutes for cache
- **Deployment history**: Check https://github.com/[user]/[repo]/deployments

---

## Troubleshooting

### Build fails with "SyntaxError"
- Check for `${}` inside single-quoted strings — use concatenation
- Verify all functions close their braces
- Run `npm run check` to validate syntax

### Tests fail after adding new generator
- Ensure new generator is loaded in test files with `eval(fs.readFileSync(...))`
- Verify generator doesn't mutate global state unexpectedly
- Check that `const G = S.genLang === 'ja';` is defined at function top

### Generated files missing entities
- Verify entity names are passed to `getEntityColumns(name, G, knownEntities)`
- Check `data_entities` answer is parsed correctly in generator
- Ensure entity name matches ENTITY_COLUMNS keys in `common.js`

### LocalStorage quota exceeded
- DevForge stores ~500KB per project in localStorage
- Clear old projects via Project Manager (⌘/Ctrl+P)
- Browser limit: ~5-10MB depending on browser

### i18n key not found
- Ensure key exists in both `I18N.ja` and `I18N.en`
- Use `t('key')` function, not direct `I18N[key]` access
- Check for typos in key names

### Module dependency errors
- Verify module load order in `build.js` → `jsFiles` array
- Core modules must load before UI modules
- Data modules must load before generators

### HTML Entity Escaping Issues
**Symptom:** Literal `</div>` or `<div>` text appears on page

**Cause:** Using HTML entities (`&lt;`, `&gt;`) instead of actual tags in `innerHTML`

**Example:**
```javascript
// ❌ Wrong: Creates literal text "</div>"
el.innerHTML = '<div>&lt;/div>';

// ✅ Correct: Creates proper closing tag
el.innerHTML = '<div></div>';
```

**Common locations:**
- Dynamic content generation (tour.js, render.js)
- Template strings building HTML
- Copy-paste from HTML-encoded sources

**Fix:** Search for `&lt;` and `&gt;` in source files, replace with `<` and `>`

### Node.js Not Found (WSL/nvm)
**Symptom:** `bash: node: command not found`

**Cause:** nvm not loaded in current shell session

**Fix:**
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
node build.js
```

**Permanent fix:** Add to `~/.bashrc` (already done if nvm installed correctly)
