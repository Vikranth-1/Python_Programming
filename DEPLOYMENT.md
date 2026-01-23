# GitHub Pages Deployment Checklist

## Pre-deployment Steps

1. **File Naming Convention**
   - [ ] Rename files with special characters (en-dash –, em-dash —)
   - [ ] Replace special dashes with regular hyphens (-)
   - [ ] Ensure all filenames use ASCII characters only
   - [ ] Update navigation structure to match renamed files

2. **Repository Preparation**
   - [ ] Remove node_modules folder (handled by .gitignore)
   - [ ] Remove server.js file (handled by .gitignore)
   - [ ] Commit all .txt files to the repository
   - [ ] Verify all files are tracked by git

3. **Testing**
   - [ ] Test locally using a static server
   - [ ] Verify all navigation links work
   - [ ] Check that file loading works without Node.js server

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose main branch and root folder
   - Save settings

3. **Verify Deployment**
   - Wait for GitHub Pages to build (usually 1-2 minutes)
   - Visit your site at `https://yourusername.github.io/your-repo`
   - Test navigation and file loading

## Troubleshooting

**Common Issues:**
- File not found errors: Check that files are committed and filenames match navigation
- CORS errors: Usually not an issue with GitHub Pages serving same-origin requests
- Special character issues: Rename files to use standard ASCII characters

**If files don't load:**
1. Check browser console for specific error messages
2. Verify file paths in the navigation structure
3. Ensure files are in the correct directory structure
4. Check that files are actually committed to the repository

## Alternative Solution

If you continue to have issues with file loading on GitHub Pages, consider:
1. Converting .txt files to HTML content embedded in JavaScript
2. Using a static site generator like Jekyll
3. Creating a single-page application with all content bundled