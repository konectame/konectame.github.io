# GitHub Deployment Documentation

This document outlines the deployment process for the KonectaMe project using GitHub Pages and GitHub Actions, including the setup of environment variables and secrets.

## GitHub CLI Installation and Setup

### Installation
1. Download GitHub CLI from [cli.github.com](https://cli.github.com/)
2. Follow the installation instructions for your operating system
3. Verify installation:
```bash
gh --version
```

### Authentication
1. Login to GitHub CLI:
```bash
gh auth login
```
2. Follow the interactive prompts to complete authentication
3. Verify authentication status:
```bash
gh auth status
```

### Common GitHub CLI Commands
```bash
# List repositories
gh repo list

# View repository
gh repo view

# Create a new repository
gh repo create

# List repository secrets
gh secret list

# Set a repository secret
gh secret set SECRET_NAME
```

## Environment Variables Loading Scripts

The project includes two scripts for loading environment variables as GitHub secrets:

### Windows Script (`scripts/load-secrets.bat`)

#### Usage
```bash
cd path/to/project
scripts/load-secrets.bat
```

#### Features
- Verifies GitHub CLI installation
- Checks authentication status
- Reads `.env` file
- Automatically creates GitHub secrets
- Handles whitespace and special characters
- Skips comments and empty lines

#### Requirements
- Windows operating system
- GitHub CLI installed and authenticated
- `.env` file in project root

### Unix Script (`scripts/load-secrets.sh`)

#### Usage
```bash
cd path/to/project
chmod +x scripts/load-secrets.sh
./scripts/load-secrets.sh
```

#### Features
- Same functionality as Windows script
- POSIX-compliant shell script
- Proper error handling
- Progress feedback

#### Requirements
- Unix-like operating system
- GitHub CLI installed and authenticated
- `.env` file in project root

## Environment Variables

The following environment variables are required for deployment:

```plaintext
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Application Configuration
VITE_ROOT_COLLECTION=mp
VITE_ROOT_FOLDER=mp
VITE_MARKETPLACE_ID=mp
VITE_ADMIN_EMAIL=alex@email.com
```

## GitHub Actions Workflow

The deployment workflow (`/.github/workflows/deploy.yml`) automatically:
1. Builds the project
2. Deploys to GitHub Pages
3. Uses the configured secrets as environment variables

### Setting Up GitHub Pages

1. Go to repository settings
2. Navigate to "Pages" section
3. Under "Source", select "GitHub Actions"
4. The site will be available at: `https://<username>.github.io/<repository>`

## Troubleshooting

### Common Issues

1. **GitHub CLI not found**
   - Ensure GitHub CLI is installed
   - Add GitHub CLI to system PATH
   - Verify with `gh --version`

2. **Authentication Failed**
   - Run `gh auth login`
   - Check status with `gh auth status`
   - Ensure you have proper repository permissions

3. **Missing Environment Variables**
   - Verify `.env` file exists
   - Check `.env` file format
   - Ensure no trailing whitespace

4. **Deployment Failed**
   - Check GitHub Actions logs
   - Verify all secrets are set
   - Ensure build script succeeds locally
