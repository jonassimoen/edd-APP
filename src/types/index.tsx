namespace StoreState {
    export type All = {
        user: UserState
        players: Player[]
        application: ApplicationState
        clubs: Club[]
        matches: Match[]
    }
}

type UserState = {
    authenticated: boolean
    isFetching: boolean
    fetched: boolean
    data: User
    teams: Team[]
    redirectToHome?: boolean
    redirectToTeam?: boolean
    // leagues: string
    // leaguesFetched: boolean
}

type Player = {
    id: number
    name: string
    short: string
    forename: string
    surname: string
    positionId: number
    externalId: number
    value: number
    ban: number
    injury: number
    form: number
    squadDepth: any
    fieldOrder: number
    info: number
    portraitUrl: string
    star: number
    setPieces: number
    captain: number
    caps: number
    squadStatus: string
    clubId: number
    inStarting?: boolean
    points: number

    stats?: Statistic[]
    selection?: PlayerSelection
    upcomingMatches: Match[]
}

type Statistic = {
    id: number
    playerId: number
    matchId: number
    goals?: number
    redCard?: number
}

type PlayerSelection = {
    starting: number
    played: number
    captain: number
    teamId: number
    playerId: number
    value: number
}

type Team = {
    id: number
    players: Player[]
    name: string
    userId: number
}

type User = {
    id: number
    firstName: string
    lastName: string
    avatar?: string
    email?: string
    country?: any
    role: number
    teams?: Team[]
}

type Week = {
    id: number
    deadlineDate: Date
}

// type Players = {
//     isFetching: boolean
//     loaded: boolean
//     data: string
// }

type ApplicationState = {
    competition: Competition
}

type Competition = {
    competitionFeed: string
    seasonId: number
    budget: number
    teamSameClubPlayersLimit: number
    officialStartWeek: number
    lineupSize: number
    benchSize: number
    transfersAllowed: number
    weeklyTransfers: boolean
    lineupPositionRows: number[]
    assetsCdn: string
    transferTaxPercentage: number
    redirectURL: string
    transferProfitTaxPercentage: number
    transferCanBeSaved: boolean
    boostersEnabled: boolean
}

type Club = {
    id: number
    name: string
    short: string
    styling: any
    externalId: number
}

type Match = {
    id: number
    weekId?: number
    date: Date
    postposed?: number
    homeScore?: number
    awayScore?: number
    homeId?: number
    awayId?: number
    home?: Club
    away?: Club

}

type MatchEvent = {
    id: number
    type: string

    matchId?: number
    match?: Match

    playerId?: number
    player?: Player

    minute: number
}


// type Transfer = {
//     id?: number
//     datetime?: string
//     weekId?: number
//     inValue?: number
//     outValue?: number
//     inPlayer?: Player
//     outPlayer?: Player
//     extra?: boolean
//     teamId?: number
//     inId?: number | null
//     outId?: number | null
// }

// type MatchState = {
//     id: number
//     weekId: number
//     roundId: any
//     feedUrl: string
//     date: string
//     postponed: number
//     homeScore: number
//     awayScore: number
//     type: any
//     channels: any
//     info: any
//     homeId: string
//     awayId: string
// }

// type Info = {
//     displayWeek: number
//     deadlineWeek: number
//     deadlineDate: string
//     rosterEndWeek: number
// }
