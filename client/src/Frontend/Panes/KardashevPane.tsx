import { isActivated } from '@dfares/gamelogic';
import { isUnconfirmedKardashevTx } from '@dfares/serde';
import { ArtifactType, EthAddress, LocationId } from '@dfares/types';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { CenterBackgroundSubtext, Spacer } from '../Components/CoreUI';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { Blue, White } from '../Components/Text';
import { formatDuration, TimeUntil } from '../Components/TimeUntil';
import dfstyles from '../Styles/dfstyles';
import { usePlanet, useUIManager } from '../Utils/AppHooks';
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
  const planetId = useEmitterValue(uiManager.selectedPlanetId$, initialPlanetId);
  const planet = usePlanet(uiManager, planetId).value;

  const getLoc = () => {
    if (!planet || !uiManager) return { x: 0, y: 0 };
    const loc = uiManager.getLocationOfPlanet(planet.locationId);
    if (!loc) return { x: 0, y: 0 };
    return loc.coords;
  };

  const kardashev = () => {
    if (!planet || !uiManager) return;
    const loc = uiManager.getLocationOfPlanet(planet.locationId);
    if (!loc) return;

    uiManager.kardashev(loc.hash);
  };

  const [account, setAccount] = useState<EthAddress | undefined>(undefined); // consider moving this one to parent
  const isDestoryedOrFrozen = planet?.destroyed || planet?.frozen;
  const kardashevCooldownPassed = uiManager.getNextKardashevAvailableTimestamp() <= Date.now();
  const currentlyKardashevingAnyPlanet = uiManager.isCurrentlyKardasheving();

  const getKardashevAmount = () => {
    const player = uiManager.getPlayer(account);
    if (!player) return 0;
    return player.kardashevAmount;
  };

  const getSilverPassed = () => {
    if (!planet) return false;
    if (!account) return false;
    const playerSilver = uiManager.getPlayerSilver(account);
    if (playerSilver === undefined) return false;
    const requireSilver = uiManager.getKardashevRequireSilverAmount(planet.planetLevel);

    return Math.floor(playerSilver) >= Math.ceil(requireSilver);
  };

  const getFormatSilverAmount = () => {
    if (!planet) return 'n/a';
    if (!account) return 'n/a';
    const res = uiManager.getKardashevRequireSilverAmount(planet.planetLevel);
    // console.log(res);
    if (res === undefined) return 'n/a';
    else return res.toLocaleString();
  };
  const formatSilverAmount = getFormatSilverAmount();

  const silverPassed = getSilverPassed();
  const hasActiveAritfact = useMemo(
    () =>
      planet?.heldArtifactIds
        .map((id) => uiManager.getArtifactWithId(id))
        .find(
          (artifact) =>
            // (artifact?.artifactType === ArtifactType.ShipPink && artifact.controller === account) ||
            artifact?.artifactType === ArtifactType.Kardashev && isActivated(artifact)
        ),
    [account, planet, uiManager]
  );

  const levelPassed = planet ? planet.planetLevel >= 1 : false;

  useEffect(() => {
    if (!uiManager) return;
    setAccount(uiManager.getAccount());
  }, [uiManager]);

  let kardashevBtn = undefined;

  if (isDestoryedOrFrozen) {
    kardashevBtn = <Btn disabled={true}>Kardashev</Btn>;
  } else if (planet?.transactions?.hasTransaction(isUnconfirmedKardashevTx)) {
    kardashevBtn = (
      <Btn disabled={true}>
        <LoadingSpinner initialText={'Kardasheving...'} />
      </Btn>
    );
  } else if (!kardashevCooldownPassed) {
    kardashevBtn = <Btn disabled={true}>Kardshaev</Btn>;
  } else if (!hasActiveAritfact) {
    kardashevBtn = <Btn disabled={true}>Kardshaev</Btn>;
  } else if (!silverPassed) {
    kardashevBtn = <Btn disabled={true}>Kardshaev</Btn>;
  } else if (!levelPassed) {
    kardashevBtn = <Btn disabled={true}>Kardshaev</Btn>;
  } else {
    kardashevBtn = (
      <Btn disabled={currentlyKardashevingAnyPlanet} onClick={kardashev}>
        Kardshaev
      </Btn>
    );
  }

  const warningsSection = (
    <div>
      {currentlyKardashevingAnyPlanet && (
        <p>
          <Blue>INFO:</Blue> Kardshaeving...
        </p>
      )}
      {/* {planet?.owner === account && (
        <p>
          <Blue>INFO:</Blue> You own this planet! Dropping Bomb to this planet is not a good choice.
        </p>
      )} */}
      {/* {planet?.owner !== account && (
        <p>
          <Blue>INFO:</Blue> You can only drop bomb to your own planet.
        </p>
      )} */}

      {isDestoryedOrFrozen && (
        <p>
          <Blue>INFO:</Blue> You can't kardashev to a destoryed/frozen planet.
        </p>
      )}
      {!kardashevCooldownPassed && (
        <p>
          <Blue>INFO:</Blue> You must wait{' '}
          <TimeUntil timestamp={uiManager.getNextKardashevAvailableTimestamp()} ifPassed={'now!'} />{' '}
          to kardashev another planet.
        </p>
      )}
      {!hasActiveAritfact && (
        // round 2
        // <p>
        //   <Blue>INFO:</Blue> Your pink Ship needs to be above this planet.
        // </p>

        <p>
          <Blue>INFO:</Blue> Please activate kardashev artifact on this planet.
        </p>
      )}

      {!silverPassed && (
        <p>
          <Blue>INFO:</Blue> You need at least {formatSilverAmount} silver.
        </p>
      )}

      {!levelPassed && (
        <p>
          <Blue>INFO: </Blue> Planet level can't be 0.
        </p>
      )}
    </div>
  );

  if (planet) {
    return (
      <DropBombWrapper>
        <div>
          You can only kardashev a planet once every{' '}
          <White>
            {formatDuration(uiManager.contractConstants.KARDASHEV_PLANET_COOLDOWN * 1000)}
          </White>
          .
        </div>

        <div className='row'>
          <span>Your kardashev amount:</span>
          <span>{getKardashevAmount()}</span>
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
        <p style={{ textAlign: 'right' }}>{kardashevBtn}</p>
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
