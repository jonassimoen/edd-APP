import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, NoPlayer, PlayerBg, PlayerStyle, Points, TopLeftAction, TopRightAction, Value } from "./PlayerStyle";
import { firstLetterUppercased, getPlayerPositionHexColor } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { PlayerType } from "@/types/PlayerTypes";
import Icon, { ArrowDownOutlined, CloseCircleFilled, CloseOutlined, RightSquareFilled, RollbackOutlined } from "@ant-design/icons";
import { CaptainButtonSvg, ViceCaptainButtonSvg } from "@/styles/custom-icons";

const AddIcon = (props: any) => <IconPlus {...props} />;
const DeleteIcon = (props: any) => <CloseCircleFilled {...props} style={{ color: "red" }} shape="circle" />;
const SwapIcon = (props: any) => <ArrowDownOutlined {...props} />;
const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;

declare type PlayerState = {
	// modalVisible: boolean
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
	positionIndex?: number
	captainId: number
	viceCaptainId: number
	onPlaceholderClick?: any
	actionLessPlayerIds: any[]
	swapPlayerId?: number | null
	positionLabel?: string
	showCaptainBadge?: boolean

	isSwapable?: any

	onRemove?: any
	onSwap?: any
}

export const Player = (props: PlayerProps) => {
	const { t } = useTranslation();
	const {
		player,
		avatarOnly,
		badgeColor,
		badgeBgColor,
		pointsColor,
		positionIndex,
		captainId,
		viceCaptainId,
		onPlaceholderClick,
		actionLessPlayerIds,
		swapPlayerId,
		positionLabel,
		isSwapable,
		showCaptainBadge,

		onRemove,
		onSwap,
	} = props;
	const [state, setState] = useState<PlayerState>({
		portraitFace: props.portraitFace,
		portraitFaceFallBack: props.portraitFaceFallBack
	});

	useEffect(() => {
		setState({
			...state,
			portraitFace: `http://localhost:8080/static/${player.externalId}.png`,
			portraitFaceFallBack: 'http://localhost:8080/static/dummy.png',	
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
	const playerName = useMemo(() =>
		(player && player.id && player.short) ||
		(player && player.id && `${player.surname} ${player.forename && firstLetterUppercased(player.forename)}.`) ||
		`${currentPositionLabel ? currentPositionLabel.name : t("general.choosePlayer")}`,
		[player]);

	const hasStats = useMemo(() => player && player.stats && player.stats.length, [player]);
	const hasActions = useMemo(() => player && player.id && (actionLessPlayerIds || []).indexOf(player.id) === -1, [player]);
	const isCaptain = player && player.id && player.id === captainId;
	const isViceCaptain = player && player.id && player.id === viceCaptainId;

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

	const onBgLoadError = (event: any) => {
		if(state.portraitFaceFallBack) {
			setState({ ...state, portraitFace: state.portraitFaceFallBack,});
		}
	}

	return (
		<PlayerStyle onClick={() => console.log("clicked on player")} className={`position_${player.positionId}`}>
			{
				player && player.id &&
				<PlayerBg src={state.portraitFace} onError={onBgLoadError} />
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
				!player || (player && !player.id) &&
				<NoPlayer onClick={onPlaceholderClick ? (e: any) => onPlaceholderClick(player) : () => { }}>
					<AddIcon style={{ fontSize: "2em", color: theme.primaryContrast, cursor: "pointer" }} />
				</NoPlayer>
			}

			{
				player && hasActions && onRemove &&
				<TopLeftAction className="delete" onClick={(e: any) => onRemoveHandler(e, player)} bgColor={theme.primaryContrast}>
					<DeleteIcon />
				</TopLeftAction>
			}

			{
				player && isSwapable && onSwap && isSwapable(player) && swapPlayerId !== player.id && player.positionId !== 0 &&
				<TopLeftAction className="delete" onClick={(e: any) => onRemoveHandler(e, player)} bgColor={theme.primaryContrast}>
					<SwapIcon style={{ fontSize: "20px" }} />
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
		</PlayerStyle>

	);
};