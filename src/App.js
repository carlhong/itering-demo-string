import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import React, { useState, useEffect } from 'react';
import { Container, Dimmer, Loader, Image} from 'semantic-ui-react';
import './App.css';
import logo from './assets/logo.png';

import Transfer from './Transfer';
import 'semantic-ui-css/semantic.min.css'
import {CONFIG} from './Configure';

 export default function App () {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const WS_PROVIDER = CONFIG.ws;

  useEffect(() => {
    const provider = new WsProvider(WS_PROVIDER);

    ApiPromise.create({provider})
      .then((api) => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    keyring.loadAll({
      isDevelopment: true
    });
  },[]);



  const loader = function (text){
    return (
      <Dimmer active>
        <Loader size='small'>{text}</Loader>
      </Dimmer>
    );
  };

  if(!apiReady){
    return loader('Connecting to the blockchain')
  }

  return (
    <div className='ds-bg'>
      <Container className='ds-container'>
        <Image className='ds-logo' src={logo} size='small' />
        <Transfer
          api={api}
          keyring={keyring}
        />
      </Container>
    </div>
  );
}
