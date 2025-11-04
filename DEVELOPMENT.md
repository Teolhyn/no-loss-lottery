# Scaffold Stellar Frontend

Built using Stellar Scaffold - A modern, up-to-date toolkit for building Stellar smart contract frontends.

- ⚡️ Vite + React + TypeScript
- 🔗 Auto-generated contract clients
- 🧩 Example components for contract interaction
- 🛠 Hot reload for contract changes
- 🧪 Easy local/testnet deployment

## Requirements

Before getting started, make sure you’ve met the requirements listed in the [Soroban documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) and that the following tools are installed :

- [Rust](https://www.rust-lang.org/tools/install)
- [Cargo](https://doc.rust-lang.org/cargo/) (comes with Rust)
- Rust target: install the compilation target listed in the [Soroban setup guide](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- [Node.js](https://nodejs.org/en/download/package-manager) (v22, or higher)
- [npm](https://www.npmjs.com/): Comes with the node installer or can also be installed package managers such as Homebrew, Chocolatey, apt, etc.
- [Stellar CLI](https://github.com/stellar/stellar-core)
- [Scaffold Stellar CLI Plugin](https://github.com/AhaLabs/scaffold-stellar)

## Quick Start

1. Set up your development environment:

```bash
# Copy and configure environment variables like network and STELLAR_SCAFFOLD_ENV
cp .env.example .env

# Install frontend dependencies
npm install
```

Have a look at `environments.toml` for more fined-grained control.

2. Start development environment:

```bash
npm run dev
```

Open the server URL in your web browser.

3. For testnet/mainnet deployment:

When you are ready for testnet, you need to deploy your contract using
`stellar registry`. Some commands to get you started.

```bash
#  Note --source-account argument is omitted for clarity

# First publish your contract to the registry
stellar registry publish

# Then deploy an instance with constructor parameters
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --param1 value1

# Can access the help docs with --help
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --help

# Install the deployed contract locally
stellar registry create-alias my-contract
```

## Project Structure

```
no-loss-lottery/        # Project root
├── contracts/                   # Example smart contracts
│   ├── no-loss-lottery/         # Smart contract code
│   ├── wasm/              # Wasm file of blend pool for client import
├── packages/                    # Auto-generated TypeScript clients
├── public/                      # Public files
├── src/                         # Frontend React application
│   ├── components/              # React components
│   ├── contracts/               # Contract interaction helpers
│   ├── debug/                   # Debugging contract explorer
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # App Pages
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── target/                      # Build artifacts and WASM files
├── environments.toml            # Environment configurations
├── package.json                 # Frontend dependencies
└── .env                         # Local environment variables
```

This template provides a ready-to-use frontend application with example smart contracts and their TypeScript clients. You can use these as reference while building your own contracts and UI. The frontend is set up with Vite, React, and includes basic components for interacting with the contracts.
