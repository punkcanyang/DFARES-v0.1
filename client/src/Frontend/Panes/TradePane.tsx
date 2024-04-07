import { ModalName } from '@dfares/types';
import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../Components/CoreUI';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane';
import { BuyPlanetPane } from './BuyPlanetPane';
import { BuySpaceshipPane } from './BuySpaceshipPane';
import { DonationPane } from './DonationPane';

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

  if (!account || !player) return <></>;

  return (
    <ModalPane
      id={ModalName.Trade}
      title={'Trade'}
      visible={visible}
      onClose={onClose}
      helpContent={HelpContent}
    >
      <TradeContent>
        <DonationPane />
        <BuyPlanetPane />
        <BuySpaceshipPane />
      </TradeContent>
    </ModalPane>
  );
}
