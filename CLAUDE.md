
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview - CreatorSwap

CreatorSwap is a Web3 platform that creates individual AMM pools on Uniswap V4 for Zora-issued creator coins. The platform enables a "fan economy" rather than speculation, where purchases and trades trigger rewards and community engagement.

## Architecture

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

## Core Features

1. **Creator Coin Issuance**: UI for creators to easily issue custom coins
2. **Dedicated Pool Trading**: Auto-generation of Uniswap V4 pools per creator coin
3. **Buyer Rewards**: beforeSwap/afterSwap hooks for NFT and URL distribution
4. **Creator Dashboard**: Settings for trading fees and rewards configuration
5. **Fan Community**: Tier system based on holdings and trading volume

## Technology Stack

- **Frontend**: Vite + React + TypeScript
- **Blockchain Integration**: Wagmi, viem, RainbowKit
- **Smart Contracts**: Solidity, Foundry (Uniswap V4 hooks)
- **External SDKs**: Zora SDK for minting zora coins

## Development Commands

This project uses pnpm workspaces for monorepo management and follows Test-Driven Development (TDD):

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
pnpm test:e2e:headed        # Run E2E tests in headed mode

# Frontend-specific testing
pnpm --filter frontend test          # Unit tests with Vitest
pnpm --filter frontend test:watch    # Watch mode for TDD
pnpm --filter frontend test:ui       # Vitest UI
pnpm --filter frontend test:coverage # Coverage report

# Code Quality
pnpm lint                    # Lint all packages
pnpm format                  # Format code with Prettier
pnpm format:check           # Check formatting
pnpm typecheck              # Type checking across all packages

# Clean build artifacts
pnpm clean

# Contract-specific commands (when contracts are set up)
pnpm contracts:compile
pnpm contracts:deploy
```

## Project Structure (Monorepo)

```
project-root/
├─ package.json              # Root package.json with workspace scripts
├─ pnpm-workspace.yaml       # pnpm workspace configuration
├─ CLAUDE.md                 # This file
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

## Smart Contract Architecture

The contracts package will be based on a forked Uniswap V4 template:

- **Hook Contracts**: Implement Uniswap V4 hooks for beforeSwap and afterSwap logic
- **Token Contracts**: Handle creator coin issuance and management
- **Reward Contracts**: Manage NFT minting and reward distribution
- **Integration**: Zora API integration for holder verification and gating

### Setting up Contracts

1. Fork the Uniswap V4 template repository
2. Clone the forked repository into `packages/contracts/`
3. Update the package.json to work with the monorepo structure
4. Ensure Foundry is installed for contract development and testing
5. Write contract tests first using Foundry's testing framework
6. Follow TDD approach for smart contract development

## Development Guidelines

### Test-Driven Development (TDD)

1. **Write tests first** before implementing features
2. **Red-Green-Refactor** cycle:
   - Red: Write a failing test
   - Green: Write minimal code to make it pass
   - Refactor: Improve code while keeping tests green

### Testing Strategy

- **Unit Tests**: Test individual functions/components with Vitest + React Testing Library
- **Integration Tests**: Test component interactions and hooks
- **Component Tests**: Test React components in isolation
- **E2E Tests**: Test complete user workflows with Playwright
- **Contract Tests**: Test smart contracts with Foundry (when implemented)

### Code Quality

- Use TypeScript throughout the project
- Follow React best practices with functional components and hooks
- Implement comprehensive testing for both frontend and smart contracts
- Ensure security best practices for Web3 interactions
- Keep dependencies updated to latest stable versions
- Use ESLint and Prettier for consistent code style
- Write meaningful test descriptions and organize tests logically

### Testing Files Structure

```
apps/frontend/src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── ...
├── hooks/
│   ├── useWallet.ts
│   └── useWallet.test.ts
└── test/
    └── setup.ts

e2e/
├── auth.spec.ts
├── trading.spec.ts
└── wallet-connection.spec.ts
```

### CI/CD

- GitHub Actions workflow runs on every PR and push
- All tests must pass before merging
- Code quality checks (lint, format, typecheck) are enforced
- Claude Code analysis provides automated code review
