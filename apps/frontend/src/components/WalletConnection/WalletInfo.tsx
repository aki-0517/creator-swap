import { useAccount, useBalance, useDisconnect } from 'wagmi'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { disconnect } = useDisconnect()

  if (!isConnected || !address) {
    return null
  }

  return (
    <div className="wallet-info">
      <div className="wallet-details">
        <p>
          <strong>Address:</strong> {address}
        </p>
        {balance && (
          <p>
            <strong>Balance:</strong> {balance.formatted} {balance.symbol}
          </p>
        )}
      </div>
      <button
        onClick={() => disconnect()}
        className="btn btn-outline"
        style={{ marginTop: '8px' }}
      >
        Disconnect
      </button>
    </div>
  )
}