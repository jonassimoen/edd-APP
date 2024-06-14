type StoreState = {
	user: UserState
	players: Player[]
	application: ApplicationState
	clubs: Club[]
	matches: Match[]
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
	banned: number
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
	played?: boolean
	points: number
	pointsOverview: any
	booster: string
	pSelections?: number
	stats?: Statistic[]
	selections?: PlayerSelection[]
	upcomingMatches: Match[]
	currentMatches: Match[]
}

type Statistic = {
	id?: number
	playerId: number
	matchId: number
	points?: number

	starting?: boolean
	minutesPlayed?: number
	shots?: number
	shotsOnTarget?: number
	goals?: number
	assists?: number
	saves?: number
	keyPasses?: number
	passAccuracy?: number
	tackles?: number
	blocks?: number
	interceptions?: number
	dribblesAttempted?: number
	dribblesSuccess?: number
	dribblesPast?: number
	foulsDrawn?: number
	foulsCommited?: number
	penaltyScored?: number
	penaltyCommited?: number
	penaltyMissed?: number
	penaltyWon?: number
	penaltySaved?: number
	duelsWon?: number
	duelsTotal?: number
	yellow?: number
	red?: number
	motm?: boolean
}

type PlayerSelection = {
	starting: number
	played: number
	captain: number
	teamId: number
	playerId: number
	value: number
	booster?: string
}

type Team = {
	id: number
	players: Player[]
	name: string
	userId: number
	weekId: number
	budget: number
	rank: number
	points: number
	
	// Boosters
	tripleCaptain?: number
	superSubs?: number
	freeHit?: number
	hiddenGem?: number
	goalRush?: number
	fanFavourite?: number
}

type Boosters = {
	tripleCaptain?: number
	superSubs?: number
	freeHit?: number
	hiddenGem?: number
	goalRush?: number
	fanFavourite?: number
}

type User = {
	id: number
	firstName: string
	lastName: string
	avatar?: string
	email?: string
	country?: any
	role: number
	payed?: boolean
	banned?: boolean
	teams?: Team[]
	notification?: any
}

type Week = {
	id: number
	maxTransfers: number
	maxSameClub: number
	deadlineDate: Date
	validated: boolean
	name: string
}

type Page = {
	translation: PageTranslation[]
	id: number
	slug: string
	competitionFeed: string
	thumbnail: any
	created: string
	modified: string
}

type PageTranslation = {
	id?: number
	langCode: string
	body: string
	title?: any
	pageId?: number
}

type ApplicationState = {
	competition: Competition
	title: string
	clubs: Club[]
	players: Player[]
	playersLoading: boolean
	clubsLoading: boolean
	playersSuccess: boolean
	clubsSuccess: boolean
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
	players?: Player[]
}

type Match = {
	id: number
	weekId?: number
	date: Date
	postposed?: number
	homeScore?: number
	awayScore?: number
	home?: Club
	away?: Club
	status?: string
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


type Transfer = {
	id?: number
	datetime?: string
	weekId?: number
	inValue?: number
	outValue?: number
	inPlayer?: Player
	outPlayer?: Player
	extra?: boolean
	teamId?: number
	inId?: number | null
	outId?: number | null
}

// type MatchState = {
//		 id: number
//		 weekId: number
//		 roundId: any
//		 feedUrl: string
//		 date: string
//		 postponed: number
//		 homeScore: number
//		 awayScore: number
//		 type: any
//		 channels: any
//		 info: any
//		 homeId: string
//		 awayId: string
// }

type DeadlineInfo = {
	displayWeek: number
	deadlineWeek: number
	deadlineDate: string
	endWeek: number
	fT: number
	sC: number
}

type BoostersWeekStatus = {
	tripleCaptain: boolean,
	fanFavourite: boolean,
	goalRush: boolean,
	hiddenGem: boolean,
	superSubs: boolean,
	freeHit: boolean,
}

type Article = {
	id: number,
	slug: string,
	title: string,
	description: string,
	timestampCreated: Date,
	timestampUpdated: Date,
	readMore: boolean,
	imageUrl: string,
	author: {firstName: string},
}