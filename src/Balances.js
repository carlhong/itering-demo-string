import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { u8aToU8a, u8aToString, u8aToHex } from '@polkadot/util'
export default function Balances (props) {
  const { api, keyring } = props;
  const accounts = keyring.getPairs();
  const addresses = accounts.map(account => account.address);
  const accountNames = accounts.map((account) => account.meta.name);
  const [balances, setBalances] = useState({});
  // const [ownedStringArray, setOwnedStringArray] = useState([]);
  // const [ownedStringCount, setOwnedStringCount] = useState(0);
  // const [someString, setSomeString] = useState('');
  // const [stringCounts, setStringCounts] = useState(0);
  useEffect(() => {
    let unsubscribeAll
    addresses.forEach(address => {
      api.query.demoString.ownedStringArray((address, u8aToHex(u8aToU8a(0)))).then((res)=> {
        // debugger;
        console.log(res);
        console.log(u8aToString(res));
      }).catch(console.error);
    });

    // api.query.demoString.ownedStringArray
    //   .multi(addresses, (currentBalances) => {
    //     console.log(currentBalances);
    //     debugger;
    //     const balancesMap = addresses.reduce((acc, address, index) => ({
    //       ...acc,
    //       [address]: currentBalances[index].toString()
    //     }), {});
    //     setBalances(balancesMap);
    //   })
    //   .then(unsub => { unsubscribeAll = unsub; })
    //   .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api.query.demoString.ownedStringArray, setBalances]);

  return (
    <>
      <h1>Balances</h1>
      <Table celled striped>
        <Table.Body>
          {addresses.map((address, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign='right'>{accountNames[index]}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell>{balances && balances[address]}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
