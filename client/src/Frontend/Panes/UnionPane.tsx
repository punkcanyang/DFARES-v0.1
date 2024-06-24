import { EthAddress, ModalName, Union, UnionId } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Section, SectionHeader } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane'; // Import ModalPane and ModalHandle

const UnionContent = styled.div`
  width: 500px;
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
  const [ethAddress, setEthAddress] = useState('');
  const [unionMembers, setUnionMembers] = useState<EthAddress[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [playerUnionPane, setPlayerUnionPane] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [unions, setUnions] = useState<Union[]>([]);
  const [union, setUnion] = useState<Union>();
  const [playerInvitees, setPlayerInvitees] = useState<Union[]>([]);
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
      console.error('Error transferring admin role:', error);
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
  } else if (!isMember) {
    buttonContent = <>Join Union</>;
  } else {
    buttonContent = <>Leave Union</>;
  }

  let buttonContent2 = <></>;
  if (isProcessing) {
    buttonContent2 = <LoadingSpinner initialText={'Processing...'} />;
  } else {
    buttonContent2 = <>Send invite</>;
  }

  return (
    <ModalPane
      id={ModalName.UnionContextPane} // Define a unique id for the modal
      title={'Your Union'} // Set the modal title
      visible={visible} // Pass the visibility state
      onClose={onClose} // Set modal visibility to false on close
    >
      <UnionContent>
        <Section>
          <SectionHeader>Union Management</SectionHeader>
          {!isMember && (
            <Row>
              <span>
                <input
                  type='text'
                  placeholder='Union name'
                  value={unionNameText}
                  onChange={(e) => setUnionNameText(e.target.value)}
                />
              </span>
              <Btn
                disabled={isProcessing}
                onClick={
                  !playerUnionPane
                    ? handleCreateUnion
                    : !isMember
                    ? handleLeaveUnion
                    : handleLeaveUnion
                }
              >
                {buttonContent}
              </Btn>
            </Row>
          )}

          {isMember && (
            <>
              <Btn
                disabled={isProcessing}
                onClick={
                  !playerUnionPane
                    ? handleCreateUnion
                    : !isMember
                    ? handleLeaveUnion
                    : handleLeaveUnion
                }
              >
                {buttonContent}
              </Btn>
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
              </Row>

              <Btn disabled={isProcessing} onClick={handleInviteToUnion}>
                {buttonContent2}
              </Btn>

              <Row>
                <h3>Union Members</h3>
              </Row>
              <ul>
                {unionMembers.map((member) => (
                  <li key={member}>
                    {member}
                    {isAdmin && (
                      <>
                        <Btn onClick={() => handleKickMember(member)}>Kick Member</Btn>
                        <Btn onClick={() => handleTransferLeaderRole(member)}>
                          Transfer Admin Role
                        </Btn>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>

        <Section>
          <SectionHeader>Union Actions</SectionHeader>
          {isAdmin && (
            <>
              <Row>
                <span>Admin Actions:</span>
                <Btn onClick={handlePayFeeToLeaveImmediately}>
                  Pay Instant Fee to Leave Immediately
                </Btn>
              </Row>
              <Row>
                <span>Disband Union</span>
                <Btn onClick={handleDisbandUnion}>Disband Union</Btn>
              </Row>
            </>
          )}
          {isMember && !isAdmin && (
            <Btn onClick={handlePayFeeToLeaveImmediately}>Pay Instant Fee to Leave Immediately</Btn>
          )}
        </Section>

        <Section>
          <SectionHeader>Union Settings</SectionHeader>
          <Row>
            <label>
              <input type='checkbox' />
              Restrict planet and artifact transfers to union members only
            </label>
          </Row>
        </Section>
        <Section>
          <SectionHeader>Invites from Unions to you</SectionHeader>
          <ul>
            {playerInvitees.map((u) => (
              <li key={u.unionId}>
                {u.unionId} {u.name}
                {/* union?.unionId === '0' && */}
                {
                  <>
                    <Btn onClick={() => handleAcceptInvite(u.unionId)}>Join to this</Btn>
                  </>
                }
              </li>
            ))}
          </ul>
          <SectionHeader>Union active invitees</SectionHeader>
          <ul>
            {union?.invitees.map((i) => (
              <li key={i}>
                {i}
                {isAdmin && (
                  <>
                    <Btn onClick={() => handleCancelInviteToUnion()}>Cancel this invite</Btn>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>
        <Section>
          <SectionHeader>Union Leaderboard</SectionHeader>
          {/* Add leaderboard content here */}
        </Section>
      </UnionContent>
    </ModalPane>
  );
}
