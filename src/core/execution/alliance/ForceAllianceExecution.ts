import { Execution, Game, GameType, Player, PlayerID, PlayerType } from "../../game/Game";

export class ForceAllianceExecution implements Execution {
  private active = true;

  constructor(
    private readonly requester: Player,
    private readonly playerAID: PlayerID,
    private readonly playerBID: PlayerID,
  ) {}

  init(mg: Game): void {
    if (mg.config().gameConfig().gameType !== GameType.Singleplayer) {
      console.warn("forceAlliance is only available in singleplayer");
      this.active = false;
      return;
    }

    if (this.requester.type() !== PlayerType.Human) {
      console.warn("forceAlliance must be requested by the human player");
      this.active = false;
      return;
    }

    if (!mg.hasPlayer(this.playerAID) || !mg.hasPlayer(this.playerBID)) {
      console.warn("forceAlliance: one or both players not found");
      this.active = false;
      return;
    }

    const playerA = mg.player(this.playerAID);
    const playerB = mg.player(this.playerBID);

    if (playerA.isAlliedWith(playerB)) {
      this.active = false;
      return;
    }

    // Directly create the alliance: A sends a request to B and it is immediately accepted
    const req = playerA.createAllianceRequest(playerB);
    if (req) {
      req.accept();
      playerA.allianceWith(playerB)?.makePermanent();
    }

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
