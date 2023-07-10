import { isUnconfirmedChangeArtifactImageTypeTx } from '@darkforest_eth/serde';
import { Artifact, ArtifactId, ArtifactType, LocationId, Planet } from '@darkforest_eth/types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { SelectFrom } from '../../Components/CoreUI';
import { useAccount, useArtifact, usePlanet, useUIManager } from '../../Utils/AppHooks';

const StyledBuyArtifactPane = styled.div`
  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &:last-child > span {
      margin-top: 1em;
      text-align: center;
      flex-grow: 1;
    }

    &.margin-top {
      margin-top: 0.5em;
    }
  }
`;

export function ArtifactChangeImageType({
  artifactId,
  depositOn,
}: {
  artifactId: ArtifactId;
  depositOn?: LocationId;
}) {
  const uiManager = useUIManager();
  const account = useAccount(uiManager);
  const artifactWrapper = useArtifact(uiManager, artifactId);
  const artifact = artifactWrapper.value;

  const depositPlanetWrapper = usePlanet(uiManager, depositOn);
  const onPlanetWrapper = usePlanet(uiManager, artifact?.onPlanetId);
  const depositPlanet = depositPlanetWrapper.value;
  const onPlanet = onPlanetWrapper.value;

  // const otherArtifactsOnPlanet = usePlanetArtifacts(onPlanetWrapper, uiManager);

  const [imageType, setImageType] = useState('0');

  if (!artifact || (!onPlanet && !depositPlanet) || !account) return null;

  if (!onPlanet) return null;

  const canArtifactChangeImageType = (artifact: Artifact) =>
    artifact.artifactType === ArtifactType.Avatar;

  const imageTypeChangeing = artifact.transactions?.hasTransaction(
    isUnconfirmedChangeArtifactImageTypeTx
  );

  const enabled = (planet: Planet): boolean => !imageTypeChangeing && planet?.owner === account;

  // MyTodo: make more show state
  // const canHandleImageTypeChange = depositPlanetWrapper.value && ;

  return (
    <div>
      {canArtifactChangeImageType(artifact) && (
        <StyledBuyArtifactPane>
          <div>
            <div> Image Type </div>
            {/* MyTodo: change to like buyHatPane */}
            <SelectFrom
              values={[
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '30',
                '31',
                '32',
                '33',
                '34',
                '35',
                '36',
                '37',
                '38',
                '39',
                '40',
                '41',
                '42',
                '43',
                '44',
                '45',
                '46',
                '47',
                '48',
                '49',
                '50',
              ]}
              labels={[
                'DF ARES',
                'Doge',
                'Cat',
                'ChunZhen',
                'IKunBird',
                'Mike',
                'Panda',
                'Pepe',
                'PigMan',
                'RobotCat',
                'TaiKuLa',
                'Wojak1',
                'Wojak2',
                'Wojak3',
                'Wojak4',
                'DF Archon',
                'AltLayer',
                'DeGame',
                'Fun Blocks',
                'GamePhylum',
                'MarrowDAO|Guild W',
                'Orden GG',
                'DFDAO',
                '277 DAO',
                'Web3MQ',
                'Mask Network',
                'AGLD DAO',
                '01a1',
                'Weirdao Ghost Gang',
                'Briq',
                'BlockBeats',
                'Cointime',
                'ChainCatcher',
                'ForesightNews',
                'SeeDAO',
                'AWHouse',
                'PaladinsDAO',
                'NetherScape',
                'UpchainDAO',
                'LXDAO',
                'Matrix World',
                'Crypto Chasers',
                'AW Research',
                'BlockPi',
                'WhaleDAO',
                'Gametaverse',
                'BuidlerDAO',
                'THUBA',
                'NJUBA',
                'RUChain',
                'DFARES',
              ]}
              value={imageType.toString()}
              setValue={setImageType}
            />
          </div>
          <div>
            <Btn
              onClick={() => {
                if (!enabled(onPlanet) || !uiManager || !onPlanet) return;

                uiManager.changeArtifactImageType(
                  onPlanet.locationId,
                  artifact.id,
                  Number(imageType)
                );
              }}
              disabled={!enabled(onPlanet)}
            >
              Set Image Type
            </Btn>
          </div>
        </StyledBuyArtifactPane>
      )}
    </div>
  );
}
