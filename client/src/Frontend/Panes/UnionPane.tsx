import { ModalName } from '@dfares/types';
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

  const [ethAddress, setEthAddress] = useState('');
  const [unionMembers, setUnionMembers] = useState<UnionMember[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unionCreated, setUnionCreated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    // Fetch initial data, like union members, and check if the user is a member/admin
    // This would typically involve API calls to your backend or smart contracts
  }, []);

  const handleJoinUnion = async () => {
    setIsProcessing(true);
    // Function to handle joining the union
    setIsProcessing(false);
  };

  const handleCreateUnion = async () => {
    setIsProcessing(true);
    // Function to handle creating the union
    setIsProcessing(false);
  };

  const handleLeaveUnion = async () => {
    setIsProcessing(true);
    // Function to handle leaving the union
    setIsProcessing(false);
  };

  const handleKickMember = async (memberAddress: string) => {
    setIsProcessing(true);
    // Function to handle kicking a member (admin only)
    setIsProcessing(false);
  };

  const handleTransferAdminRole = async (newAdminAddress: string) => {
    setIsProcessing(true);
    // Function to handle transferring admin role (admin only)
    setIsProcessing(false);
  };

  const handlePayFeeToLeaveImmediately = async () => {
    setIsProcessing(true);
    // Function to handle paying a fee to leave immediately
    setIsProcessing(false);
  };

  const handleDisbandUnion = async () => {
    setIsProcessing(true);
    // Function to handle disbanding the union (admin only)
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
  debugger;
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

          <Row>
            <span>ETH Address</span>
            <span>
              <input
                type='text'
                placeholder='Enter your ETH address'
                value={ethAddress}
                onChange={(e) => setEthAddress(e.target.value)}
              />
            </span>
          </Row>

          <Btn
            disabled={isProcessing}
            onClick={!unionCreated ? handleCreateUnion : handleJoinUnion}
          >
            {buttonContent}
          </Btn>

          {isMember && (
            <>
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
