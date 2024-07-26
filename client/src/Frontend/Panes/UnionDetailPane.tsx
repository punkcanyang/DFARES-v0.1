import { weiToEth } from '@dfares/network';
import { EthAddress, Union, UnionId } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import {
  AlignCenterHorizontally,
  EmSpacer,
  SectionHeader,
  SpreadApart,
} from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { Row } from '../Components/Row';
import { TextPreview } from '../Components/TextPreview';
import { formatDuration } from '../Components/TimeUntil';
import dfstyles, { snips } from '../Styles/dfstyles';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';

const UnionDetailContent = styled.div`
  width: 600px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* text-align: justify; */
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 1em;
`;

export const UnionDetailSection = styled.div`
  padding: 0.5em 0;

  &:first-child {
    margin-top: -8px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* Set the spacing between buttons */
  margin-top: 0.5em;
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

const LeftRow = styled.div`
  border: 1px solid ${dfstyles.colors.borderDarker};
  border-top: none;
  border-left: none;
  width: 50%;
`;

const UnionInfoComponent: React.FC<{ union: Union }> = ({ union }) => {
  return (
    <UnionInfoContent>
      <InfoHead>
        {union.name && union.name.length !== 0
          ? '✨✨✨ ' + union.name.toUpperCase() + ' UNION ✨✨✨'
          : '✨✨✨ ANONYMOUS UNION ✨✨✨'}
      </InfoHead>

      <ElevatedContainer>
        <StatRow>
          <SpreadApart>
            <LeftRow>
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={1} />
                  Union ID
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  {union.unionId}
                  <EmSpacer width={1} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </LeftRow>
            <div
              style={{
                border: `1px solid ${dfstyles.colors.borderDarker}`,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                width: '50%',
              }}
            >
              <SpreadApart>
                <AlignCenterHorizontally>
                  <EmSpacer width={0.5} />
                  Members Total
                </AlignCenterHorizontally>
                <AlignCenterHorizontally>
                  {union.members.length}
                  <EmSpacer width={0.5} />
                </AlignCenterHorizontally>
              </SpreadApart>
            </div>
          </SpreadApart>
        </StatRow>
        <StatRow> </StatRow>
        <StatRow> </StatRow>
        <StatRow> </StatRow>
      </ElevatedContainer>

      <div>
        <span>
          <strong>Union ID:</strong> {union.unionId}
        </span>
        <span>
          <strong>Level:</strong> {union.level}
        </span>
      </div>

      <p>
        <strong>Leader:</strong> {union.leader}
      </p>

      <h2>Members:</h2>
      <ul>
        {union.members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
      <h2>Invitees:</h2>
      <ul>
        {union.invitees.map((invitee) => (
          <li key={invitee}>{invitee}</li>
        ))}
      </ul>
      <h2>Applicants:</h2>
      <ul>
        {union.applicants.map((applicant) => (
          <li key={applicant}>{applicant}</li>
        ))}
      </ul>
    </UnionInfoContent>
  );
};

type SetStateFunction = (value: string) => void;

export function UnionDetailPane({
  _unionId,
  setActiveFrame,
}: {
  _unionId: UnionId;
  setActiveFrame: SetStateFunction;
}) {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();
  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;

  const [union, setUnion] = useState<Union>();
  const [isProcessing, setIsProcessing] = useState(false);

  const [unionRejoinCooldown, setUnionRejoinCooldown] = useState<number>();
  const [levelupUnionFee, setLevelupUnionFee] = useState<number>();

  useEffect(() => {
    if (!uiManager) return;
    const unionId = _unionId;
    const union = uiManager.getUnion(unionId);
    setUnion(union);
  }, [_unionId, uiManager]);

  // fetch configs
  useEffect(() => {
    const fetchConfig = async () => {
      if (!union) return;
      const rawCooldown = await gameManager.getContractAPI().getUnionRejoinCooldown();
      const cooldown = rawCooldown.toNumber();
      setUnionRejoinCooldown(cooldown);
      const rawFee = await gameManager.getContractAPI().getLevelUpUnionFee(union.level + 1);
      const fee = weiToEth(rawFee);
      setLevelupUnionFee(fee);
    };

    fetchConfig();
  }, [union, gameManager]);

  // refresh unions every 10 seconds
  useEffect(() => {
    if (!uiManager) return;

    const refreshUnion = () => {
      const unionId = _unionId;
      const union = uiManager.getUnion(unionId);
      setUnion(union);
    };

    const intervalId = setInterval(refreshUnion, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [_unionId, uiManager]);

  const validUnion = (union: Union | undefined): boolean => {
    if (!union) return false;
    return union.unionId !== '0';
  };

  const isPlayerInUnion = (address: EthAddress): boolean => {
    const player = uiManager.getPlayer(address);
    if (!player) return false;
    return player.unionId !== '0';
  };

  const isLeader = (union: Union, address: EthAddress): boolean => {
    return union.leader === address;
  };

  const isMember = (union: Union, address: EthAddress): boolean => {
    return union.members.includes(address);
  };

  const isInvitee = (union: Union, address: EthAddress): boolean => {
    return union.invitees.includes(address);
  };

  const isApplicant = (union: Union, address: EthAddress): boolean => {
    return union.applicants.includes(address);
  };

  const hasNoRelationship = (union: Union, address: EthAddress): boolean => {
    return (
      !isLeader(union, address) &&
      !isMember(union, address) &&
      !isInvitee(union, address) &&
      !isApplicant(union, address)
    );
  };

  // utils functions
  const handleLeaveUnion = async () => {
    if (!union || !account) return;
    if (!validUnion(union)) return;
    if (!isMember(union, account)) return;
    setIsProcessing(true);
    try {
      await gameManager.leaveUnion(union.unionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!union || !account) return;
    if (!validUnion(union)) return;
    if (!isInvitee(union, account)) return;
    setIsProcessing(true);
    try {
      await gameManager.acceptInvite(union.unionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendApplication = async () => {
    if (!account || !union || !validUnion(union)) return;
    setIsProcessing(true);
    try {
      await gameManager.sendApplication(union.unionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account || !player || !union)
    return (
      <UnionDetailContent>
        <LoadingSpinner initialText={"You haven't joined a union yet... "} />
      </UnionDetailContent>
    );
  if (!validUnion(union))
    return (
      <UnionDetailContent>
        <LoadingSpinner initialText={"You haven't joined a union yet... "} />
      </UnionDetailContent>
    );

  if (!unionRejoinCooldown || !levelupUnionFee)
    return <LoadingSpinner initialText={'Loading...'} />;

  return (
    <>
      <ButtonContainer>
        <Btn onClick={() => setActiveFrame('list')}>Back To List</Btn>

        {!isMember(union, account) && isPlayerInUnion(account) && (
          <Btn
            onClick={() => {
              const player = uiManager.getPlayer(account);
              if (!player) return;
              const union = uiManager.getUnion(player.unionId);
              if (!union) return;
              setUnion(union);
            }}
          >
            Jump To My Union
          </Btn>
        )}

        {isLeader(union, account) && (
          <Btn
            onClick={() => {
              setActiveFrame('manage');
            }}
          >
            Jump To Manage
          </Btn>
        )}
      </ButtonContainer>

      <UnionDetailContent>
        {/* Basic Union Info */}
        <UnionInfoComponent union={union} />
        <UnionInfoContent>
          <UnionDetailSection>
            <InfoHead>{'Union: ' + union?.name}</InfoHead>
            <Row>
              <span> Id </span>
              <span> {union.unionId} </span>
            </Row>
            <Row>
              <span> Name</span>
              <span> {union.name}</span>
            </Row>
            <Row>
              <span> Leader</span>
              <span>
                <TextPreview
                  style={{ color: dfstyles.colors.text }}
                  text={union.leader}
                  focusedWidth={'100px'}
                  unFocusedWidth={'100px'}
                />
              </span>
            </Row>
            <Row>
              <span> Members Amount</span>
              <span>{union.members.length}</span>
            </Row>
            <Row>
              <span> Level</span>
              <span>{union.level}</span>
            </Row>
            <Row>
              <span> Max Members </span>
              <span>{gameManager.getMaxMembers(union.level)}</span>
            </Row>
          </UnionDetailSection>
        </UnionInfoContent>
        {/* Union Members  */}
        <UnionDetailSection>
          <SectionHeader> Members </SectionHeader>
          <ul>
            {union.members.map((member) => (
              <li key={member}></li>
            ))}
          </ul>
        </UnionDetailSection>
        {/* If you are in member list */}
        {isMember(union, account) && !isLeader(union, account) && (
          <UnionDetailSection>
            <div> You are a member of this guild.</div>
            <span>
              Afer you leave one union, you need to wait{' '}
              {formatDuration(unionRejoinCooldown * 1000)} before you can join a new guild again.{' '}
            </span>
            <Btn disabled={isProcessing} onClick={handleLeaveUnion}>
              Leave Union
            </Btn>
          </UnionDetailSection>
        )}
        {/* If you are in invitee list */}
        {isInvitee(union, account) && (
          <UnionDetailSection>
            <div> You are in invitee list of this guild.</div>
            <Btn disabled={isProcessing} onClick={handleAcceptInvite}>
              Accept Invition
            </Btn>
          </UnionDetailSection>
        )}
        {/* If you are in applicant list */}
        {isApplicant(union, account) && (
          <UnionDetailSection>You are in applicant list.</UnionDetailSection>
        )}
        {/* No Relationship */}
        {hasNoRelationship(union, account) && (
          <UnionDetailContent>
            You has no relationship with this union.
            <div> Round 4 Todo: the cooldown time </div>
            <Btn disabled={isProcessing} onClick={handleSendApplication}>
              Send Application{' '}
            </Btn>
          </UnionDetailContent>
        )}
      </UnionDetailContent>
    </>
  );
}
