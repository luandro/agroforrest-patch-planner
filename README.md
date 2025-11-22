# AgroForrest Patch Planner

A comprehensive planning tool for designing and managing agroforestry systems in Brazil. This application helps users create, visualize, and manage agroforestry patches with intelligent species selection and spatial planning.

## Features

- **Interactive Patch Designer**: Visual canvas-based interface for creating and arranging agroforestry patches
- **Species Management**: Comprehensive database of Brazilian native and agricultural species
- **Intelligent Planning**: Automated suggestions for companion planting and spatial arrangements
- **Dashboard**: Track and manage multiple patches across your property
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

This project is built with modern web technologies:

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Vitest** - Unit testing framework

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/luandro/agroforrest-patch-planner.git

# Navigate to the project directory
cd agroforrest-patch-planner

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

## Project Structure

```
agroforrest-patch-planner/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   ├── stores/         # Zustand state stores
│   └── types/          # TypeScript type definitions
├── context/            # Architecture documentation
├── public/             # Static assets
└── ...config files
```

## Development

### Architecture Documentation

For detailed information about the codebase architecture, see:
- `AGENTS.md` - Contributor norms and quick reference
- `context/` - Module-specific documentation

### Testing

Run the test suite with:

```bash
npm test
```

Generate coverage reports:

```bash
npm run test:coverage
```

## Deployment

The application supports deployment to multiple platforms (Vercel, GitHub Pages, etc.) with automatic base path configuration.

### Base Path Configuration

The app uses the `VITE_BASE_PATH` environment variable to configure the base URL:
- **Vercel/Netlify**: Deploys at root `/` (default, no env var needed)
- **GitHub Pages**: Deploys at `/agroforrest-patch-planner/` (set `VITE_BASE_PATH=/agroforrest-patch-planner/`)

### GitHub Pages Deployment

Automatic deployment is configured via GitHub Actions. To enable:

1. Update `.github/workflows/deploy.yml` build step to include:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_BASE_PATH: /agroforrest-patch-planner/
```

2. Enable GitHub Pages in repository Settings → Pages → Source: "GitHub Actions"

The site will be available at: `https://luandro.github.io/agroforrest-patch-planner/`

### Vercel Deployment

No additional configuration needed. Simply connect your repository to Vercel and deploy.

### Manual Deployment

```bash
# Build for production (uses default base path '/')
npm run build

# Build for GitHub Pages
VITE_BASE_PATH=/agroforrest-patch-planner/ npm run build

# The dist/ folder contains the production-ready files
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass and coverage meets thresholds
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

[Add your license information here]

## Contact

For questions or support, please open an issue on GitHub.
