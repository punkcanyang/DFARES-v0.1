import { EthAddress, ModalName, Union, UnionId } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Section, SectionHeader } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane'; // Import ModalPane and ModalHandle
import { UnionCreatePane } from './UnionCreatePane';
import { UnionDetailPane } from './UnionDetailPane';
import { UnionListPane } from './UnionListPane';
import { UnionManagePane } from './UnionManagePane';

// Styled component for the list item with hover effect and tooltip
const ListItem = styled.li`
  position: relative; /* Required for tooltip positioning */
  cursor: pointer; /* Show cursor as pointer on hover */

  /* Tooltip styles */
  &::before {
    content: attr(data-tooltip); /* Display content from data-tooltip attribute */
    position: absolute;
    z-index: 1;
    bottom: 100%; /* Position above the list item */
    left: 50%; /* Centered horizontally */
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8); /* Dark background */
    color: #fff; /* White text */
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: normal; /* Allow line breaks */
    visibility: hidden; /* Hidden by default */
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    max-width: 200%; /* Maximum width of the tooltip */
    text-align: center; /* Center text in the tooltip */
    word-wrap: break-word; /* Allow wrapping of long words */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Add box shadow for better visibility */
  }

  &:hover::before {
    visibility: visible; /* Show tooltip on hover */
    opacity: 1;
  }
`;

const CenteredSectionHeader = styled(SectionHeader)`
  text-align: center;
  font-size: 140%;
`;

const CenteredText = styled.div`
  text-align: center;
  font-size: 140%;
  font-weight: bold;
`;

const UnionContent = styled.div`
  width: 550px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
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

const Header = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
  width: 600px;
`;

const Frame = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
`;

const InvitesButton = styled(Btn)`
  position: relative;
  right: 0;
  top: 0;
`;

export default function UnionContextPane({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const uiManager = useUIManager();
  const account = useAccount(uiManager);
  const gameManager = uiManager.getGameManager();
  const [unionNameText, setUnionNameText] = useState('');
  const [inviteNameText, setInviteNameText] = useState('');
  const [unionMembers, setUnionMembers] = useState<EthAddress[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsAdmin] = useState(false);
  const [playerUnionPane, setPlayerUnionPane] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [unions, setUnions] = useState<Union[]>([]);
  const [union, setUnion] = useState<Union>();
  const [playerInvitees, setPlayerInvitees] = useState<Union[]>([]);
  const [activeFrame, setActiveFrame] = useState('create'); // State to manage active frame

  const refreshUnions = () => {
    if (!uiManager) return;
    const myAddr = uiManager.getAccount();
    if (!myAddr) return;

    const rawUnions = uiManager.getAllUnions() as Union[];
    setUnions(rawUnions);

    const playerUnion = rawUnions.find((u) => u.members.includes(myAddr)) as Union;
    if (playerUnion) {
      setPlayerUnionPane(true);
      setIsMember(true);
      setIsAdmin(playerUnion.leader.toLowerCase() === myAddr.toLowerCase());
      setUnionMembers(playerUnion.members);
      setUnion(playerUnion);
    } else {
      setPlayerUnionPane(false);
      setIsMember(false);
      setIsAdmin(false);
      setUnionMembers([]);
      setUnion(playerUnion);
    }

    const playerInvitees = rawUnions.filter((u) => u.invitees.includes(myAddr)) as Union[];
    if (playerInvitees.length > 0) {
      setPlayerInvitees(playerInvitees);
    } else {
      setPlayerInvitees([]);
    }
  };

  // update planet list on open / close
  useEffect(() => {
    refreshUnions();
  }, [visible, uiManager]);

  // refresh planets every 10 seconds
  useEffect(() => {
    if (!uiManager) return;
    if (!visible) return;

    refreshUnions();

    const intervalId = setInterval(refreshUnions, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [visible, uiManager]);

  const handleCreateUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        await gameManager.createUnion(unionNameText);
        await refreshUnions();
        // Round 4 Todo: change to unionId
        // await gameManager.setPlayerUnion(account);
      }
    } catch (error) {
      console.error('Error creating union:', error);
    }
    setIsProcessing(false);
  };

  const handleLeaveUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.leaveUnion(unionId);
          await refreshUnions();
          // Round 4 Todo: change to unionId
          // await gameManager.setPlayerUnion(account);
        }
      }
    } catch (error) {
      console.error('Error leaving union:', error);
    }
    setIsProcessing(false);
  };
  // todo doesnt works
  const handleKickMember = async (memberAddress: string) => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.kickMember(unionId, memberAddress.toLowerCase() as EthAddress);
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error kicking member:', error);
    }
    setIsProcessing(false);
  };
  // todo doesnt works
  const handleTransferLeaderRole = async (newAdminAddress: string) => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.transferLeaderRole(
            unionId,
            newAdminAddress.toLowerCase() as EthAddress
          );
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error transferring leader role:', error);
    }
    setIsProcessing(false);
  };

  const handlePayFeeToLeaveImmediately = async () => {
    setIsProcessing(true);
    // try {
    //   // Function to handle paying a fee to leave immediately
    // await refreshUnions();
    // } catch (error) {
    //   console.error('Error paying fee to leave immediately:', error);
    // }
    setIsProcessing(false);
  };

  const handleDisbandUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.disbandUnion(unionId);
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error Disbanding union:', error);
    }
    setIsProcessing(false);
  };

  const handleInviteToUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.inviteMember(unionId, inviteNameText as EthAddress);
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error invite union:', error);
    }
    setIsProcessing(false);
  };

  const handleCancelInviteToUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        const unionId = await gameManager.getPlayerUnionId(account);
        if (unionId !== undefined) {
          await gameManager.cancelInvite(unionId, inviteNameText as EthAddress);
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error invite union:', error);
    }
    setIsProcessing(false);
  };

  const handleAcceptInvite = async (unionId: UnionId) => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        if (unionId !== undefined) {
          await gameManager.acceptInvite(unionId);
          await refreshUnions();
        }
      }
    } catch (error) {
      console.error('Error invite union:', error);
    }
    setIsProcessing(false);
  };

  if (!account) return <></>;

  let buttonContent = <></>;
  if (isProcessing) {
    buttonContent = <LoadingSpinner initialText={'Processing...'} />;
  } else if (!playerUnionPane) {
    buttonContent = <>Create Union</>;
  } else {
    buttonContent = <>Leave Union</>;
  }

  let buttonContent2 = <></>;
  if (isProcessing) {
    buttonContent2 = <LoadingSpinner initialText={'Processing...'} />;
  } else {
    buttonContent2 = <>Send invite</>;
  }

  const handleFrameChange = async (frame: string) => {
    setActiveFrame(frame);
    await refreshUnions();
  };

  return (
    <ModalPane
      id={ModalName.UnionContextPane}
      title={'Your Union'}
      visible={visible}
      onClose={onClose}
    >
      <Header>
        <Btn onClick={() => handleFrameChange('create')}>Create</Btn>
        <Btn onClick={() => handleFrameChange('list')}>List</Btn>
        <Btn onClick={() => handleFrameChange('detail')}>Detail</Btn>
        <Btn onClick={() => handleFrameChange('manage')}>Manage</Btn>
        <Btn onClick={() => handleFrameChange('management')}> Management</Btn>
        <InvitesButton onClick={() => handleFrameChange('invites')}>
          Invites ({playerInvitees.length}) ({isLeader && union?.invitees.length})
        </InvitesButton>
        <Btn onClick={() => handleFrameChange('leaderboard')}>Leaderboard</Btn>
      </Header>

      <Frame visible={activeFrame === 'create'}>
        <UnionCreatePane />
      </Frame>

      <Frame visible={activeFrame === 'list'}>
        <UnionListPane />
      </Frame>

      <Frame visible={activeFrame === 'detail'}>
        <UnionDetailPane />
      </Frame>

      <Frame visible={activeFrame === 'manage'}>
        <UnionManagePane />
      </Frame>

      <Frame visible={activeFrame === 'management'}>
        <UnionContent>
          <Section>
            <CenteredText>{union?.name}</CenteredText>
            {!isMember && (
              <Row>
                <span>
                  <input
                    type='text'
                    placeholder='Union name'
                    value={unionNameText}
                    onChange={(e) => {
                      setUnionNameText(e.target.value);
                    }}
                  />
                </span>
                <Btn disabled={isProcessing} onClick={handleCreateUnion}>
                  {buttonContent}
                </Btn>
              </Row>
            )}

            {isMember && (
              <>
                <Row>
                  <h3>Members:</h3>
                </Row>
                <ul>
                  {unionMembers.map((member) => (
                    <li key={member}>
                      {member}
                      {isLeader && account !== member && (
                        <>
                          <Btn onClick={() => handleKickMember(member)}>Kick</Btn>
                          <Btn onClick={() => handleTransferLeaderRole(member)}>Transfer Admin</Btn>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <Row>
                  <span>Address to Invite</span>
                  <span>
                    <input
                      type='text'
                      placeholder='Player address'
                      value={inviteNameText}
                      onChange={(e) => setInviteNameText(e.target.value)}
                    />
                  </span>
                  <Btn disabled={isProcessing} onClick={handleInviteToUnion}>
                    {buttonContent2}
                  </Btn>
                </Row>
              </>
            )}
          </Section>

          <Section>
            {isMember && (
              <>
                <CenteredSectionHeader>Union Actions</CenteredSectionHeader>
                <Row>
                  <Btn disabled={isProcessing} onClick={handleLeaveUnion}>
                    {buttonContent}
                  </Btn>
                  <Btn onClick={handlePayFeeToLeaveImmediately}>
                    Pay Instant Fee to Leave Immediately
                  </Btn>
                </Row>
                {isLeader && (
                  <>
                    <span>Admin Actions:</span>
                    <Row>
                      <Btn onClick={handleDisbandUnion}>Disband Union</Btn>
                    </Row>
                    <SectionHeader>Union Settings</SectionHeader>
                    <Row>
                      <label>
                        <input type='checkbox' />
                        Restrict planet and artifact transfers to union members only
                      </label>
                    </Row>
                  </>
                )}
              </>
            )}
          </Section>
        </UnionContent>
      </Frame>

      <Frame visible={activeFrame === 'invites'}>
        <UnionContent>
          <Section>
            <CenteredSectionHeader>Invites from Unions</CenteredSectionHeader>
            <ul>
              {playerInvitees.map((u) => (
                <li key={u.unionId}>
                  #{u.unionId} : {u.name}
                  {
                    <>
                      <Btn onClick={() => handleAcceptInvite(u.unionId)}>Join to this</Btn>
                    </>
                  }
                </li>
              ))}
            </ul>
          </Section>
          <Section>
            <CenteredSectionHeader>Active invitees from your union</CenteredSectionHeader>
            <ul>
              {union?.invitees.map((i) => (
                <li key={i}>
                  {i}
                  {isLeader && (
                    <>
                      <Btn onClick={() => handleCancelInviteToUnion()}>Cancel this invite</Btn>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </UnionContent>
      </Frame>

      <Frame visible={activeFrame === 'leaderboard'}>
        <UnionContent>
          <Section>
            <SectionHeader>Union Leaderboard</SectionHeader>
            <ul>
              {unions?.map((u) => (
                <ListItem
                  key={u.unionId}
                  data-tooltip={`Leader: ${u.leader}, Members: ${u.members.join(', ')}`}
                >
                  #{u.unionId} : {u.name} - {u.members.length}
                </ListItem>
              ))}
            </ul>
          </Section>
        </UnionContent>
      </Frame>
    </ModalPane>
  );
}
