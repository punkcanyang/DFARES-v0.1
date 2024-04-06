import { weiToEth } from '@dfares/network';
import { ModalName } from '@dfares/types';
import { BigNumber } from 'ethers';
import React from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { EmSpacer, Section, SectionHeader, Spacer } from '../Components/CoreUI';
import { MythicLabelText } from '../Components/Labels/MythicLabel';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';
import { useEmitterValue } from '../Utils/EmitterHooks';
import { ModalPane } from '../Views/ModalPane';
import { BuyPlanetPane } from './BuyPlanetPane';
import { BuySpaceshipPane } from './BuySpaceshipPane';

const TradeContent = styled.div`
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

function HelpContent() {
  //  todo
  return (
    <div>
      <p>Trade everything.</p>
      <Spacer height={8} />
      <p>wait to add ...</p>
    </div>
  );
}

export function TradePane({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const uiManager = useUIManager();

  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;
  const balanceEth = weiToEth(
    useEmitterValue(uiManager.getEthConnection().myBalance$, BigNumber.from('0'))
  );

  if (!account || !player) return <></>;

  const disabled_1 = balanceEth < 0.001;
  const disabled_2 = balanceEth < 0.01;
  const disabled_3 = balanceEth < 0.1;
  const disabled_4 = balanceEth < 1;
  const disabled_5 = balanceEth < 10;
  const disabled_6 = balanceEth < 100;

  return (
    <ModalPane
      id={ModalName.Trade}
      title={'Trade'}
      visible={visible}
      onClose={onClose}
      helpContent={HelpContent}
    >
      <TradeContent>
        <Section>
          <SectionHeader>Donation </SectionHeader>
          <Row>
            <MythicLabelText text={'Thanks for supporting our development!'} />
          </Row>
          {/* <Row>
            <span>My Balance </span>
            <span>
              {balanceEth} ${TOKEN_NAME}
            </span>
          </Row> */}
          <EmSpacer height={1} />
          <Btn disabled={disabled_1} onClick={() => uiManager.donate(1)}>
            donate 0.001 ETH
          </Btn>{' '}
          <Btn disabled={disabled_2} onClick={() => uiManager.donate(10)}>
            donate 0.01 ETH
          </Btn>{' '}
          <Btn disabled={disabled_3} onClick={() => uiManager.donate(100)}>
            donate 0.1 ETH
          </Btn>
          <EmSpacer height={1} />
          <Btn disabled={disabled_4} onClick={() => uiManager.donate(1000)}>
            donate 1 ETH
          </Btn>{' '}
          <Btn disabled={disabled_5} onClick={() => uiManager.donate(10000)}>
            donate 10 ETH
          </Btn>{' '}
          <Btn disabled={disabled_6} onClick={() => uiManager.donate(100000)}>
            donate 100 ETH
          </Btn>{' '}
        </Section>
        <BuyPlanetPane />
        <BuySpaceshipPane />
      </TradeContent>
    </ModalPane>
  );
}
