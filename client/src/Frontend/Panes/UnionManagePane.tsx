import { EthAddress, Setting, Union } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { SectionHeader } from '../Components/CoreUI';
import { DarkForestTextInput, TextInput } from '../Components/Input';
import { TextPreview } from '../Components/TextPreview';
import dfstyles from '../Styles/dfstyles';
import { useAccount, usePlayer, useUIManager } from '../Utils/AppHooks';
import { useBooleanSetting } from '../Utils/SettingsHooks';

const UnionManageContent = styled.div`
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

const BtnSet = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const UnionManageSection = styled.div`
  padding: 0.5em 0;

  &:first-child {
    margin-top: -8px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export function UnionManagePane() {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();
  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;

  const [union, setUnion] = useState<Union>();
  const [isProcessing, setIsProcessing] = useState(false);

  // about input
  const [inviteAddressText, setInviteAddressText] = useState('');
  const [savedSettingValue, setSavedSettingValue] = useState(false);
  const [settingValue, setSettingValue] = useBooleanSetting(
    uiManager,
    Setting.DisableDefaultShortcuts
  );
  const handleKeyDown = () => {
    console.log('handle key down');
    console.log(settingValue);
    setSettingValue(true);
    console.log('become true');
  };

  const handleKeyUp = () => {
    console.log('handle key up');
    console.log(savedSettingValue);
    setSettingValue(savedSettingValue);
  };

  useEffect(() => {
    if (!account || !uiManager) return;
    const unionId = uiManager.getPlayerUnionId(account);
    const union = uiManager.getUnion(unionId);
    setUnion(union);
    setSavedSettingValue(settingValue);
  }, [account, uiManager]);

  //refresh unions every 10 seconds
  useEffect(() => {
    if (!account || !uiManager) return;

    const refreshUnion = () => {
      if (!account || !uiManager) return;
      const unionId = uiManager.getPlayerUnionId(account);
      const union = uiManager.getUnion(unionId);
      setUnion(union);
    };

    const intervalId = setInterval(refreshUnion, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [account, uiManager]);

  const validUnion = (union: Union | undefined): boolean => {
    if (!union) return false;
    return union.unionId !== '0';
  };

  const isLeader = (union: Union | undefined, address: EthAddress | undefined): boolean => {
    if (!union || !address) return false;
    return union.leader === address;
  };

  const handleKickMember = async (memberAddress: EthAddress) => {
    if (!account || !union) return;
    if (!validUnion(union)) return;

    setIsProcessing(true);
    try {
      await gameManager.kickMember(union.unionId, memberAddress);
    } catch (err) {
      console.error('Error kicking member:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransferLeaderRole = async (newAdminAddress: EthAddress) => {
    if (!account || !union || !validUnion(union)) return;

    setIsProcessing(true);

    try {
      await gameManager.transferLeaderRole(union.unionId, newAdminAddress);
    } catch (err) {
      console.error('Error transferring leader role:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInviteToUnion = async () => {
    if (!account || !union || !validUnion(union)) return;

    setIsProcessing(true);

    try {
      await gameManager.inviteMember(union.unionId, inviteAddressText as EthAddress);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelInvite = async (newAdminAddress: EthAddress) => {
    if (!account || !union || !validUnion(union)) return;
    setIsProcessing(true);

    try {
      await gameManager.cancelInvite(union.unionId, newAdminAddress);
    } catch (err) {
      console.error('Error canceling Invite:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Round 4 Todo add functions here
  const handleRejectApplication = async (applicant: EthAddress) => {
    if (!account || !union || !validUnion(union)) return;
    setIsProcessing(true);
    try {
      await gameManager.rejectApplication(union.unionId, applicant);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptApplication = async (applicant: EthAddress) => {
    if (!account || !union || !validUnion(union)) return;
    setIsProcessing(true);
    try {
      await gameManager.acceptApplication(union.unionId, applicant);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisbandUnion = async () => {
    if (!account || !union || !validUnion(union)) return;
    setIsProcessing(true);
    try {
      await gameManager.disbandUnion(union.unionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account || !player || !union) return <>You haven't joined a union yet</>;
  if (!validUnion(union)) return <>You haven't joined a union yet</>;
  if (!isLeader(union, account)) return <>You are not the leader of one union</>;

  return (
    <UnionManageContent>
      <UnionInfoContent>
        <UnionManageSection>
          <CenteredText>{'Union: ' + union?.name}</CenteredText>
          <Row>
            <Btn onClick={() => handleDisbandUnion()}> Disband This Union</Btn>
          </Row>
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
        </UnionManageSection>
      </UnionInfoContent>

      <UnionManageSection>
        <SectionHeader> Members </SectionHeader>
        <ul>
          {union.members.map((member) => (
            <li key={member}>
              <BtnSet>
                {member}
                <Btn onClick={() => handleKickMember(member)}>Kick</Btn>
                <Btn onClick={() => handleTransferLeaderRole(member)}> Transfer Admin </Btn>
              </BtnSet>
            </li>
          ))}
        </ul>
      </UnionManageSection>

      <UnionManageSection>
        <SectionHeader> Invitees </SectionHeader>

        <div style={{ padding: '10px' }}>
          <Row>
            <span>
              <TextInput
                placeholder='Player Address'
                value={inviteAddressText ?? ''}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) => {
                  setInviteAddressText(e.target.value);
                }}
              />
            </span>

            <Btn disabled={isProcessing} onClick={handleInviteToUnion}>
              Send Invite
            </Btn>
          </Row>
        </div>

        <ul>
          {union.invitees.map((invitee) => (
            <li key={invitee}>
              <BtnSet>
                {invitee}
                <Btn disabled={isProcessing} onClick={() => handleCancelInvite(invitee)}>
                  <span> Cancel Invition</span>
                </Btn>
              </BtnSet>
            </li>
          ))}
        </ul>
      </UnionManageSection>

      <UnionManageSection>
        <SectionHeader> Applicants </SectionHeader>

        <ul>
          {union.applicants.map((applicant) => (
            <li key={applicant}>
              <BtnSet>
                {applicant}
                <Btn disabled={isProcessing} onClick={() => handleRejectApplication(applicant)}>
                  Reject
                </Btn>
                <Btn disabled={isProcessing} onClick={() => handleAcceptApplication(applicant)}>
                  Accept
                </Btn>
              </BtnSet>
            </li>
          ))}
        </ul>
      </UnionManageSection>
    </UnionManageContent>
  );
}
