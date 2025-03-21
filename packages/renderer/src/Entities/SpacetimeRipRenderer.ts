import { getPlanetCosmetic } from '@dfares/procedural';
import {
  CanvasCoords,
  Planet,
  RendererType,
  SpacetimeRipRendererType,
  SpaceType,
  WorldCoords,
} from '@dfares/types';
import { EngineUtils } from '../EngineUtils';
import { SPACETIMERIP_PROGRAM_DEFINITION } from '../Programs/SpacetimeRipProgram';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';

export class SpacetimeRipRenderer
  extends GenericRenderer<typeof SPACETIMERIP_PROGRAM_DEFINITION, GameGLManager>
  implements SpacetimeRipRendererType
{
  quad3Buffer: number[];
  quad2Buffer: number[];

  rendererType = RendererType.SpacetimeRip;

  constructor(manager: GameGLManager) {
    super(manager, SPACETIMERIP_PROGRAM_DEFINITION);

    this.quad3Buffer = EngineUtils.makeEmptyQuad();
    this.quad2Buffer = EngineUtils.makeQuadVec2(-1, 1, 1, -1);
  }

  public queueRipScreen(planet: Planet, center: CanvasCoords, radius: number, z: number) {
    const { position, color, rectPos, inColor1, inColor2, inColor3 } = this.attribManagers;

    const r = radius * 1.7;

    const x1 = center.x - r;
    const y1 = center.y - r;
    const x2 = center.x + r;
    const y2 = center.y + r;

    EngineUtils.makeQuadBuffered(this.quad3Buffer, x1, y1, x2, y2, z);
    position.setVertex(this.quad3Buffer, this.verts);
    rectPos.setVertex(this.quad2Buffer, this.verts);

    // these are just the space colors
    let c = [0, 24, 122]; // NEBULA

    if (planet.spaceType === SpaceType.SPACE) c = [0, 5, 43];
    else if (planet.spaceType === SpaceType.DEEP_SPACE) c = [2, 0, 6];
    else if (planet.spaceType === SpaceType.DEAD_SPACE) c = [0, 36, 0];

    const cosmetic = getPlanetCosmetic(planet);

    // push the same color 6 times
    for (let i = 0; i < 6; i++) {
      color.setVertex(c, this.verts + i);
      inColor1.setVertex(cosmetic.spacetime1, this.verts + i);
      inColor2.setVertex(cosmetic.spacetime2, this.verts + i);
      inColor3.setVertex(cosmetic.spacetime3, this.verts + i);
    }

    this.verts += 6;
  }

  public queueRip(planet: Planet, centerW: WorldCoords, radiusW: number): void {
    const center = this.manager.renderer.getViewport().worldToCanvasCoords(centerW);
    const radius = this.manager.renderer.getViewport().worldToCanvasDist(radiusW);
    const z = EngineUtils.getPlanetZIndex(planet);

    this.queueRipScreen(planet, center, radius, z);
  }

  public setUniforms() {
    this.uniformSetters.matrix(this.manager.projectionMatrix);

    const time = EngineUtils.getNow();
    this.uniformSetters.time(time / 6);
  }
}
