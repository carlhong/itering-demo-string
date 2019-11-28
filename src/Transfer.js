import React, { useState } from 'react';
import { Button, Dropdown, Form, Input } from 'semantic-ui-react';
import { u8aToU8a, u8aToHex } from '@polkadot/util'
export default function Transfer (props) {
  const { api, keyring } = props;
  const [status, setStatus] = useState('');
  const initialState = {
    addressFrom: '',
    addressTo: '',
    amount: ''
  };
  const [formState, setFormState] = useState(initialState);
  const { addressTo, addressFrom, amount } = formState;
  
  // get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  const addDemoString = () => {
    let address;
    if (!(keyringOptions && keyringOptions[0])) {
      return;
    }
    address = keyringOptions[0]['value'];
    const fromPair = keyring.getPair(address);

    setStatus('状态：发送中');
    api.tx.demoString
    .doSomestring(u8aToHex(u8aToU8a(amount)))
    .signAndSend(fromPair, ({ status }) => {
        if (status.isFinalized) {
        // setStatus(`Completed at block hash #${status.asFinalized.toString()}`);
        setStatus(`状态：已完成 #${status.asFinalized.toString()}`);
        } else {
        // setStatus(`Current transfer status: ${status.type}`);
        setStatus('状态：广播中');
        }
    }).catch((e) => {
        setStatus(':( transaction failed');
        console.error('ERROR:', e);
    });
  };

  return (
    <>
      <Form className='ds-form'>
        {/* <Form.Field>
          <Dropdown
            placeholder='Select from  your accounts'
            fluid
            label="From"
            onChange={onChange}
            search
            selection
            state='addressFrom'
            options={keyringOptions}
            value={addressFrom}
          />
        </Form.Field> */}
        <Form.Field>
            <Input 
              type='text'
              fluid
              state='amount'
              onChange={onChange}
              value={amount}
            >
              <input />
              <Button type='submit' primary onClick={addDemoString} >Send</Button>
            </Input>
        </Form.Field>
        <Form.Field>
          <div className='ds-status'>
            {status}
          </div>
        </Form.Field>
      </Form>
    </>
  );
}
