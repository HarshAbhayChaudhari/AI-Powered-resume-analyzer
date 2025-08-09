# GitHub Personal Access Token Setup

## Step 1: Create Personal Access Token

1. Go to [GitHub.com](https://github.com) and sign in
2. Click your profile picture → Settings
3. Scroll down → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. Configure:
   - **Note**: "Resume Analyzer Development"
   - **Expiration**: "No expiration" (or custom date)
   - **Scopes**: 
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages to GitHub Package Registry)
     - ✅ `delete:packages` (Delete packages from GitHub Package Registry)
7. Click "Generate token"
8. **COPY THE TOKEN IMMEDIATELY** (you won't see it again)

## Step 2: Configure Git

After getting your token, run these commands:

```bash
# Configure credential helper (already done)
git config --global credential.helper store

# Update remote URL with your token
git remote set-url origin https://YOUR_TOKEN_HERE@github.com/HarshAbhayChaudhari/AI-Powered-resume-analyzer.git
```

Replace `YOUR_TOKEN_HERE` with the actual token you copied.

## Step 3: Test the Configuration

```bash
# Test by pushing a small change
echo "# Test commit" >> README.md
git add README.md
git commit -m "Test authentication"
git push origin main
```

## Alternative: Use GitHub CLI

If you prefer, you can also use GitHub CLI:

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# This will open a browser and authenticate you
```

## Troubleshooting

- If you get "remote: Invalid username or password", double-check your token
- If you get "remote: Repository not found", ensure you have write access to the repository
- If you get permission errors, make sure the token has the correct scopes

## Security Notes

- Keep your token secure and don't share it
- Consider setting an expiration date for production use
- You can revoke tokens at any time in GitHub Settings → Developer Settings → Personal Access Tokens
