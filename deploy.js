// deploy.js - A simple script to help with deployment
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to update site URL in astro.config.mjs
function updateSiteUrl(url) {
  try {
    let config = fs.readFileSync('./astro.config.mjs', 'utf8');
    config = config.replace(/site:\s*"[^"]*"/, `site: "${url}"`);
    fs.writeFileSync('./astro.config.mjs', config);
    console.log(`✅ Site URL updated to ${url} in astro.config.mjs`);
  } catch (error) {
    console.error('❌ Error updating site URL:', error);
  }
}

// Function to build the project
function buildProject() {
  try {
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 NeonMint Deployment Helper');
  console.log('----------------------------');
  
  rl.question('Enter your deployment platform (vercel, netlify, github): ', (platform) => {
    platform = platform.toLowerCase();
    
    if (!['vercel', 'netlify', 'github'].includes(platform)) {
      console.error('❌ Invalid platform. Please choose vercel, netlify, or github.');
      rl.close();
      return;
    }
    
    rl.question('Enter your site URL (e.g., https://yourdomain.com): ', (url) => {
      // Update site URL in config
      updateSiteUrl(url);
      
      // Build the project
      const buildSuccess = buildProject();
      
      if (buildSuccess) {
        console.log('\n📋 Next steps:');
        
        switch (platform) {
          case 'vercel':
            console.log('1. Create an account on vercel.com if you don\'t have one');
            console.log('2. Install Vercel CLI: npm i -g vercel');
            console.log('3. Run: vercel');
            break;
          case 'netlify':
            console.log('1. Create an account on netlify.com if you don\'t have one');
            console.log('2. Install Netlify CLI: npm i -g netlify-cli');
            console.log('3. Run: netlify deploy');
            break;
          case 'github':
            console.log('1. Push your changes to GitHub');
            console.log('2. Go to your repository settings');
            console.log('3. Navigate to Pages and select GitHub Actions as the source');
            break;
        }
        
        console.log('\nFor more detailed instructions, refer to DEPLOYMENT.md');
      }
      
      rl.close();
    });
  });
}

// Run the main function
main();