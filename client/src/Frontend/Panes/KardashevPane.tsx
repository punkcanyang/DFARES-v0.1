import { EMPTY_ADDRESS } from '@dfares/constants';
import { isLocatable } from '@dfares/gamelogic';
import { ArtifactType, LocationId } from '@dfares/types';
import React from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Spacer } from '../Components/CoreUI';
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

const KardashevWrapper = styled.div`
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

// export function KardashevPaneHelpContent() {
//   return (
//     <div>
//       Reveal this planet's location to all other players on-chain!
//       <Spacer height={8} />
//       Broadcasting can be a potent offensive tactic! Reveal a powerful enemy's location, and maybe
//       someone else will take care of them for you?
//     </div>
//   );
// }

export function KardashevPane({
  initialPlanetId,
  modal: _modal,
}: {
  modal?: ModalHandle;
  initialPlanetId: LocationId | undefined;
}) {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();
  const account = useAccount(uiManager);
  const player = usePlayer(uiManager).value;
  const planetId = useEmitterValue(uiManager.selectedPlanetId$, initialPlanetId);
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

  const func = async () => {
    if (!uiManager) return;
    await uiManager.kardashev(planet.locationId);
  };

  const notDestoryedOrFrozen = isLocatable(planet) && !planet.destroyed && !planet?.frozen;
  const notLevel0 = planet.planetLevel > 0;
  const kardashevbefore =
    planet.kardashevOperator !== undefined && planet.kardashevOperator !== EMPTY_ADDRESS;

  const currentlyKardashevingAnyPlanet = uiManager.isCurrentlyKardasheving();

  const kardashevCooldownPassed = uiManager.getNextKardashevAvailableTimestamp() <= Date.now();

  const silverAmountPassed =
    uiManager.getKardashevRequireSilverAmount(planet.planetLevel) <= player.silver;

  const activeArtifactCheckPased =
    activeArtifact && activeArtifact.artifactType === ArtifactType.Kardashev;

  const artifactCooldownPassed =
    activeArtifactCheckPased &&
    Date.now() >=
      1000 *
        (activeArtifact.lastActivated +
          gameManager.getContractConstants().KARDASHEV_PLANET_COOLDOWN);

  const getFormatSilverAmount = () => {
    if (!planet) return 'n/a';
    if (!account) return 'n/a';
    const res = uiManager.getKardashevRequireSilverAmount(planet.planetLevel);
    // console.log(res);
    if (res === undefined) return 'n/a';
    else return res.toLocaleString();
  };
  const formatSilverAmount = getFormatSilverAmount();

  const getTimestamp = () => {
    if (!activeArtifactCheckPased) return 0;
    return (
      1000 *
      (activeArtifact.lastActivated + gameManager.getContractConstants().KARDASHEV_PLANET_COOLDOWN)
    );
  };

  const disabled =
    !notDestoryedOrFrozen ||
    !notLevel0 ||
    kardashevbefore ||
    currentlyKardashevingAnyPlanet ||
    !kardashevCooldownPassed ||
    !silverAmountPassed ||
    !activeArtifactCheckPased ||
    !artifactCooldownPassed;

  let buttonContent = <></>;

  if (!notDestoryedOrFrozen) {
    buttonContent = <>Planet destroyed or frozen </>;
  } else if (!notLevel0) {
    buttonContent = <>Require planet level is higher than 0</>;
  } else if (kardashevbefore) {
    buttonContent = <>kardashev before</>;
  } else if (currentlyKardashevingAnyPlanet) {
    buttonContent = <LoadingSpinner initialText={'Kardasheving...'} />;
  } else if (!kardashevCooldownPassed) {
    buttonContent = <>Wait for the cooldown </>;
  } else if (!silverAmountPassed) {
    buttonContent = <>Not enough silver</>;
  } else if (!activeArtifactCheckPased) {
    buttonContent = <>Need active karhashev artifact</>;
  } else if (!artifactCooldownPassed) {
    buttonContent = <>Wait for the cooldown</>;
  } else {
    buttonContent = <>Kardashev</>;
  }

  const warningsSection = (
    <div>
      {!notDestoryedOrFrozen && (
        <p>
          <Blue>INFO:</Blue> planet is destoryed or frozen
        </p>
      )}
      {!notLevel0 && (
        <p>
          <Blue>INFO:</Blue> planet level musd be bigger than 0
        </p>
      )}
      {kardashevbefore && (
        <p>
          <Blue>INFO: </Blue> can't kardashev the planet
        </p>
      )}

      {currentlyKardashevingAnyPlanet && (
        <p>
          <Blue>INFO:</Blue> Kardshaeving...
        </p>
      )}

      {!kardashevCooldownPassed && (
        <p>
          <Blue>INFO:</Blue> {' [kardashev cooldown] You must wait '}
          <TimeUntil
            timestamp={uiManager.getNextKardashevAvailableTimestamp()}
            ifPassed={'now!'}
          />{' '}
        </p>
      )}

      {!silverAmountPassed && (
        <p>
          <Blue>INFO:</Blue> You need at least {formatSilverAmount} silver.
        </p>
      )}

      {!activeArtifactCheckPased && (
        <p>
          <Blue>INFO:</Blue> Please activate kardashev artifact on this planet.
        </p>
      )}

      {activeArtifactCheckPased && !artifactCooldownPassed && (
        <p>
          <Blue>INFO:</Blue> {' [artifact cooldown] You must wait '}
          <TimeUntil timestamp={getTimestamp()} ifPassed={'now!'} />{' '}
        </p>
      )}
    </div>
  );

  return (
    <KardashevWrapper>
      <div>
        You can only kardashev a planet once every{' '}
        <White>
          {formatDuration(uiManager.contractConstants.KARDASHEV_PLANET_COOLDOWN * 1000)}
        </White>
        .
      </div>

      <div className='row'>
        <span>Your kardashev amount:</span>
        <span>{player.kardashevAmount}</span>
      </div>

      <div className='row'>
        <span>Require silver amount:</span>
        <span>{formatSilverAmount} </span>
      </div>
      <div className='message'>{warningsSection}</div>
      <div className='row'>
        <span>Coordinates</span>
        <span>{`(${getLoc().x}, ${getLoc().y})`}</span>
      </div>
      <Spacer height={8} />
      <Btn disabled={disabled} onClick={func}>
        {buttonContent}
      </Btn>
    </KardashevWrapper>
  );
}
