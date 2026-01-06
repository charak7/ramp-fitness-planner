// Build script for preparing the application for App Engine deployment
const fs = require('fs');
const path = require('path');

// Copy the built React app to the public directory for serving
const sourceDir = path.join(__dirname, '..', 'client', 'build');
const destDir = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created public directory');
}

// Copy all files from client/build to server/public
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    return;
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDirectory(sourceDir, destDir);
  console.log('Successfully copied built React app to server/public directory');
  console.log('App ready for App Engine deployment');
} catch (error) {
  console.error('Error during build preparation:', error);
  process.exit(1);
}