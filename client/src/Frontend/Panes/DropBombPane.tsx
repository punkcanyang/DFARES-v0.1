import { EMPTY_ADDRESS } from '@dfares/constants';
import { isLocatable } from '@dfares/gamelogic';
import { ArtifactType, LocationId } from '@dfares/types';
import React from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { CenterBackgroundSubtext, Spacer } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { Blue, White } from '../Components/Text';
import { formatDuration, TimeUntil } from '../Components/TimeUntil';
import dfstyles from '../Styles/dfstyles';
import {
  useAccount,
  useActiveArtifact,
  usePlanet,
  usePlayer,
  useUIManager,
} from '../Utils/AppHooks';
import { useEmitterValue } from '../Utils/EmitterHooks';
import { ModalHandle } from '../Views/ModalPane';

const DropBombWrapper = styled.div`
  & .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    & > span {
      &:first-child {
        color: ${dfstyles.colors.subtext};
        padding-right: 1em;
      }
    }
  }
  & .message {
    margin: 1em 0;

    & p {
      margin: 0.5em 0;

      &:last-child {
        margin-bottom: 1em;
      }
    }
  }
`;

// export function DropBombPaneHelpContent() {
//   return (
//     <div>
//       Reveal this planet's location to all other players on-chain!
//       <Spacer height={8} />
//       Broadcasting can be a potent offensive tactic! Reveal a powerful enemy's location, and maybe
//       someone else will take care of them for you?
//     </div>
//   );
// }

export function DropBombPane({
  initialPlanetId,
  modal: _modal,
}: {
  modal?: ModalHandle;
  initialPlanetId: LocationId | undefined;
}) {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();

  const planetId = useEmitterValue(uiManager.selectedPlanetId$, initialPlanetId);
  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;
  const planetWrapper = usePlanet(uiManager, planetId);
  const planet = planetWrapper.value;
  const activeArtifact = useActiveArtifact(planetWrapper, uiManager);
  if (!account || !player || !planet) return <></>;

  const getLoc = () => {
    if (!planet || !uiManager) return { x: 0, y: 0 };
    const loc = uiManager.getLocationOfPlanet(planet.locationId);
    if (!loc) return { x: 0, y: 0 };
    return loc.coords;
  };

  const dropBomb = () => {
    if (!planet || !uiManager) return;
    const loc = uiManager.getLocationOfPlanet(planet.locationId);
    if (!loc) return;

    uiManager.burnLocation(loc.hash);
  };

  const planetIsLocatable = isLocatable(planet);
  const notDestoryedOrFrozen = !planet.destroyed && !planet.frozen;
  const levelCheckPassed = planet.planetLevel >= 1;
  const burnOperatorCheckPassed =
    planet.burnOperator === undefined || planet.burnOperator === EMPTY_ADDRESS;
  const notBurningAnyPlanet = uiManager.isCurrentlyBurning() === false;

  const burnLocationCooldownPassed = uiManager.getNextBurnAvailableTimestamp() <= Date.now();

  const getDropBombAmount = () => {
    const player = uiManager.getPlayer(account);
    if (!player) return 0;
    return player.dropBombAmount;
  };

  const getSilverPassed = () => {
    if (!planet) return false;
    if (!account) return false;
    const playerSilver = uiManager.getPlayerSilver(account);
    if (playerSilver === undefined) return false;
    const requireSilver = uiManager.getSilverOfBurnPlanet(account, planet.planetLevel);
    if (!requireSilver) return false;

    return Math.floor(playerSilver) >= Math.ceil(requireSilver);
  };

  const getFormatSilverAmount = () => {
    if (!planet) return 'n/a';
    if (!account) return 'n/a';
    const res = uiManager.getSilverOfBurnPlanet(account, planet.planetLevel);
    // console.log(res);
    if (res === undefined) return 'n/a';
    else return res.toLocaleString();
  };
  const formatSilverAmount = getFormatSilverAmount();

  const silverPassed = getSilverPassed();

  const activeArtifactCheckPassed =
    activeArtifact && activeArtifact.artifactType === ArtifactType.Bomb;
  const artifactCooldownPassed =
    activeArtifactCheckPassed &&
    Date.now() >=
      1000 *
        (activeArtifact.lastActivated + gameManager.getContractConstants().BURN_PLANET_COOLDOWN);

  const getTimestamp = () => {
    if (!activeArtifactCheckPassed) return 0;
    return (
      1000 *
      (activeArtifact.lastActivated + gameManager.getContractConstants().BURN_PLANET_COOLDOWN)
    );
  };

  const disabled =
    !planetIsLocatable ||
    !notDestoryedOrFrozen ||
    !levelCheckPassed ||
    !burnOperatorCheckPassed ||
    !notBurningAnyPlanet ||
    !burnLocationCooldownPassed ||
    !silverPassed ||
    !activeArtifactCheckPassed ||
    !artifactCooldownPassed;

  let content = <></>;

  if (!planetIsLocatable) {
    content = <>Planet is not locatable</>;
  } else if (!notDestoryedOrFrozen) {
    content = <>Planet is destroyed or frozen</>;
  } else if (!levelCheckPassed) {
    content = <>PlanetLevel == 0 is not OK</>;
  } else if (!burnLocationCooldownPassed) {
    content = <>This planet was burned before</>;
  } else if (!notBurningAnyPlanet) {
    content = <LoadingSpinner initialText={'Buring...'} />;
  } else if (!silverPassed) {
    content = <>Not enough silver</>;
  } else if (!activeArtifactCheckPassed) {
    content = <>Need active Bomb</>;
  } else if (!artifactCooldownPassed) {
    content = <>Wait for artifact cooldown</>;
  } else {
    content = <>Drop bomb now</>;
  }

  !planetIsLocatable ||
    !notDestoryedOrFrozen ||
    !levelCheckPassed ||
    !burnOperatorCheckPassed ||
    !notBurningAnyPlanet ||
    !burnLocationCooldownPassed ||
    !silverPassed ||
    !activeArtifactCheckPassed ||
    !artifactCooldownPassed;

  const warningsSection = (
    <div>
      {!planetIsLocatable && (
        <p>
          <Blue>INFO:</Blue> planet is not locatable
        </p>
      )}

      {!notDestoryedOrFrozen && (
        <p>
          <Blue>INFO:</Blue> You can't drop bomb to a destoryed/frozen planet.
        </p>
      )}

      {!levelCheckPassed && (
        <p>
          <Blue>INFO: </Blue> Planet level can't be 0.
        </p>
      )}
      {!burnOperatorCheckPassed && (
        <p>
          <Blue>INFO: </Blue> This planet is burned before.
        </p>
      )}

      {!notBurningAnyPlanet && (
        <p>
          <Blue>INFO:</Blue> Dropping Bomb...
        </p>
      )}

      {!burnLocationCooldownPassed && (
        <p>
          <Blue>INFO:</Blue> You must wait{' '}
          <TimeUntil timestamp={uiManager.getNextBurnAvailableTimestamp()} ifPassed={'now!'} /> to
          burn another planet.
        </p>
      )}

      {!silverPassed && (
        <p>
          <Blue>INFO:</Blue> You need at least {formatSilverAmount} silver.
        </p>
      )}

      {!activeArtifactCheckPassed && (
        <p>
          <Blue>INFO:</Blue> Please activate bomb artifact on this planet.
        </p>
      )}

      {activeArtifactCheckPassed && !artifactCooldownPassed && (
        <p>
          <Blue>INFO:</Blue> {' [artifact cooldown] You must wait '}
          <TimeUntil timestamp={getTimestamp()} ifPassed={'now!'} />{' '}
        </p>
      )}
    </div>
  );

  if (planet) {
    return (
      <DropBombWrapper>
        <div>
          You can only drop bomb to a planet once every{' '}
          <White>{formatDuration(uiManager.contractConstants.BURN_PLANET_COOLDOWN * 1000)}</White>.
        </div>

        <div className='row'>
          <span>Your dropped bomb amount:</span>
          <span>{getDropBombAmount()}</span>
        </div>

        <div className='row'>
          <span>Require silver amount: </span>
          <span>{formatSilverAmount}</span>
        </div>
        <div className='message'>{warningsSection}</div>
        <div className='row'>
          <span>Coordinates</span>
          <span>{`(${getLoc().x}, ${getLoc().y})`}</span>
        </div>
        <Spacer height={8} />
        <Btn disabled={disabled} onClick={dropBomb}>
          {content}
        </Btn>
      </DropBombWrapper>
    );
  } else {
    return (
      <CenterBackgroundSubtext width='100%' height='75px'>
        Select a Planet
      </CenterBackgroundSubtext>
    );
  }
}
