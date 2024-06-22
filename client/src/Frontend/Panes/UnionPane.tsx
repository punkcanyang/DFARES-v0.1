import { EthAddress, ModalName, Union } from '@dfares/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Section, SectionHeader } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane'; // Import ModalPane and ModalHandle

// Define the type for union members
interface UnionMember {
  address: string;
  joinTimestamp: string;
}

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
  const [unionMembers, setUnionMembers] = useState<UnionMember[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unionCreated, setUnionCreated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!account) return;
    // Fetch initial data, like union members, and check if the user is a member/admin
    fetchUnionData();
  }, [account]);

  const fetchUnionData = async () => {
    if (!account) return;

    // Fetch union data logic
    try {
      const rawUnion: Union[] = (await gameManager.getPlayerUnion(account)) as Union[];
      const union: Union = rawUnion[0];

      if (rawUnion.length > 0) {
        setUnionCreated(true);
        setIsMember(true);

        setIsAdmin(union.admin.toLowerCase() === account.toLowerCase());
        setUnionMembers(
          union.members.map((member: string) => ({
            address: member,
            joinTimestamp: new Date().toLocaleString(),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching union data:', error);
    }
  };

  const handleJoinUnion = async () => {
    setIsProcessing(true);
    // try {
    //   await gameManager.joinUnion(ethAddress);
    //   await fetchUnionData();
    //   gameManager.setPlayerUnion(ethAddress as EthAddress);
    // } catch (error) {
    //   console.error('Error joining union:', error);
    // }
    setIsProcessing(false);
  };

  const handleCreateUnion = async () => {
    setIsProcessing(true);
    try {
      if (account !== undefined) {
        // debugger;
        await gameManager.createUnion(unionNameText);
        //   await fetchUnionData();a
        //Round 4 Todo: change to unionId
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
      await gameManager.leaveUnion();
      //gameManager.setPlayerUnion('');
    } catch (error) {
      console.error('Error leaving union:', error);
    }
    setIsProcessing(false);
  };

  const handleKickMember = async (memberAddress: string) => {
    setIsProcessing(true);
    // try {
    //   await gameManager.kickMember(memberAddress as EthAddress);
    //   await fetchUnionData();
    // } catch (error) {
    //   console.error('Error kicking member:', error);
    // }
    setIsProcessing(false);
  };

  const handleTransferAdminRole = async (newAdminAddress: string) => {
    setIsProcessing(true);
    // try {
    //   await gameManager.transferAdminRole(newAdminAddress as EthAddress);
    //   await fetchUnionData();
    // } catch (error) {
    //   console.error('Error transferring admin role:', error);
    // }
    setIsProcessing(false);
  };

  const handlePayFeeToLeaveImmediately = async () => {
    setIsProcessing(true);
    // try {
    //   // Function to handle paying a fee to leave immediately
    // } catch (error) {
    //   console.error('Error paying fee to leave immediately:', error);
    // }
    setIsProcessing(false);
  };

  const handleDisbandUnion = async () => {
    setIsProcessing(true);
    try {
      await gameManager.disbandUnion();
    } catch (error) {
      console.error('Error Disbanding union:', error);
    }
    setIsProcessing(false);
  };

  const handleInviteToUnion = async () => {
    setIsProcessing(true);
    try {
      await gameManager.inviteToUnion(inviteNameText as EthAddress);
    } catch (error) {
      console.error('Error invite union:', error);
    }
    setIsProcessing(false);
  };

  if (!account) return <></>;

  let buttonContent = <></>;
  if (isProcessing) {
    buttonContent = <LoadingSpinner initialText={'Processing...'} />;
  } else if (!unionCreated) {
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
                  !unionCreated ? handleCreateUnion : !isMember ? handleLeaveUnion : handleLeaveUnion
                }
              >
                {buttonContent}
              </Btn>
            </Row>
          )}

          {isMember && (
            <>
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
                  <li key={member.address}>
                    {member.address} - Joined: {member.joinTimestamp}
                    {isAdmin && (
                      <>
                        <Btn onClick={() => handleKickMember(member.address)}>Kick Member</Btn>
                        <Btn onClick={() => handleTransferAdminRole(member.address)}>
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
          <SectionHeader>Union Leaderboard</SectionHeader>
          {/* Add leaderboard content here */}
        </Section>
      </UnionContent>
    </ModalPane>
  );
}
