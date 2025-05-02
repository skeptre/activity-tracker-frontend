# Activity Tracker Frontend

A modern, cross-platform mobile app for tracking physical activity, built with React Native and Expo.

## Overview

This app allows users to:
- Track daily steps and workouts
- View rankings and statistics
- Sign up, log in, and manage their profile
- Enjoy a modern UI with light and dark mode support

## Features
- **Expo Managed Workflow** for easy development and deployment
- **React Native** for cross-platform support (iOS & Android)
- **Dark Mode** and theming with a toggle in the settings
- **Step tracking** using device sensors (Pedometer API)
- **Authentication** (Sign up, Sign in, Profile management)
- **Workouts**: Add, view, and track workouts
- **API integration** with a backend server (see `api-spec.md`)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```sh
  npm install -g expo-cli
  ```

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd activity-tracker-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory. Example:
```
API_URL=http://<your-backend-ip>:3333/api
```
- For local development, use your machine's IP address for real device testing.

## Running the App
- Start the Expo development server:
  ```sh
  npm start
  ```
- Use the Expo Go app on your device, or an emulator/simulator, to run the app.

## Theming & Dark Mode
- The app supports both light and dark themes.
- Users can toggle dark mode in the Settings screen.
- All screens and components adapt to the selected theme.

## Troubleshooting
- **Theme errors**: Ensure your `ThemeProvider` and all theme usages are consistent (see `app/providers/ThemeProvider.tsx`).
- **API errors**: Check your `.env` and backend server status.
- **Step tracking**: On Android, mock data may be used if the device lacks a pedometer.
- **Dependencies**: Use npm (not yarn) for installing packages.

## Contributing
1. Fork the repo and create a feature branch.
2. Make your changes and commit with clear messages.
3. Push to your fork and open a pull request.

## License
MIT

---

For more details on API endpoints, see [`api-spec.md`](./api-spec.md).
