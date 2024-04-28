import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, NoPlayer, OpponentBadge, PlayerBg, PlayerStyle, Points, TopLeftAction, TopRightAction, Value } from "./PlayerStyle";
import { firstLetterUppercased, getPlayerPositionHexColor } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { PlayerType } from "@/types/PlayerTypes";
import Icon, { ArrowDownOutlined, CloseCircleFilled, CloseOutlined, RightSquareFilled, RollbackOutlined, UndoOutlined } from "@ant-design/icons";
import { CaptainButtonSvg, RacketSvg, RollBackSvg, SwapButtonSvg, ViceCaptainButtonSvg } from "@/styles/custom-icons";
import { PlayerModal } from "../PlayerModal/PlayerModal";
import config from "@/config";

const AddIcon = (props: any) => <IconPlus {...props} />;
const DeleteIcon = (props: any) => <CloseCircleFilled {...props} style={{ color: "red" }} shape="circle" />;
const SwapIcon = (props: any) => <Icon component={SwapButtonSvg} {...props} />;
const UndoIcon = (props: any) => <Icon component={RollBackSvg} {...props} />;
const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;
const BoosterIcon = (props: any) => <Icon component={RacketSvg} {...props} />;

declare type PlayerState = {
	modalVisible: boolean
	face?: string
	faceFallback?: string
	shirt?: string
	shirtFallback?: string
}

declare type PlayerProps = {
	player: Player
	type: PlayerType
	avatarOnly?: boolean
	badgeColor: string
	badgeBgColor: string
	pointsColor: string
	pointsBgColor: string
	positionIndex?: number
	captainId?: number
	captainHasPlayed?: boolean
	viceCaptainId?: number
	onPlaceholderClick?: any
	actionLessPlayerIds?: any[]
	swapPlayerId?: number | null
	positionLabel?: string
	showCaptainBadge?: boolean
	showBoosterBadge?: boolean
	club?: Club
	isSwapable?: any
	swappedFrom?: string | null
	modalEnabled?: boolean
	onRemove?: any
	onSwap?: any
	onCaptainSelect?: any
	onViceCaptainSelect?: any
	benchPlayer?: boolean
	showPlayerValue?: boolean
	showPlayerValueInsteadOfPoints?: boolean
	replacePlayerPointsWithStatsPoints?: boolean

	face?: string
	faceFallback?: string
	shirt?: string
	shirtFallback?: string

	className?: string
	motm?: boolean

	tourRef?: any
}

export const Player = (props: PlayerProps) => {
	const { t } = useTranslation();
	const {
		player,
		avatarOnly,
		badgeColor,
		badgeBgColor,
		pointsColor,
		pointsBgColor,
		positionIndex,
		captainId,
		viceCaptainId,
		captainHasPlayed,
		onPlaceholderClick,
		actionLessPlayerIds,
		swapPlayerId,
		positionLabel,
		isSwapable,
		showCaptainBadge,
		showBoosterBadge,
		swappedFrom,
		onRemove,
		onSwap,
		onCaptainSelect,
		onViceCaptainSelect,
		showPlayerValueInsteadOfPoints,
		showPlayerValue,
		benchPlayer,
		replacePlayerPointsWithStatsPoints,
		type,
		motm,
		tourRef,
	} = props;

	const [state, setState] = useState<PlayerState>({
		face: props.face,
		faceFallback: props.faceFallback,
		shirt: props.shirt,
		shirtFallback: props.shirtFallback,
		modalVisible: false,
	});

	useEffect(() => setState({
		...state,
		face: props.face,
		faceFallback: props.faceFallback,
		shirt: props.shirt,
		shirtFallback: props.shirtFallback,
	}), [props]);


	const gamePositionIdToLabels = [
		{ id: 0, name: t("player.coach") },
		{ id: 1, name: t("player.goalkeeper") },
		{ id: 2, name: t("player.defender") },
		{ id: 3, name: t("player.midfielder") },
		{ id: 4, name: t("player.attacker") }
	];
	const currentPositionLabel = gamePositionIdToLabels.find((item: any) => !!(item.id === positionIndex));
	const playerPositionColor = useMemo(() => getPlayerPositionHexColor(player, theme), [player]);

	const swappedAlreadyFromPlayerArea = useMemo(() => (onSwap && swapPlayerId && player && (swappedFrom === "starting" && player.inStarting) && swapPlayerId !== player.id), [player, swappedFrom]);
	const hasInactiveOverlay = useMemo(() => swappedAlreadyFromPlayerArea || (swapPlayerId && !swappedAlreadyFromPlayerArea && isSwapable && !isSwapable(player)), [player, isSwapable]);
	const hasModal = !!props.modalEnabled;

	const playerName = useMemo(() =>
		(player && player.id && player.short) ||
		(player && player.id && `${player.surname} ${player.forename && firstLetterUppercased(player.forename)}.`) ||
		`${currentPositionLabel ? currentPositionLabel.name : t("general.choosePlayer")}`, [player]
	);

	const opponentInfo = useMemo(
		() => {
			if (player && player.upcomingMatches && player.upcomingMatches.length) {
				const nextMatch = player.upcomingMatches[0];
				return {
					playing: nextMatch.home?.id === player.clubId ? t("player.opponentHome") : t("player.opponentAway"),
					opponentShort: nextMatch.home?.id === player.clubId ? nextMatch.away?.short || t("general.team.tbd"): nextMatch.home?.short || t("general.team.tbd"),
				};
			} else {
				return null;
			}
		}
		, [player]
	);

	const hasStats = useMemo(() => player && player.stats && !!player.stats.length, [player]);
	const hasActions = useMemo(() => player && player.id && (actionLessPlayerIds || []).indexOf(player.id) === -1, [player]);
	const isCaptain = useMemo(() => player && player.id && player.id === captainId, [player, captainId]);
	const isViceCaptain = useMemo(() => player && player.id && player.id === viceCaptainId, [player, viceCaptainId]);
	const hasBooster = useMemo(() => player && !!player.booster, [player]);

	const showPoints = (player && player.points !== undefined && player.points !== null) || showPlayerValueInsteadOfPoints || replacePlayerPointsWithStatsPoints;
	const showPlayerName = !avatarOnly;

	useEffect(() => {
		if (player && replacePlayerPointsWithStatsPoints && hasStats) {
			const statsPointsCurrentWeek = player.stats.reduce((acc: number, stat: any) => acc + stat.points, 0);
			const captainOrViceCaptainPoints = (isCaptain && captainHasPlayed) || (!captainHasPlayed && isViceCaptain);
			const statsPointsCurrentWeekFactor = captainOrViceCaptainPoints ? 1.5 : 1;
			player.points = player.stats ? statsPointsCurrentWeek * statsPointsCurrentWeekFactor : null;
		}
	}, [player, isCaptain, captainHasPlayed, isViceCaptain]);

	const onRemoveHandler = (e: any, player: Player) => {
		e.stopPropagation();
		onRemove(player);
	};

	const onSwapHandler = (e: any, player: Player) => {
		e.stopPropagation();
		onSwap(player);
	};

	const onPlayerClick = (showModal?: boolean) => {
		if (props.player && props.player.id && showModal) {
			setState({ ...state, modalVisible: true });
		}
	};

	const onCancel = (event: any) => {
		event.stopPropagation();
		setState({ ...state, modalVisible: false });
	};

	const onBgLoadError = (event: any) => {
		if (state.faceFallback) {
			setState({ ...state, face: state.faceFallback, });
		}
	};
	
	return (
		<PlayerStyle 
			onClick={(e: any) => onPlayerClick(!hasInactiveOverlay)} 
			className={`position_${player.positionId}` && props.className}
			ref={tourRef}
		>
			{
				player && player.id &&
				<PlayerBg src={state.face} onError={onBgLoadError} inactive={hasInactiveOverlay} />
			}

			{
				showPlayerName &&   // badgeBgColor of playerPositionColor // span: color: pointsColor
				<Badge bgColor={motm ? "#c4a747" : badgeBgColor}>
					<span style={{ color: badgeColor }}>{playerName}</span>
				</Badge>
			}

			{
				showPoints && hasStats && (player.played != null ? !!player.played : player.points != null) &&
				<Points color={"#000"} bgColor={(isCaptain && captainHasPlayed) || (!captainHasPlayed && isViceCaptain) ? "#ffc422" : props.pointsBgColor}>{player.points}</Points>
			}

			{
				opponentInfo ?
					<OpponentBadge color={pointsColor} bgColor={pointsBgColor}>
						<p>
							{`${opponentInfo.opponentShort} (${opponentInfo.playing})`}
						</p>
					</OpponentBadge> : null
			}
			{
				(
					player && showPlayerValue &&
					<Value benchPlayer={benchPlayer} color={pointsColor} bgColor={pointsBgColor}>
						<span>{(player.value) ? `€${player.value}M` : null}</span>
					</Value>
				) || null
			}
			{
				!player || (player && !player.id) &&
				// todo
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				<NoPlayer onClick={onPlaceholderClick ? (e: any) => onPlaceholderClick(player) : () => { }}>
					<AddIcon className="add-icon" />
				</NoPlayer>
			}

			{
				player && hasActions && onRemove &&
				<TopLeftAction onClick={(e: any) => onRemoveHandler(e, player)} bgColor={theme.primaryContrast}>
					<DeleteIcon />
				</TopLeftAction>
			}

			{
				player && isSwapable && onSwap && isSwapable(player) && swapPlayerId !== player.id && player.positionId !== 0 &&
				<TopLeftAction onClick={(e: any) => onSwapHandler(e, player)} bgColor={theme.primaryContrast}>
					<SwapIcon style={{ fontSize: "20px" }} />
				</TopLeftAction>
			}

			{
				player && onSwap && (swapPlayerId && swapPlayerId === player.id) &&
				<TopLeftAction onClick={(e: any) => onSwapHandler(e, player)} bgColor={theme.primaryContrast}>
					<UndoIcon style={{ fontSize: "20px" }} />
				</TopLeftAction>
			}

			{
				player && isCaptain && showCaptainBadge &&
				<TopRightAction bgColor={theme.primaryColor}>
					<CaptainIcon style={{ fontSize: 18 }} />
				</TopRightAction>
			}

			{
				player && isViceCaptain && showCaptainBadge &&
				<TopRightAction bgColor={theme.primaryColor}>
					<ViceCaptainIcon style={{ fontSize: 18 }} />
				</TopRightAction>
			}

			{
				player && hasBooster && showBoosterBadge &&
				<TopLeftAction bgColor={theme.primaryColor}>
					<BoosterIcon style={{ fontSize: 18 }} />
				</TopLeftAction>
			}

			{
				player && positionLabel && positionLabel.length &&
				<span className="position-label">{positionLabel}</span>
			}
			{
				player && player.id && props.club && hasModal ?
					<PlayerModal
						visible={state.modalVisible}
						onCancel={onCancel}
						portraitFace={state.face}
						portraitFaceFallback={state.faceFallback}
						player={player}
						club={props.club}
						swapPlayerId={swapPlayerId}
						onCaptainSelect={onCaptainSelect}
						onViceCaptainSelect={onViceCaptainSelect}
						onRemove={onRemove}
						isSwapAble={isSwapable}
						onSwap={onSwap}
					/> :
					null
			}
		</PlayerStyle>

	);
};