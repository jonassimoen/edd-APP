import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, NoPlayer, OpponentBadge, PlayerBg, PlayerStyle, Points, TopLeftAction, TopRightAction, Value } from "./PlayerStyle";
import { firstLetterUppercased, getPlayerPositionHexColor } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { PlayerType } from "@/types/PlayerTypes";
import Icon, { ArrowDownOutlined, CloseCircleFilled, CloseOutlined, RightSquareFilled, RollbackOutlined, UndoOutlined } from "@ant-design/icons";
import { CaptainButtonSvg, RollBackSvg, SwapButtonSvg, ViceCaptainButtonSvg } from "@/styles/custom-icons";
import { PlayerModal } from "../PlayerModal/PlayerModal";
import config from "@/config";

const AddIcon = (props: any) => <IconPlus {...props} />;
const DeleteIcon = (props: any) => <CloseCircleFilled {...props} style={{ color: "red" }} shape="circle" />;
const SwapIcon = (props: any) => <Icon component={SwapButtonSvg} {...props} />;
const UndoIcon = (props: any) => <Icon component={RollBackSvg} {...props} />;
const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;

declare type PlayerState = {
	modalVisible: boolean
	// shirtSoccer?: string
	portraitFace?: string
	portraitFaceFallBack?: string
}

declare type PlayerProps = {
	player: Player
	portraitFace?: string
	portraitFaceFallBack?: string
	avatarOnly?: boolean
	badgeColor: string
	badgeBgColor: string
	pointsColor: string
	pointsBgColor: string
	positionIndex?: number
	captainId?: number
	viceCaptainId?: number
	onPlaceholderClick?: any
	actionLessPlayerIds?: any[]
	swapPlayerId?: number | null
	positionLabel?: string
	showCaptainBadge?: boolean
	club?: Club
	isSwapable?: any
	swappedFrom?: string|null
	modalEnabled?: boolean
	onRemove?: any
	onSwap?: any
	onCaptainSelect?: any
	onViceCaptainSelect?: any

	className?: string
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
		onPlaceholderClick,
		actionLessPlayerIds,
		swapPlayerId,
		positionLabel,
		isSwapable,
		showCaptainBadge,
		swappedFrom,
		onRemove,
		onSwap,
		onCaptainSelect,
		onViceCaptainSelect,
	} = props;
	const [state, setState] = useState<PlayerState>({
		portraitFace: props.portraitFace,
		portraitFaceFallBack: props.portraitFaceFallBack,
		modalVisible: false,
	});

	useEffect(() => {
		setState({
			...state,
			portraitFace: `${config.API_URL}/static/${player.externalId}.png`,
			portraitFaceFallBack: `${config.API_URL}/static/dummy.png`,	
		});
	}, [player]);


	const gamePositionIdToLabels = [
		{ id: 0, name: t("player.coach") },
		{ id: 1, name: t("player.goalkeeper") },
		{ id: 2, name: t("player.defender") },
		{ id: 3, name: t("player.midfielder") },
		{ id: 4, name: t("player.attacker") }
	];
	const currentPositionLabel = gamePositionIdToLabels.find((item: any) => !!(item.id === positionIndex));
	const playerPositionColor = useMemo(() => getPlayerPositionHexColor(player, theme), [player]);

	const swappedAlreadyFromPlayerArea = useMemo(() => (onSwap && swapPlayerId && player && (swappedFrom === 'starting' && player.inStarting) && swapPlayerId !== player.id), [player, swappedFrom])
	const hasInactiveOverlay = useMemo(() => swappedAlreadyFromPlayerArea || (swapPlayerId && !swappedAlreadyFromPlayerArea && isSwapable && !isSwapable(player)), [player, isSwapable]);
	const hasModal = !!props.modalEnabled;

	const playerName = useMemo(() =>
		(player && player.id && player.short) ||
		(player && player.id && `${player.surname} ${player.forename && firstLetterUppercased(player.forename)}.`) ||
		`${currentPositionLabel ? currentPositionLabel.name : t("general.choosePlayer")}`,
		[player]);
		
	const opponentInfo = useMemo(
		() => {
			if(player && player.upcomingMatches && player.upcomingMatches.length) {
				const nextMatch = player.upcomingMatches[0];
				return {
					playing: nextMatch.homeId === player.clubId ? t('player.opponentHome') : t('player.opponentAway'),
					opponentShort: nextMatch.homeId === player.clubId ? nextMatch.away.short : nextMatch.home.short,
				}
			} else {
				return null;
			}
		}
		, [player]
	);

	const hasStats = useMemo(() => player && player.stats && player.stats.length, [player]);
	const hasActions = useMemo(() => player && player.id && (actionLessPlayerIds || []).indexOf(player.id) === -1, [player]);
	const isCaptain = useMemo(() => player && player.id && player.id === captainId, [player, captainId]);
	const isViceCaptain = useMemo(() => player && player.id && player.id === viceCaptainId, [player, viceCaptainId]);

	const showPoints = true;
	const showPlayerName = !avatarOnly;

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
		if(state.portraitFaceFallBack) {
			setState({ ...state, portraitFace: state.portraitFaceFallBack,});
		}
	};

	return (
		<PlayerStyle onClick={(e: any) => onPlayerClick(!hasInactiveOverlay)} className={`position_${player.positionId}` && props.className}>
			{
				player && player.id &&
				<PlayerBg src={state.portraitFace} onError={onBgLoadError} inactive={hasInactiveOverlay} />
			}

			{
				showPlayerName &&   // badgeBgColor of playerPositionColor // span: color: pointsColor
				<Badge color={badgeColor} bgColor={playerPositionColor}>
					<span style={{ color: "white" }}>{playerName}</span>
				</Badge>
			}

			{
				showPoints && hasStats && player.points !== null && player.points !== undefined &&
				<Points color={"#000"} bgColor={isCaptain || isViceCaptain ? "#ffc422" : "#00fe82"}>{player.points}</Points>
			}

			{
				opponentInfo ?
					<OpponentBadge color={'#000'} bgColor={'#fff'}>
						<p style={{fontSize: '10px'}}>
							{`${opponentInfo.opponentShort} (${opponentInfo.playing})`}
						</p>
					</OpponentBadge> : null
			}

			{
				!player || (player && !player.id) &&
				<NoPlayer onClick={onPlaceholderClick ? (e: any) => onPlaceholderClick(player) : () => { }}>
					<AddIcon style={{ fontSize: "2em", color: theme.primaryContrast, cursor: "pointer" }} />
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
				player && positionLabel && positionLabel.length &&
				<span className="position-label">{positionLabel}</span>
			}

			{
				player && player.id && props.club && hasModal ?
					<PlayerModal
						visible={state.modalVisible}
						onCancel={onCancel}
						portraitFace={state.portraitFace}
						portraitFaceFallback={state.portraitFaceFallBack}
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