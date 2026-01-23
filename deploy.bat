@echo off
REM Deployment script for Python Programming Notes Website (Windows)

echo Preparing for GitHub deployment...

REM Check if we're in a git repository
if not exist ".git" (
    echo Initializing git repository...
    git init
)

REM Add all files
echo Adding files to git...
git add .

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo Committing changes...
    git commit -m "Update Python Programming Notes website"
) else (
    echo No changes to commit
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Please add your GitHub remote repository:
    echo git remote add origin https://github.com/yourusername/your-repo.git
    pause
    exit /b 1
)

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

echo Deployment complete!
echo Remember to enable GitHub Pages in your repository settings:
echo 1. Go to your repository Settings
echo 2. Navigate to Pages section
echo 3. Select 'Deploy from a branch'  
echo 4. Choose main branch and root folder
echo 5. Your site will be available at https://yourusername.github.io/your-repo
pause