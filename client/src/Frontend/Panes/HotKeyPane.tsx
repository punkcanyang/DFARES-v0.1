import { isSpaceShip } from '@dfares/gamelogic';
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

export function HotkeyThumbArtShips({ hotkey }: { hotkey: Hotkey }) {
  const uiManager = useUIManager();

  const click = useCallback(() => {
    if (hotkey.location) {
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

export function HotkeysArtShipPane() {
  const uiManager = useUIManager();
  const artifacts = useMyArtifactsList(uiManager);
  const shipArtifacts = artifacts.filter((a) => isSpaceShip(a.artifactType));
  const [hotkeys, setHotkeys] = useState<Hotkey[]>([]);

  useEffect(() => {
    if (shipArtifacts.length !== hotkeys.length) {
      setHotkeys(
        shipArtifacts
          .sort((a, b) => b.artifactType - a.artifactType)
          .map((a, i) => ({
            location: a.onPlanetId,
            key: `${(i + 1).toString()}`,
            artifact: a,
          }))
      );
    }
  }, [shipArtifacts]);

  return (
    <StyledHotkeysArtShipsPane>
      {hotkeys.length > 0 &&
        hotkeys.map((h, i) => (
          <div key={i}>
            <HotkeyThumbArtShips hotkey={{ ...h, key: shipLine[i] }} />
            <Spacer width={4} />
          </div>
        ))}
    </StyledHotkeysArtShipsPane>
  );
}

export function HotkeysMainLinePane(selectedPlanetVisible: any) {
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
        <div key={index} style={{ display: 'flex', margin: 0 }}>
          <HotkeyThumbMainLine hotkey={hotkey} selectedPlanetVisible={selectedPlanetVisible} />
          <SetKeyButton onClick={() => handleSetLocation(index)} />
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
  selectedPlanetVisible: any;
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
      {hotkey.location ? <PlaceholderImage>X</PlaceholderImage> : <div>{hotkey.key}</div>}
    </HotkeyButton>
  );
};

const PlaceholderImage = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px; /* Adjust font size as needed */
`;

const StyledHotkeysMainLinePane = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0.25em;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledHotkeysArtShipsPane = styled.div`
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);

  margin: 0.25em;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HotkeyButton = styled(ShortcutBtn)`
  min-width: 2em;
  min-height: 2em;

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

const SetKeyButton = styled(Btn)`
  min-width: 2em;
  min-height: 3em;

  left: -40px; /* Move 50px to the left */
  bottom: -25px; /* Move 50px to the left */
  position: relative;
  z-index: 9999; /* Ensure the button overlays other elements */

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
