# Deployment Guide

This guide explains how to deploy the No Loss Lottery to Testnet and Mainnet.

## Overview

The project uses two separate CI/CD workflows:

1. **Development Workflow** (`development` branch): Builds contracts and runs tests
2. **Production Workflow** (`main` branch): Deploys frontend to GitHub Pages using pre-deployed contract IDs

## Workflow Structure

### Development Workflow (`.github/workflows/node.yml`)

**Triggers:** Push or PR to `development` branch

**What it does:**

- Sets up Stellar Quickstart (local network)
- Builds and deploys contracts (creates new contract IDs each time)
- Generates TypeScript clients
- Runs linting, formatting checks, and tests
- Builds frontend

**Note:** This workflow does NOT deploy to GitHub Pages. It's for testing contract changes and ensuring everything builds correctly.

### Production Workflow (`.github/workflows/deploy-production.yml`)

**Triggers:** Push to `main` branch

**What it does:**

- Uses pre-generated contract clients from the repository
- Sets contract IDs from GitHub Secrets
- Builds frontend with production configuration
- Runs linting, formatting checks, and tests
- Deploys to GitHub Pages

**Note:** This workflow does NOT build or deploy contracts. Contracts must be deployed manually first.

---

## Required GitHub Secrets

Configure these in your repository: **Settings → Secrets and variables → Actions → New repository secret**

### Network Configuration

| Secret Name                         | Description          | Example (Testnet)                     | Example (Mainnet)                                         |
| ----------------------------------- | -------------------- | ------------------------------------- | --------------------------------------------------------- |
| `PUBLIC_STELLAR_NETWORK`            | Network identifier   | `TESTNET`                             | `PUBLIC`                                                  |
| `PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Network passphrase   | `Test SDF Network ; September 2015`   | `Public Global Stellar Network ; September 2015`          |
| `PUBLIC_STELLAR_RPC_URL`            | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` | `https://mainnet.stellar.validationcloud.io/v1/<API_KEY>` |
| `PUBLIC_STELLAR_HORIZON_URL`        | Horizon API endpoint | `https://horizon-testnet.stellar.org` | `https://horizon.stellar.org`                             |

### Asset Configuration

| Secret Name                | Description         | Example (Testnet)                                          | Example (Mainnet)                                          |
| -------------------------- | ------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `PUBLIC_USDC_ASSET_CODE`   | USDC asset code     | `USDC`                                                     | `USDC`                                                     |
| `PUBLIC_USDC_ASSET_ISSUER` | USDC issuer address | `GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56` | `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` |

### Contract IDs

| Secret Name                          | Description                               | How to Get                              |
| ------------------------------------ | ----------------------------------------- | --------------------------------------- |
| `PUBLIC_NO_LOSS_LOTTERY_CONTRACT_ID` | Deployed No Loss Lottery contract address | See "Deploying Contracts" section below |

---

## Deploying to Testnet

### Step 1: Update `environments.toml`

Ensure your `environments.toml` has the correct testnet configuration:

```toml
[development.network]
rpc-url = "https://soroban-testnet.stellar.org"
network-passphrase = "Test SDF Network ; September 2015"

[[development.accounts]]
name = "me"
default = true

[development.contracts.no_loss_lottery]
client = true
constructor_args = """
--admin <YOUR_TESTNET_ADMIN_ADDRESS>
--token <TESTNET_USDC_CONTRACT>
--ticket_amount 100000000
--blend_address <TESTNET_BLEND_POOL>
"""
```

**Replace:**

- `<YOUR_TESTNET_ADMIN_ADDRESS>`: Your Stellar public key for admin functions
- `<TESTNET_USDC_CONTRACT>`: USDC contract on testnet (likely `CAP5AMC2OHNVREO66DFIN6DHJMPOBAJ2KCDDIMFHN3QUCSZEXOWOPARMONX6T65`)
- `<TESTNET_BLEND_POOL>`: Blend pool address on testnet

### Step 2: Deploy Contract Locally

```bash
# Make sure you're using testnet in your local .env
STELLAR_SCAFFOLD_ENV=development stellar-scaffold build --build-clients

# Your contract ID will be saved in .config/stellar/contract-ids/no_loss_lottery.json
# and in packages/no_loss_lottery/src/index.ts
```

### Step 3: Get Contract ID

```bash
# View the deployed contract ID
cat .config/stellar/contract-ids/no_loss_lottery.json
```

Or check `packages/no_loss_lottery/src/index.ts` at line 37:

```typescript
export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDMBVXXC44LZDBDYGWR3SXNGSOR7AROQ2STR6IR7S465IHRFV2DKQCFF",
  },
};
```

### Step 4: Commit Generated Clients

```bash
git add packages/no_loss_lottery/
git commit -m "chore: update testnet contract clients"
git push origin development
```

### Step 5: Configure GitHub Secrets

Add the following secrets to your repository (for testnet deployment):

```
PUBLIC_STELLAR_NETWORK=TESTNET
PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
PUBLIC_USDC_ASSET_CODE=USDC
PUBLIC_USDC_ASSET_ISSUER=GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56
PUBLIC_NO_LOSS_LOTTERY_CONTRACT_ID=<YOUR_DEPLOYED_CONTRACT_ID>
```

### Step 6: Deploy to GitHub Pages

```bash
# Merge development to main to trigger production deployment
git checkout main
git merge development
git push origin main
```

The production workflow will automatically deploy to GitHub Pages.

---

## Deploying to Mainnet

### Step 1: Create Production Environment in `environments.toml`

Add a production configuration:

```toml
[production.network]
rpc-url = "https://mainnet.stellar.validationcloud.io/v1/<YOUR_API_KEY>"
network-passphrase = "Public Global Stellar Network ; September 2015"

[[production.accounts]]
name = "mainnet-deployer"
default = true

[production.contracts.no_loss_lottery]
client = true
constructor_args = """
--admin <MAINNET_ADMIN_ADDRESS>
--token <MAINNET_USDC_CONTRACT>
--ticket_amount 100000000
--blend_address <MAINNET_BLEND_POOL>
"""
```

**Important Mainnet Values:**

- **Mainnet USDC Contract:** `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`
- **Mainnet USDC Issuer (Classic):** `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`
- **Admin Address:** Your secure mainnet admin wallet address
- **Blend Pool:** Check [Blend Protocol](https://blend.capital/) for mainnet pool addresses

### Step 2: Generate Mainnet Deployment Account

```bash
# Generate a dedicated mainnet deployer account
stellar keys generate mainnet-deployer --network mainnet

# Fund it with XLM for deployment fees (you'll need to send XLM from another wallet)
stellar keys address mainnet-deployer

# Create the identity file
mkdir -p .config/stellar/identity
stellar keys show mainnet-deployer > .config/stellar/identity/mainnet-deployer.toml
```

### Step 3: Deploy Contract to Mainnet

```bash
# Deploy to mainnet (make sure you have sufficient XLM in deployer account)
STELLAR_SCAFFOLD_ENV=production stellar-scaffold build --build-clients

# Get the mainnet contract ID
cat .config/stellar/contract-ids/no_loss_lottery.json
```

### Step 4: Test Contract on Mainnet

Before going live, thoroughly test all contract functions:

```bash
# Test buying a ticket
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source mainnet-deployer \
  --network mainnet \
  -- buy_ticket \
  --user <YOUR_WALLET_ADDRESS>

# Test other functions...
```

### Step 5: Update GitHub Secrets for Mainnet

Update all secrets to use mainnet values:

```
PUBLIC_STELLAR_NETWORK=PUBLIC
PUBLIC_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
PUBLIC_STELLAR_RPC_URL=https://mainnet.stellar.validationcloud.io/v1/<API_KEY>
PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org
PUBLIC_USDC_ASSET_CODE=USDC
PUBLIC_USDC_ASSET_ISSUER=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
PUBLIC_NO_LOSS_LOTTERY_CONTRACT_ID=<MAINNET_CONTRACT_ID>
```

### Step 6: Commit and Deploy

```bash
# Commit mainnet contract clients
git add packages/no_loss_lottery/
git commit -m "chore: update mainnet contract clients"
git push origin development

# Merge to main for production deployment
git checkout main
git merge development
git push origin main
```

---

## Updating Contracts (Re-deployment)

If you need to update the contract code:

### For Testnet

1. Make changes to contract code in `contracts/no-loss-lottery/`
2. Deploy locally: `STELLAR_SCAFFOLD_ENV=development stellar-scaffold build --build-clients`
3. Get new contract ID from `.config/stellar/contract-ids/no_loss_lottery.json`
4. Commit updated clients: `git add packages/ && git commit -m "chore: update contract"`
5. Update `PUBLIC_NO_LOSS_LOTTERY_CONTRACT_ID` secret in GitHub with new ID
6. Push to main to deploy updated frontend

### For Mainnet

⚠️ **Warning:** Mainnet contract updates should be done carefully and tested thoroughly on testnet first.

1. Test changes extensively on testnet
2. Deploy to mainnet: `STELLAR_SCAFFOLD_ENV=production stellar-scaffold build --build-clients`
3. Test the new mainnet contract thoroughly
4. Update GitHub secret with new contract ID
5. Deploy frontend update

**Note:** Users with tickets in the old contract will need to redeem them before you can fully migrate to the new contract.

---

## Troubleshooting

### Contract deployment fails

- Ensure you have sufficient XLM in your deployment account
- Verify RPC URL is correct and accessible
- Check that constructor args match the network (testnet vs mainnet addresses)

### Frontend shows wrong contract

- Verify `PUBLIC_NO_LOSS_LOTTERY_CONTRACT_ID` secret is set correctly
- Check that the contract clients in `packages/` are committed
- Clear browser cache and try again

### GitHub Pages deployment fails

- Ensure GitHub Pages is enabled in repository settings
- Verify all required secrets are set
- Check workflow logs for specific errors

### "Contract not found" error

- Contract ID may be incorrect
- Contract may not be deployed to the network you're using
- RPC URL may be pointing to wrong network

---

## Security Best Practices

1. **Never commit private keys or seed phrases** to the repository
2. **Use GitHub Environment Secrets** for mainnet (requires approval)
3. **Test thoroughly on testnet** before deploying to mainnet
4. **Keep deployment account secure** - consider using a hardware wallet for mainnet
5. **Monitor contract activity** after deployment
6. **Have a migration plan** for contract updates

---

## Support

For issues or questions:

- Open an issue on GitHub
- Check Stellar Discord: https://discord.gg/stellar
- Review Stellar docs: https://developers.stellar.org/
