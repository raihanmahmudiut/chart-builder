# Installation Fix for Windows

## Problem
The `npm install` failed due to locked files (EBUSY errors). This is common on Windows when:
- VS Code or another editor has files open
- A dev server is running
- Antivirus is scanning files
- Windows is indexing the directory

## Solution

### Option 1: Clean Install (Recommended)

```bash
# 1. Close VS Code and any terminals
# 2. Delete node_modules and lock files
rmdir /s /q node_modules
del package-lock.json

# 3. Wait a few seconds, then install
npm install
```

### Option 2: Use Yarn (Faster & More Reliable on Windows)

```bash
# 1. Install Yarn if you don't have it
npm install -g yarn

# 2. Clean install with Yarn
rmdir /s /q node_modules
del yarn.lock
yarn install
```

### Option 3: Use pnpm (Recommended for Windows)

```bash
# 1. Install pnpm if you don't have it
npm install -g pnpm

# 2. Clean install with pnpm
rmdir /s /q node_modules
pnpm install
```

### Option 4: PowerShell Script (Automated)

Save this as `install.ps1` and run it:

```powershell
# Close all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait for file handles to release
Start-Sleep -Seconds 2

# Remove node_modules
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}

# Remove lock files
if (Test-Path package-lock.json) {
    Remove-Item package-lock.json
}

# Install
npm install
```

Run it:
```bash
powershell -ExecutionPolicy Bypass -File install.ps1
```

## Quick Fix (Try This First)

```bash
# Just close everything and try again
npm cache clean --force
npm install
```

## After Successful Install

```bash
# Start the dev server
npm run dev
```

Then open `http://localhost:3000`

## Still Having Issues?

### Check Node Version
```bash
node --version
# Should be v18.x or v20.x (you have v25.2.0 which is very new)
```

**Recommendation**: Use Node v20 LTS instead of v25
```bash
# Install nvm-windows from: https://github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20
```

### Disable Antivirus Temporarily
Some antivirus software locks files during installation. Try temporarily disabling it.

### Run as Administrator
Right-click Command Prompt or PowerShell and "Run as Administrator"

## Alternative: Use Docker

If nothing works, you can use Docker:

```dockerfile
# Create Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

```bash
docker build -t dashboard-builder .
docker run -p 3000:3000 dashboard-builder
```

