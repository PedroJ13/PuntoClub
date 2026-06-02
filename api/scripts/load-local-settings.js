const fs = require('node:fs');
const path = require('node:path');

function loadLocalSettings() {
  const settingsPath = path.join(__dirname, '..', 'local.settings.json');
  if (!fs.existsSync(settingsPath)) {
    return false;
  }

  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  for (const [key, value] of Object.entries(settings.Values || {})) {
    if (process.env[key] == null && value != null) {
      process.env[key] = String(value);
    }
  }

  return true;
}

module.exports = { loadLocalSettings };
