declare type AbstractTeamType = {
    setStarting: (starting: any[]) => void,
    setBench: (bench: any[]) => void,
    setBudget: (budget:  number) => void,
    setTeamName:  (name: string) => void,
    setCaptainId: (captainId: number) => void,
    setActivePositionFilter:  (positionId: number) => void,
    isPickAble: (player: Player, taxForPicking?: boolean, isTransferPick?: boolean) => any,
    isSwapAble: (player: Player) => any,
    onTeamSave: () => Promise<any>,
    onTeamReset: (team: any) => Promise<any>,
    onTeamNameChange: (e: any) => void,
    onCaptainSelect: (player: Player) => void,
    onViceCaptainSelect: (player: Player, captainFirstInList?: boolean) => void,
    removeBenchPlayer: (player: Player) => void,
    removeStartingPlayer: (player: Player) => void,
    removePlayer: (player: Player) => void,
    pickPlayer: (player: Player, taxForPicking?: boolean) => void,
    activePositionFilter?: any,
    starting?: any[],
    bench?: any[],
    captainId?: number , 
    viceCaptainId?: number ,
    teamName?: string,
    budget?: number,
    swapPlayerId?: any,
    swappedFrom?: string | null,
    teamNameChanged?: boolean,
    initTeamState: (starting: any[], bench: any[], teamName: string, captainId: number, budget: number, leagues?: any[] | undefined, visibleWeekId?: number | undefined, teamPointsInfo?: any, rawTransfers?: any[] | undefined, deadlineWeekTransfers?: any[] | undefined, pastTransfers?: any[] | undefined, viceCaptainId?: number, boosters?: Boosters, isTeamOwner?: boolean, teamUser?: any) => void,
    resetTeamName: () => void,
    onTeamNameUpdate: (teamId: number) => void,
    onTeamEdit: (team: any) => void,
    onTeamSelectionsUpdate: (teamId: number, weekId: number) => void,
    onPlayerSwap: (player: Player) => void,
    loadAllMatches: () => void,
    onTransferPlayerOut: (player: Player, extra?: boolean) => void,
    onDraftTransfersClear: () => void,
    onTransferPlayerIn: (player: Player) => void,
    onTransfersSubmit: (teamId: number) => void,
    onTransfersReset: (teamId: number) => void,
    reloadUserTeams: () => void,
    teamUser?: any,
    savingTeamPending?: any,
    visibleWeekId: number | null,
    boosters: Boosters,
    initializedExternally: boolean,
    deadlineWeekTransfers: Transfer[] | null,
	draftTransfers: Transfer[] | null,
	pastTransfers: Transfer[] | null,
    teamPointsInfo: any,
}