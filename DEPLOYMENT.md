# Deployment Guide for NeonMint Portfolio

This guide provides step-by-step instructions for deploying your NeonMint portfolio website to various hosting platforms.

## Prerequisites

- Your project is pushed to a GitHub repository
- You have built your site locally with `npm run build` to verify it works correctly

## Deployment Options

### 1. Vercel (Recommended)

Vercel is recommended because it offers seamless integration with Astro projects and already includes Speed Insights in this project.

#### Steps:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Import your GitHub Repository**
   - From the Vercel dashboard, click "Add New..." → "Project"
   - Connect to GitHub if not already connected
   - Select your repository

3. **Configure the Project**
   - Vercel will automatically detect Astro and suggest the correct settings
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - Once complete, you'll receive a URL to your deployed site

5. **Custom Domain (Optional)**
   - In the Vercel dashboard, go to your project settings
   - Click on "Domains"
   - Add your custom domain and follow the instructions

### 2. Netlify

Netlify is another excellent option for hosting static sites with continuous deployment.

#### Steps:

1. **Create a Netlify Account**
   - Sign up at [netlify.com](https://netlify.com) if you don't have an account

2. **Import your GitHub Repository**
   - From the Netlify dashboard, click "Add new site" → "Import an existing project"
   - Connect to GitHub if not already connected
   - Select your repository

3. **Configure the Project**
   - Netlify will use the settings in `netlify.toml`
   - Verify the build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - Once complete, you'll receive a URL to your deployed site

5. **Custom Domain (Optional)**
   - In the Netlify dashboard, go to your site settings
   - Click on "Domain settings"
   - Add your custom domain and follow the instructions

### 3. GitHub Pages

GitHub Pages is a free hosting service provided by GitHub, suitable for personal or project websites.

#### Steps:

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Trigger the Workflow**
   - Push to the main branch or manually trigger the workflow from the Actions tab
   - The workflow defined in `.github/workflows/deploy.yml` will build and deploy your site

3. **Access Your Site**
   - Once deployed, your site will be available at `https://[username].github.io/[repository-name]/`

4. **Custom Domain (Optional)**
   - In your repository settings, go to "Pages"
   - Under "Custom domain", enter your domain name
   - Follow the instructions to configure DNS settings

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs for errors
   - Verify that your project builds locally with `npm run build`
   - Ensure all dependencies are correctly listed in `package.json`

2. **Missing Assets**
   - Make sure all assets are properly referenced with relative paths
   - Check that files in the `public` directory are being copied to the build output

3. **Routing Issues**
   - Verify that the redirect rules in `netlify.toml` or `vercel.json` are correctly configured
   - For GitHub Pages, ensure the `base` property in `astro.config.mjs` is set to your repository name if not using a custom domain

## Post-Deployment

1. **Verify Your Site**
   - Check all pages and functionality
   - Test on different devices and browsers

2. **Set Up Analytics**
   - Vercel Speed Insights is already included
   - Consider adding Google Analytics or other tracking tools

3. **Regular Updates**
   - Keep your dependencies updated
   - Push changes to your repository to trigger automatic redeployments