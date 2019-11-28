import React, { useState } from 'react';
import { Button, Dropdown, Form, Input, List } from 'semantic-ui-react';
import {u8aToString, hexToNumber} from '@polkadot/util'
export default function Transfer (props) {
  const { api, keyring } = props;
  const [status, setStatus] = useState('');
  const initialState = {
    addressFrom: '',
    amount: '0'
  };
  const [formState, setFormState] = useState(initialState);
  const [strArray, setStrArray] = useState([]);
  const [strCount, setStrCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const {addressFrom, amount } = formState;
  
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

  const queryDemoString = () => {
    Promise.all([
      api.query.demoString.ownedStringArray([addressFrom, amount]),
      api.query.demoString.ownedStringCount(addressFrom),
      api.query.demoString.stringCounts()
    ]).then((val)=> {
      setStatus('Completed');
      const [strArray, count, total] = val;
      setStrArray(strArray && u8aToString(strArray));
      setStrCount(count && hexToNumber(count.toHex()));
      setTotalCount(total && hexToNumber(total.toHex()));
    }).catch(console.error);
  };

  return (
    <>
      <h1>Query owned string array</h1>
      <Form>
        <Form.Field>
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
        </Form.Field>
        <Form.Field>
          <Input
            label='index'
            fluid
            onChange={onChange}
            state='amount'
            type='text'
            value={amount}
          />
        </Form.Field>
        <Form.Field>
          <Button
            onClick={queryDemoString}
            primary
            type='submit'
          >
            Send
          </Button>
          {status}
        </Form.Field>
      </Form>
      {status &&
        <List>
          <List.Item>The owned string array is: {strArray}</List.Item>
          <List.Item>The owned string count is: {strCount}</List.Item>
          <List.Item>The total string count is: {totalCount}</List.Item>
        </List>
      }
    </>
  );
}
