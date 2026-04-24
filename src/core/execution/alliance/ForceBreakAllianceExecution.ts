import {
  Execution,
  Game,
  GameType,
  Player,
  PlayerID,
  PlayerType,
} from "../../game/Game";

export class ForceBreakAllianceExecution implements Execution {
  private active = true;

  constructor(
    private readonly requester: Player,
    private readonly playerAID: PlayerID,
    private readonly playerBID: PlayerID,
  ) {}

  init(mg: Game): void {
    if (mg.config().gameConfig().gameType !== GameType.Singleplayer) {
      console.warn("forceBreakAlliance is only available in singleplayer");
      this.active = false;
      return;
    }

    if (this.requester.type() !== PlayerType.Human) {
      console.warn("forceBreakAlliance must be requested by the human player");
      this.active = false;
      return;
    }

    if (!mg.hasPlayer(this.playerAID) || !mg.hasPlayer(this.playerBID)) {
      console.warn("forceBreakAlliance: one or both players not found");
      this.active = false;
      return;
    }

    const playerA = mg.player(this.playerAID);
    const playerB = mg.player(this.playerBID);

    const alliance = playerA.allianceWith(playerB);
    if (alliance === null) {
      console.warn("forceBreakAlliance: players are not allied");
      this.active = false;
      return;
    }

    playerA.breakAlliance(alliance);
    this.active = false;
  }

  tick(_ticks: number): void {}

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
