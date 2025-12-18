# Cornerstone

A modern full-stack monorepo built with **Nx**, featuring an **Angular 21** frontend and **NestJS 11** backend.

## 🏗️ Project Structure

```
cornerstone/
├── apps/
│   ├── frontend/          # Angular 21 application
│   ├── frontend-e2e/      # Cypress e2e tests for frontend
│   ├── backend/           # NestJS 11 API server
│   └── backend-e2e/       # Jest e2e tests for backend
├── nx.json                # Nx workspace configuration
├── package.json           # Dependencies and scripts
└── tsconfig.base.json     # Base TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x

### Installation

```bash
# Clone the repository
git clone git@github.com:shreyashrajiokalaskar/cornerstone.git

# Navigate to project directory
cd cornerstone

# Install dependencies
npm install
```

## 📦 Available Commands

### Development

```bash
# Start frontend dev server (default: http://localhost:4200)
npx nx serve frontend

# Start backend dev server (default: http://localhost:3000)
npx nx serve backend

# Start both frontend and backend
npx nx run-many -t serve -p frontend backend
```

### Build

```bash
# Build frontend for production
npx nx build frontend

# Build backend for production
npx nx build backend

# Build all projects
npx nx run-many -t build
```

### Testing

```bash
# Run frontend unit tests
npx nx test frontend

# Run backend unit tests
npx nx test backend

# Run all unit tests
npx nx run-many -t test

# Run frontend e2e tests
npx nx e2e frontend-e2e

# Run backend e2e tests
npx nx e2e backend-e2e
```

### Linting

```bash
# Lint frontend
npx nx lint frontend

# Lint backend
npx nx lint backend

# Lint all projects
npx nx run-many -t lint
```

### Formatting

```bash
# Check formatting
npx nx format:check

# Fix formatting
npx nx format:write
```

## 🛠️ Tech Stack

### Frontend

- **Angular 21** - Modern web framework
- **RxJS 7.8** - Reactive programming
- **SCSS** - CSS preprocessor
- **Jest** - Unit testing
- **Cypress** - E2E testing

### Backend

- **NestJS 11** - Node.js framework
- **Express** - HTTP server
- **Jest** - Unit & E2E testing

### Tooling

- **Nx 22** - Monorepo management & build system
- **TypeScript 5.9** - Type safety
- **ESLint 9** - Code linting
- **Prettier** - Code formatting
- **Webpack** - Module bundler

## 📊 Nx Graph

Visualize project dependencies:

```bash
npx nx graph
```

## 🔧 Configuration

### Environment Variables

Create environment-specific configurations as needed in the respective app directories.

### Ports

| Service  | Default Port |
| -------- | ------------ |
| Frontend | 4200         |
| Backend  | 3000         |

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Shreyash Kalaskar**
📧 shreyashrajiokalaskar@gmail.com
