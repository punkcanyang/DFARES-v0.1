import { Union } from '@dfares/types';
import React from 'react';
import styled from 'styled-components';
import GameUIManager from '../../Backend/GameLogic/GameUIManager';
import { AlignCenterHorizontally, EmSpacer, SpreadApart } from '../Components/CoreUI';
import dfstyles, { snips } from '../Styles/dfstyles';

export const UnionDetailSection = styled.div`
  padding: 0.5em 0;

  &:first-child {
    margin-top: -8px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UnionInfoContent = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

const InfoHead = styled.div`
  text-align: left;
  font-size: 120%;
  font-weight: bold;
  color: yellow;
`;

const ElevatedContainer = styled.div`
  ${snips.roundedBordersWithEdge}
  border-color: ${dfstyles.colors.borderDarker};
  background-color: ${dfstyles.colors.backgroundlight};
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 100%;
`;

const StatRow = styled(AlignCenterHorizontally)`
  ${snips.roundedBorders}
  display: inline-block;
  box-sizing: border-box;
  width: 100%;

  /* Set the Icon color to something a little dimmer */
  --df-icon-color: ${dfstyles.colors.subtext};
`;

const HalfRow = styled.div`
  border: 1px solid ${dfstyles.colors.borderDarker};
  border-top: none;
  border-left: none;
  width: 50%;
`;

const LeaderRow = styled.div`
  border: 1px solid ${dfstyles.colors.borderDarker};
  border-top: none;
  display: flex;
  /* flex-direction: row;
  justify-content: space-between; */
  align-items: center;
  width: 100%;
`;

export const UnionInfoPane: React.FC<{ union: Union; uiManager: GameUIManager }> = ({
  union,
  uiManager,
}) => {
  return (
    <UnionInfoContent>
      <InfoHead>
        {union.name && union.name.length !== 0
          ? '✨✨✨ ' + union.name.toUpperCase() + ' UNION (ID:' + union.unionId + ') ✨✨✨'
          : '✨✨✨ ANONYMOUS UNION (ID:' + union.unionId + ') ✨✨✨'}
      </InfoHead>

      <ElevatedContainer>
        <StatRow>
          <SpreadApart>
            <HalfRow>
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={1} />
                  Level
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  {union.level}
                  <EmSpacer width={1} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </HalfRow>
            <HalfRow>
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={1} />
                  Max Level
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  3
                  <EmSpacer width={1} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </HalfRow>
          </SpreadApart>
        </StatRow>

        <StatRow>
          <SpreadApart>
            <HalfRow>
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={1} />
                  Members Total
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  {union.members.length}
                  <EmSpacer width={1} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </HalfRow>
            <HalfRow>
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={1} />
                  Memebers Max
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  {uiManager.getMaxMembers(union.level)}
                  <EmSpacer width={1} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </HalfRow>
          </SpreadApart>
        </StatRow>

        <LeaderRow>
          <SpreadApart>
            <AlignCenterHorizontally>
              <EmSpacer width={1} /> Leader
            </AlignCenterHorizontally>
            <AlignCenterHorizontally>
              {union.leader} <EmSpacer width={1} />
            </AlignCenterHorizontally>
          </SpreadApart>
        </LeaderRow>

        {union.members.length > 1 && (
          <StatRow>
            <ul>
              {union.members
                .filter((member) => member !== union.leader)
                .map((member, i) => (
                  <li key={member}>
                    <SpreadApart>
                      <AlignCenterHorizontally>
                        <EmSpacer width={1} /> Member #{i + 1}
                      </AlignCenterHorizontally>
                      <AlignCenterHorizontally>
                        {member}
                        <EmSpacer width={1} />
                      </AlignCenterHorizontally>
                    </SpreadApart>
                  </li>
                ))}
            </ul>
          </StatRow>
        )}
      </ElevatedContainer>
    </UnionInfoContent>
  );
};
