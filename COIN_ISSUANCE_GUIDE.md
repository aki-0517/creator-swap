# Coin Issuance Guide

This guide explains how to use the new coin issuance functionality in CreatorSwap.

## Features

- **Zora SDK Integration**: Uses the official Zora coins SDK for secure coin creation
- **Wallet Integration**: Connects with user's wallet for seamless transactions
- **Metadata Validation**: Validates metadata URIs before coin creation
- **Real-time Feedback**: Shows transaction status and error handling
- **Form Validation**: Client-side validation for all required fields

## How to Issue a Coin

1. **Connect Your Wallet**: Make sure your wallet is connected to the application
2. **Fill in Coin Details**:
   - **Ticker**: 3-5 character symbol (e.g., "MYCO")
   - **Coin Name**: Full name of your coin (e.g., "My Creator Coin")
   - **Description**: Optional description of your coin
   - **Metadata URI**: Link to JSON metadata (IPFS recommended)
3. **Configure Fee Receivers**: Set up addresses that will receive trading fees
4. **Click "Prepare Token"**: This validates your inputs and prepares the transaction
5. **Click "Issue Token"**: Executes the blockchain transaction

## Metadata URI Format

The metadata URI should point to a JSON file following this structure:

```json
{
  "name": "My Creator Coin",
  "description": "A coin for my creator community",
  "image": "ipfs://QmSomeImageHash",
  "external_url": "https://mywebsite.com",
  "attributes": [
    {
      "trait_type": "Creator",
      "value": "Artist Name"
    }
  ]
}
```

## Technical Details

- **Network**: Base (Ethereum L2)
- **Currency**: ZORA tokens by default
- **SDK**: @zoralabs/coins-sdk v0.2.4
- **Wallet**: Connected via Wagmi/RainbowKit

## Error Handling

The system provides clear error messages for:
- Wallet connection issues
- Invalid metadata URIs
- Transaction failures
- Network problems

## After Issuance

Once your coin is successfully issued, you'll receive:
- **Transaction Hash**: For tracking on the blockchain
- **Coin Address**: The contract address of your new token
- **Success Confirmation**: Visual confirmation of successful creation

## Testing

The coin issuance functionality includes comprehensive tests:
- Unit tests for the custom hook
- Form validation tests
- Error handling tests
- Mock wallet integration tests

Run tests with: `pnpm test src/hooks/useCoinIssuance.test.ts`