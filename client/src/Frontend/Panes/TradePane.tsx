import { getPlanetName } from '@dfares/procedural';
import { ModalName } from '@dfares/types';
import React from 'react';
import styled from 'styled-components';
import { Section, SectionHeader, Spacer } from '../Components/CoreUI';
import { useAccount, usePlayer, useSelectedPlanet, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane';
import { PlanetLink } from '../Views/PlanetLink';
import { BuyPlanetPane } from './BuyPlanetPane';
import { BuySpaceshipPane } from './BuySpaceshipPane';
import { PlanetThumb } from './PlanetDexPane';

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
  const selectedPlanet = useSelectedPlanet(uiManager).value;

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
        <Section>
          <SectionHeader>Basic Info</SectionHeader>
          <Row>
            <span>Public Key</span>
            <span>{account}</span>
          </Row>

          <Row>
            <span> Selected Planet</span>
            <span>
              {selectedPlanet ? (
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  &nbsp;
                  <PlanetThumb planet={selectedPlanet} />
                  <PlanetLink planet={selectedPlanet}>{getPlanetName(selectedPlanet)}</PlanetLink>
                </span>
              ) : (
                <span>{'(none)'}</span>
              )}
            </span>
          </Row>
        </Section>

        <BuyPlanetPane />
        <BuySpaceshipPane />
      </TradeContent>
    </ModalPane>
  );
}
