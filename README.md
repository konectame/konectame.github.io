# Konectame Marketplace Admin Console

This is the administrative interface for the Konectame Marketplace, built with React, TypeScript, and Vite. The application is deployed on Netlify and provides a secure admin console for managing marketplace operations.

## 🚀 Features

- **Secure Authentication**: Firebase-based authentication system
- **Admin Console**: Comprehensive dashboard for marketplace management
- **Profile Management**: User profile handling and updates
- **Modern UI**: Built with modern React practices and responsive design

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Styling**: TailwindCSS
- **Deployment**: Netlify
- **State Management**: React Context API
- **Routing**: React Router v6

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/konectame/konectame.github.io.git
   cd konectame.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

## 🛠️ Build

Generate a production build:
```bash
npm run build
```

The build output will be in the `docs` directory, ready for deployment.

## 🎨 Custom Scripts

- **Generate Favicon**: Create a circular favicon from the logo
  ```bash
  npm run generate-favicon
  ```

## 📝 Environment Configuration

The application uses different environment configurations:

- `.env`: Default environment variables
- `.env.development`: Development-specific variables
- `.env.production`: Production-specific variables

## 🚀 Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch. Netlify handles:

- Build process
- SPA routing
- SSL certificates
- CDN distribution

## 📁 Project Structure

```
konectame.github.io/
├── docs/               # Build output directory
├── public/            # Static assets
├── scripts/           # Utility scripts
├── src/
│   ├── admin/         # Admin-specific components
│   ├── components/    # Shared components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   └── services/      # API and service functions
├── .env              # Environment variables
├── index.html        # Entry HTML file
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## 🔒 Security

- All routes under `/admin` require authentication
- Firebase Authentication handles user sessions
- Environment variables are properly secured
- API keys are protected through environment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.
