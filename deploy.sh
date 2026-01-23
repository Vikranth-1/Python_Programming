#!/bin/bash
# Deployment script for Python Programming Notes Website

echo "Preparing for GitHub deployment..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files
echo "Adding files to git..."
git add .

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "Committing changes..."
    git commit -m "Update Python Programming Notes website"
else
    echo "No changes to commit"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Please add your GitHub remote repository:"
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "Deployment complete!"
echo "Remember to enable GitHub Pages in your repository settings:"
echo "1. Go to your repository Settings"
echo "2. Navigate to Pages section" 
echo "3. Select 'Deploy from a branch'"
echo "4. Choose main branch and root folder"
echo "5. Your site will be available at https://yourusername.github.io/your-repo"