const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'app');

const colorMap = {
  // Blues -> var(--blue)
  '#2684b9': 'var(--blue)',
  '#2563EB': 'var(--blue)',
  '#2563eb': 'var(--blue)',
  '#1877F2': 'var(--blue)',
  '#4285F4': 'var(--blue)',
  '#3B2FC9': 'var(--blue)',

  // Oranges -> var(--orange)
  '#e56030': 'var(--orange)',
  '#FD7E14': 'var(--orange)',
  '#fd7e14': 'var(--orange)',
  '#d63e13': 'var(--orange)',

  // Greens -> var(--green)
  '#0ea85c': 'var(--green)',
  '#10b981': 'var(--green)',
  '#25d366': 'var(--green)',
  '#065f46': 'var(--green)',
  '#047857': 'var(--green)',
  '#34d399': 'var(--green)',
  '#6ee7b7': 'var(--green)',
  
  // Darks -> var(--text)
  '#0f172a': 'var(--text)',
  '#1e293b': 'var(--text)',
  '#111827': 'var(--text)',
  '#1f2937': 'var(--text)'
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const [hex, cssVar] of Object.entries(colorMap)) {
        // For inline JSX styles: replace "#hex" with "var(--color)"
        const strRegex = new RegExp(`['"]${hex}['"]`, 'gi');
        content = content.replace(strRegex, `"${cssVar}"`);
        
        // For CSS and bare template strings: replace #hex with var(--color)
        const bareRegex = new RegExp(hex, 'gi');
        content = content.replace(bareRegex, cssVar);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir(targetDir);
console.log('Finished refactoring colors!');
