import { TOKEN_NAME } from '@dfares/constants';
import { weiToEth } from '@dfares/network';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Sub } from '../Components/Text';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';
import { useEmitterValue } from '../Utils/EmitterHooks';

const UnionCreateContent = styled.div`
  width: 500px;
  height: 600px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* text-align: justify; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  & > span:first-child {
    flex-grow: 1;
  }
`;

export function UnionCreatePane() {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();
  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unionCreateFee, setUnionCreateFee] = useState(0);

  const balanceEth = weiToEth(
    useEmitterValue(uiManager.getEthConnection().myBalance$, BigNumber.from('0'))
  );

  const getUnionCreateFee = async () => {
    const unionCreatFee = await gameManager.getUnionCreationFee();
    return weiToEth(unionCreatFee);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const fee = await getUnionCreateFee();
        setUnionCreateFee(fee);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uiManager]);

  if (!account || !player) return <></>;

  // todo: add loading effect
  if (loading) return <>loading ... </>;
  if (error) return <div>{error}</div>;

  return (
    <UnionCreateContent>
      <div>
        <Sub> Creation Cost: </Sub>
        <span>
          {unionCreateFee} ${TOKEN_NAME}
        </span>
      </div>

      <div>
        <Sub>Current Balance: </Sub>
        <span>
          {balanceEth} ${TOKEN_NAME}
        </span>
      </div>
    </UnionCreateContent>
  );
}
