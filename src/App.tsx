import '@mysten/dapp-kit/dist/index.css'
import { Route, Switch } from 'wouter'

import './App.css'
import { Providers } from './components/layout/Providers.tsx'
import { Authn } from './components/pages/Authn.tsx'
import { Debug } from './components/pages/Debug.tsx'
import { HomeFeed } from './components/pages/HomeFeed.tsx'
import { Upload } from './components/pages/upload.tsx'
import Record from './components/pages/record.tsx'
// import WebcamImage from './components/pages/test.tsx'

function App() {
  return (
    <Providers>
      <Switch>
        <Route path="/" component={HomeFeed} />
        <Route path="/login" component={Authn} />
        <Route path="/upload" component={Upload} />
        <Route path="/record/:id" component={Record} />
        <Route path="/debug" component={Debug} />
      </Switch>
    </Providers>
  )
}

export default App
