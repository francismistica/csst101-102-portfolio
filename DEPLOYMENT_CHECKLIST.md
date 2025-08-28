# Deployment Checklist

Use this checklist to ensure your website is ready for deployment.

## Pre-Deployment Checks

- [ ] All pages load correctly in local development
- [ ] Website builds successfully with `npm run build`
- [ ] Preview works correctly with `npm run preview`
- [ ] All links work correctly
- [ ] Images and assets load properly
- [ ] Responsive design works on different screen sizes
- [ ] Dark/light mode toggle functions correctly
- [ ] No console errors in browser developer tools

## Configuration Checks

- [ ] Site URL in `astro.config.mjs` is set correctly
- [ ] Metadata (title, description, etc.) is properly set
- [ ] Favicons and app icons are in place
- [ ] `robots.txt` is configured correctly
- [ ] Sitemap is generated correctly

## Deployment Platform Setup

### Vercel
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Build settings verified
- [ ] Environment variables set (if needed)

### Netlify
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] `netlify.toml` configuration verified
- [ ] Environment variables set (if needed)

### GitHub Pages
- [ ] GitHub repository is public
- [ ] GitHub Pages enabled in repository settings
- [ ] GitHub Actions workflow file in place
- [ ] Base path configured correctly (if needed)

## Post-Deployment Checks

- [ ] Website loads correctly on deployed URL
- [ ] All pages and features work as expected
- [ ] Performance is acceptable (use Lighthouse or PageSpeed Insights)
- [ ] Analytics is working (if applicable)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is valid (https works)

## Notes

- Remember to update the site URL in `astro.config.mjs` if you're using a custom domain
- If you encounter any issues, check the build logs on your deployment platform
- For detailed deployment instructions, refer to the `DEPLOYMENT.md` file