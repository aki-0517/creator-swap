import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Button } from './components/Button/Button'
import { WalletButton, WalletInfo } from './components/WalletConnection'
import { useAccount } from 'wagmi'

function App() {
  const [count, setCount] = useState(0)
  const { isConnected } = useAccount()

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>CreatorSwap</h1>
      <div className="card">
        <div className="wallet-section">
          <WalletButton />
        </div>
        
        {isConnected && (
          <div style={{ marginTop: '20px' }}>
            <WalletInfo />
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => setCount(count => count + 1)} variant="secondary">
            Demo Counter
          </Button>
          <p>count is {count}</p>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App