import { weiToEth } from '@dfares/network';
import { EthAddress, Union, UnionId } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { SectionHeader } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { TextPreview } from '../Components/TextPreview';
import { formatDuration } from '../Components/TimeUntil';
import dfstyles from '../Styles/dfstyles';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';

const UnionDetailContent = styled.div`
  width: 600px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* text-align: justify; */
  margin-left: 0.5em;
  /* margin-right: 0.5em; */
`;

const UnionInfoContent = styled.div`
  margin-left: 4em;
  margin-right: 4em;
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

const CenteredText = styled.div`
  text-align: center;
  font-size: 140%;
  font-weight: bold;
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

export function UnionDetailPane({ _unionId }: { _unionId: UnionId }) {
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
    const unionId = _unionId;
    const union = uiManager.getUnion(unionId);
    setUnion(union);
  }, [_unionId, uiManager]);

  const validUnion = (union: Union | undefined): boolean => {
    if (!union) return false;
    return union.unionId !== '0';
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

  if (!account || !player || !union) return <>You haven't joined a union yet</>;
  if (!validUnion(union)) return <>You haven't joined a union yet</>;
  if (!unionRejoinCooldown || !levelupUnionFee)
    return <LoadingSpinner initialText={'Loading...'} />;

  return (
    <UnionDetailContent>
      {/* Basic Union Info */}
      <UnionInfoContent>
        <UnionDetailSection>
          <CenteredText>{'Union: ' + union?.name}</CenteredText>
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
            Afer you leave one union, you need to wait {formatDuration(unionRejoinCooldown * 1000)}{' '}
            before you can join a new guild again.{' '}
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
  );
}
