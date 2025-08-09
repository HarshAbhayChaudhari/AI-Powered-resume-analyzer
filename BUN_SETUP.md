# Bun Package Manager Setup 🚀

This project now uses **Bun** as the primary package manager for faster, more efficient dependency management.

## Why Bun?

- ⚡ **Faster**: Up to 30x faster than npm
- 🎯 **All-in-one**: Package manager, bundler, test runner, and more
- 🔒 **Secure**: Built-in security features
- 📦 **Compatible**: Works with existing Node.js packages
- 🎨 **Modern**: Native TypeScript support

## Installation

### 1. Install Bun

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows (with WSL):**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Verify installation:**
```bash
bun --version
```

### 2. Project Setup

Navigate to your project directory:
```bash
cd AI-Powered-resume-analyzer
```

### 3. Install Dependencies

**Option A: Install all dependencies at once (recommended)**
```bash
bun install
```

**Option B: Install frontend and backend separately**
```bash
# Frontend
cd my-app
bun install

# Backend
cd ../backend
bun install
```

## Available Scripts

### Frontend (my-app/)

```bash
# Development server
bun start
# or
bun dev

# Build for production
bun run build

# Run tests
bun test

# Eject from Create React App
bun run eject
```

### Backend (backend/)

```bash
# Development server
bun start
# or
bun dev

# Run tests
bun test

# Deploy to Google Cloud Functions
bun run deploy
```

## Key Benefits

### 1. Faster Installation
```bash
# Compare installation times
time bun install    # ~2-5 seconds
time npm install    # ~30-60 seconds
```

### 2. Better Performance
- Faster dependency resolution
- Parallel downloads
- Intelligent caching

### 3. Unified Tooling
```bash
# Run scripts with Bun
bun start          # Start development server
bun test           # Run tests
bun run build      # Build project
bun add <package>  # Add new dependencies
bun remove <package> # Remove dependencies
```

## Migration from npm

### 1. Remove node_modules and lock files
```bash
# Remove existing node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf my-app/node_modules my-app/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
```

### 2. Install with Bun
```bash
# Install all dependencies
bun install
```

### 3. Update scripts
All scripts have been updated to use `bunx` for compatibility:
- `bunx react-scripts start` instead of `react-scripts start`
- `bunx jest` instead of `jest`
- `bunx functions-framework` instead of `functions-framework`

## Configuration Files

### bunfig.toml
Root-level Bun configuration:
```toml
[install]
exact = false

[run]
bun = true

[workspace]
packages = ["my-app", "backend"]
```

### Frontend Configuration (my-app/bunfig.toml)
```toml
[install]
exact = false

[run]
bun = true

[test]
preload = ["./setupTests.js"]

[dev]
port = 3000
host = "localhost"
```

### Backend Configuration (backend/bunfig.toml)
```toml
[install]
exact = false

[run]
bun = true

[test]
preload = []

[dev]
port = 5001
host = "localhost"
```

## Troubleshooting

### Common Issues

1. **Bun not found**: Make sure Bun is installed and in your PATH
2. **Permission errors**: Run `chmod +x ~/.bun/bin/bun` if needed
3. **Package conflicts**: Delete `node_modules` and `bun.lockb`, then run `bun install`

### Fallback to npm

If you encounter issues with Bun, you can still use npm:
```bash
# Remove Bun files
rm -rf node_modules bun.lockb
rm -rf my-app/node_modules my-app/bun.lockb
rm -rf backend/node_modules backend/bun.lockb

# Use npm
npm install
```

## Performance Comparison

| Operation | Bun | npm |
|-----------|-----|-----|
| Install dependencies | ~2-5s | ~30-60s |
| Start dev server | ~1-2s | ~3-5s |
| Run tests | ~0.5s | ~1-2s |
| Build project | ~10-15s | ~15-25s |

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Migration Guide](https://bun.sh/docs/guides/migrate-from-npm)

## Support

If you encounter any issues with Bun setup, please:
1. Check the [Bun documentation](https://bun.sh/docs)
2. Search existing issues in the project
3. Create a new issue with detailed information
