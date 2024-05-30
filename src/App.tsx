import '@mysten/dapp-kit/dist/index.css'
import { Route, Switch } from 'wouter'

import './App.css'
import { Providers } from './components/layout/Providers.tsx'
import { Authn } from './components/pages/Authn.tsx'
import { HomeFeed } from './components/pages/HomeFeed.tsx'

function App() {
  return (
    <Providers>
      <Switch>
        <Route path="/" component={HomeFeed} />
        <Route path="/login" component={Authn} />
      </Switch>
    </Providers>
  )
}

export default App