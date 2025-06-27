# CreatorSwap

CreatorSwap is a Web3 platform that creates individual AMM pools on Uniswap V4 for Zora-issued creator coins. The platform enables a "fan economy" rather than speculation, where purchases and trades trigger rewards and community engagement.

## 🌟 Features

- **Creator Coin Issuance**: UI for creators to easily issue custom tokens
- **Dedicated Pool Trading**: Auto-generation of Uniswap V4 pools per creator coin
- **Buyer Rewards**: beforeSwap/afterSwap hooks for NFT and URL distribution
- **Creator Dashboard**: Settings for trading fees and rewards configuration
- **Fan Community**: Tier system based on holdings and trading volume

## 🏗️ Architecture

```
User Interface
   ↓
CreatorSwap Frontend (Vite + React + Wagmi + viem + RainbowKit)
   ↓
Uniswap V4 Pools (Creator-specific)
   ↓
Hook Contracts
   ├─ beforeSwap: Zora API holder verification, gate checks
   └─ afterSwap: NFT reward minting, exclusive URL distribution
```

## 🛠️ Technology Stack

- **Frontend**: Vite + React + TypeScript
- **Blockchain Integration**: Wagmi, viem, RainbowKit
- **Smart Contracts**: Solidity, Foundry (Uniswap V4 hooks)
- **External SDKs**: Zora SDK for minting zora coins
- **Testing**: Vitest + React Testing Library + Playwright
- **Monorepo**: pnpm workspaces

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## 📁 Project Structure

```
project-root/
├─ package.json              # Root package.json with workspace scripts
├─ pnpm-workspace.yaml       # pnpm workspace configuration
├─ CLAUDE.md                 # Claude Code guidance
├─ apps/
│  └─ frontend/              # Frontend application
│     ├─ src/
│     │  ├─ components/      # React components
│     │  ├─ hooks/           # Custom React hooks
│     │  ├─ utils/           # Utility functions
│     │  ├─ types/           # TypeScript type definitions
│     │  └─ pages/           # Page components
│     ├─ package.json        # Frontend dependencies
│     └─ vite.config.ts      # Vite configuration
└─ packages/
   └─ contracts/             # Smart contracts (Uniswap V4 template fork)
      ├─ src/                # Contract source files
      │  ├─ hooks/           # Uniswap V4 hook contracts
      │  └─ interfaces/      # Contract interfaces
      ├─ test/               # Contract tests
      ├─ script/             # Deployment scripts
      ├─ foundry.toml        # Foundry configuration
      └─ package.json        # Contract package dependencies
```

## 🧪 Testing

This project follows Test-Driven Development (TDD) practices:

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Contract Tests**: Foundry (when implemented)

```bash
# Unit tests
pnpm --filter frontend test

# Watch mode for TDD
pnpm --filter frontend test:watch

# E2E tests
pnpm test:e2e

# Coverage report
pnpm --filter frontend test:coverage
```

## 🔧 Development Commands

```bash
# Install all dependencies
pnpm install

# Development server (frontend)
pnpm dev

# Build all packages
pnpm build

# Testing Commands
pnpm test                    # Run all unit/integration tests
pnpm test:e2e               # Run E2E tests with Playwright
pnpm test:e2e:ui            # Run E2E tests with Playwright UI

# Code Quality
pnpm lint                    # Lint all packages
pnpm format                  # Format code with Prettier
pnpm typecheck              # Type checking across all packages

# Clean build artifacts
pnpm clean
```

## 📋 Development Guidelines

### Test-Driven Development (TDD)

1. **Write tests first** before implementing features
2. **Red-Green-Refactor** cycle:
   - Red: Write a failing test
   - Green: Write minimal code to make it pass
   - Refactor: Improve code while keeping tests green

### Code Quality

- Use TypeScript throughout the project
- Follow React best practices with functional components and hooks
- Implement comprehensive testing for both frontend and smart contracts
- Ensure security best practices for Web3 interactions
- Use ESLint and Prettier for consistent code style

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your feature
4. Implement the feature following TDD practices
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.