import { getPlanetRank, isSpaceShip } from '@dfares/gamelogic';
import { Artifact, LocationId } from '@dfares/types';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ArtifactImage } from '../Components/ArtifactImage';
import { Btn, ShortcutBtn } from '../Components/Btn';
import { Spacer } from '../Components/CoreUI';
import { useMyArtifactsList, useUIManager } from '../Utils/AppHooks';

const mainLine = '1234567890'.split('');

// same as above, except for silver
const shipLine = '!@#$%^&*()'.split('');

interface Hotkey {
  location: LocationId | undefined;
  key: string;
  artifact?: Artifact;
}

export function HotkeyThumbArtShips({
  hotkey,
  selectedPlanetVisible,
}: {
  hotkey: Hotkey;
  selectedPlanetVisible: { selectedPlanetVisible: boolean };
}) {
  const uiManager = useUIManager();

  const click = useCallback(() => {
    if (hotkey.location && !selectedPlanetVisible.selectedPlanetVisible) {
      uiManager.centerLocationId(hotkey.location);
    }
  }, [hotkey]);

  return (
    <HotkeyButton
      className='test'
      onClick={click}
      onShortcutPressed={click}
      shortcutKey={hotkey.key}
      shortcutText={hotkey.key}
    >
      {hotkey.artifact && <ArtifactImage artifact={hotkey.artifact} thumb size={24} />}
    </HotkeyButton>
  );
}

export function HotkeysArtShipPane(selectedPlanetVisible: { selectedPlanetVisible: boolean }) {
  const uiManager = useUIManager();
  const artifacts = useMyArtifactsList(uiManager);
  const shipArtifacts = artifacts.filter(
    (a) => !isSpaceShip(a.artifactType) || isSpaceShip(a.artifactType)
  );

  const [hotkeys, setHotkeys] = useState<Hotkey[]>([]);

  useEffect(() => {
    if (shipArtifacts.length !== hotkeys.length) {
      const limitedShipArtifacts = shipArtifacts.slice(0, 10); // Limit to maximum of 10 artifacts
      setHotkeys(
        limitedShipArtifacts
          .sort((a, b) => b.artifactType - a.artifactType)
          .map((a, i) => ({
            location: a.onPlanetId,
            key: `${(i + 1).toString()}`,
            artifact: a,
          }))
      );
    }
  }, [shipArtifacts]);

  const handleSetArtifact = (index: number) => {
    // put from ArtifactDetailsPane.artifact.Id

    const trial = document.querySelector(
      "[class^='ArtifactDetailsPane__StyledArtifactDetailsBody']"
    );
    if (trial) {
      const rowId = trial.getAttribute('id');
      console.log('Row ID:', rowId);
    } else {
      console.error('Artifact details pane not found.');
    }
    debugger;
    const selectedArtifact = uiManager.getMyArtifacts()[0];
    if (selectedArtifact !== undefined) {
      const updatedHotkeys = [...hotkeys];
      updatedHotkeys[index].location = selectedArtifact.onPlanetId;
      updatedHotkeys[index].artifact = selectedArtifact;
      setHotkeys(updatedHotkeys);
    } else {
      console.log('Artifact or ship not selected to be able set shortcut');
    }
  };
  return (
    <StyledHotkeysArtShipsPane>
      {hotkeys.length > 0 &&
        hotkeys.map((h, i) => (
          <div key={i}>
            <HotkeyThumbArtShips
              hotkey={{ ...h, key: shipLine[i] }}
              selectedPlanetVisible={selectedPlanetVisible}
            />
            <SetKeyButtonArt onClick={() => handleSetArtifact(i)} />
            <Spacer width={4} />
          </div>
        ))}
    </StyledHotkeysArtShipsPane>
  );
}

export function HotkeysMainLinePane(selectedPlanetVisible: { selectedPlanetVisible: boolean }) {
  const uiManager = useUIManager();

  const [hotkeys, setHotkeys] = useState<Hotkey[]>([]);

  useEffect(() => {
    const newHotkeys = mainLine.map((key, index) => ({
      location: undefined, // Initially no location assigned
      key,
    }));
    setHotkeys(newHotkeys);
  }, []);

  const handleSetLocation = (index: number) => {
    const selectedPlanet = uiManager.getSelectedPlanet();
    if (selectedPlanet !== undefined) {
      const updatedHotkeys = [...hotkeys];
      updatedHotkeys[index].location = selectedPlanet.locationId;
      setHotkeys(updatedHotkeys);
    } else {
      console.log('Planet not selected to be able set shortcut');
    }
  };

  return (
    <StyledHotkeysMainLinePane>
      {hotkeys.map((hotkey, index) => (
        <div key={index} style={{ display: 'flex', marginInline: 0 }}>
          <HotkeyThumbMainLine hotkey={hotkey} selectedPlanetVisible={selectedPlanetVisible} />
          <Spacer width={2} />
          <SetKeyButtonPlanets onClick={() => handleSetLocation(index)} />
        </div>
      ))}
    </StyledHotkeysMainLinePane>
  );
}

const HotkeyThumbMainLine = ({
  hotkey,
  selectedPlanetVisible,
}: {
  hotkey: Hotkey;
  selectedPlanetVisible: { selectedPlanetVisible: boolean };
}) => {
  const uiManager = useUIManager();

  const handleClick = () => {
    if (hotkey.location && !selectedPlanetVisible.selectedPlanetVisible) {
      uiManager.centerLocationId(hotkey.location);
    }
  };

  return (
    <HotkeyButton
      className='test'
      onClick={handleClick}
      onShortcutPressed={handleClick}
      shortcutKey={hotkey.key}
      shortcutText={hotkey.key}
    >
      {/* For now, we'll display a test image if position is occupied */}
      {hotkey.location ? (
        <PlaceholderImage>
          {ui.getPlanetLevel(hotkey.location)}|{getPlanetRank(ui.getPlanetWithId(hotkey.location))}
        </PlaceholderImage>
      ) : (
        <div>{hotkey.key}</div>
      )}
    </HotkeyButton>
  );
};

const PlaceholderImage = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-size: 10px; /* Adjust font size as needed */
`;

const StyledHotkeysMainLinePane = styled.div`
  position: absolute;
  bottom: 1%;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 9989; /* Ensure the button overlays other elements */
`;

const StyledHotkeysArtShipsPane = styled.div`
  position: absolute;
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 9989; /* Ensure the button overlays other elements */
`;

const HotkeyButton = styled(ShortcutBtn)`
  &:last-child {
    margin-right: none;
  }

  display: inline-flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .test {
    background: red !important;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SetKeyButtonPlanets = styled(Btn)`
  left: -40px; /* Move 50px to the left */
  bottom: -16px; /* Move 50px to the left */
  position: relative;
  z-index: 9989; /* Ensure the button overlays other elements */

  .test {
    background: red !important;
  }
  &:last-child {
    margin: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SetKeyButtonArt = styled(Btn)`
  left: -40px; /* Move 50px to the left */
  bottom: -5px; /* Move 50px to the left */
  position: relative;
  z-index: 9989; /* Ensure the button overlays other elements */

  .test {
    background: red !important;
  }
  &:last-child {
    margin: none;
  }

  &:hover {
    cursor: pointer;
  }
`;
