@echo off
echo ==========================================
echo 🚀 Preparing to Push Portfolio Changes to GitHub...
echo ==========================================

:: 1. Add all changes
echo ➕ Staging changed files...
git add .

:: 2. Commit changes
echo 💬 Committing changes...
git commit -m "feat: integrate Campaign images gallery and fix Campaigns tab filtering"

:: 3. Push to current branch
echo 📤 Pushing to GitHub...
git push origin HEAD

echo ==========================================
echo 🎉 Done! All changes have been pushed successfully.
echo ==========================================
pause
