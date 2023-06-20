import { ActionIcon, Container, Paper } from "@mantine/core"
import { IconCrossFilled, IconMinus, IconPlus } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Badge, NoPlayer, PlayerBg, PlayerStyle, Points, TopLeftAction, Value } from "./PlayerStyle"
import { firstLetterUppercased, getPlayerPositionHexColor } from "@/lib/helpers"
import { theme } from "@/styles/theme"
import { PlayerType } from "@/types/PlayerTypes"
import { CloseCircleFilled, CloseOutlined, RightSquareFilled, RollbackOutlined } from "@ant-design/icons"

const AddIcon = (props: any) => <IconPlus {...props} />
const DeleteIcon = (props: any) => <CloseCircleFilled {...props} style={{ color: 'red' }} shape="circle" />



// const AddIcon = (props: any) => <Icon component={AddButtonSvg} {...props} />;
// const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
// const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;
// const SwapIcon = (props: any) => <Icon component={SwapButtonSvg} {...props} />;
// const UndoIcon = (props: any) => <Icon component={RollBackSvg} {...props} />;
// const DeleteIcon = (props: any) => <Icon component={DeleteButtonSvg} {...props} />;

declare type PlayerState = {
    modalVisible: boolean
    shirtSoccer?: string
    portraitFace?: string
}

declare type PlayerProps = {
    type: PlayerType;
    bgShirt?: string;
    bgPortrait?: string;
    bgJersey?: string;
    player: any;
    badgeColor: string;
    badgeBgColor: string;
    pointsColor: string;
    pointsBgColor: string;
    positionIndex?: number;
    shirtCycling?: string;
    shirtSoccer?: string;
    portraitFace?: string;
    portraitFaceFallBack?: string;
    soccerJersey?: string;
    onRemove?: any;
    isSwapAble?: any;
    modalEnabled?: any;
    onPlaceholderClick?: any;
    swapPlayerId?: number | null;
    swappedFrom?: string | null;
    positionLabel?: string;
    onSwap?: any;
    onCaptainSelect?: any;
    onViceCaptainSelect?: any;
    actionLessPlayerIds?: any[];
    showPlayerValue?: boolean;
    showCaptainBadge?: boolean;
    showPlayerStatsPoints?: boolean;
    showPlayerValueInsteadOfPoints?: boolean;
    benchPlayer?: boolean;
    club?: Club;
    captainId?: number;
    // boosterWeekStatus?: BoostersWeekStatus;
    viceCaptainId?: number;
    captainHasPlayed?: boolean;
    avatarOnly?: boolean;
    shirtFallback?: string;
    clubBadge?: string;
}

export const Player = (props: PlayerProps) => {
    const { t } = useTranslation();
    const [state, setState] = useState<PlayerState>({
        // TODO: initial state 
        modalVisible: false,
        shirtSoccer: props.shirtSoccer
    });

    const onCancel = (event: any) => {
        event.stopPropagation();
        setState({ ...state, modalVisible: false })
    }

    const onPlayerClick = (showModal?: boolean) => {
        if (props.player && props.player.id && showModal) {
            setState({ ...state, modalVisible: true });
        }
    }

    const onBgLoad = () => {
        if (props.shirtFallback) {
            setState({ ...state, shirtSoccer: props.shirtFallback });
        }

        if (props.portraitFaceFallback) {
            setState({ ...state, portraitFace: props.portraitFaceFallback })
        }
    }

    const onSwapEvent = (event: any, player: Player) => {
        event.stopPropagation();
        props.onSwap(player);
    }

    const onRemoveHandler = (event: any, player: Player) => {
        event.stopPropagation();
        props.onRemove(player);
    }

    const { player,
        captainId,
        viceCaptainId,
        swapPlayerId,
        onSwap,
        swappedFrom,
        onPlaceHolderClick,
        badgeColor,
        badgeBgColor,
        positionLabel,
        avatarOnly,
        positionIndex,
        isSwapAble,
        type,
        showPlayerValue,
        benchPlayer,
        onRemove,
        actionLessPlayerIds,
        showPlayerValueInsteadOfPoints,
        showPlayerStatsPoints,
    } = props;
    const { shirtSoccer, portraitFace, modalVisible } = state;

    useEffect(() => {
        setState({ ...state, portraitFace: props.portraitFace });
    }, [props.portraitFace])

    if (player) { // check upcoming matches
        // next match info + opponent
    }

    const isCaptain = player && player.id && player.id === captainId;
    const isViceCaptain = player && player.id && player.id === viceCaptainId;
    const swappedFromPlayerArea = onSwap && swapPlayerId && player && (swappedFrom === "starting" && player.inStarting) && swapPlayerId !== player.id;
    const showPlayerName = !avatarOnly;

    const gamePositionIdToLabels = [
        { id: 1, name: t('player.goalkeeper') },
        { id: 2, name: t('player.defender') },
        { id: 3, name: t('player.midfielder') },
        { id: 4, name: t('player.attacker') }
    ];
    const currentPositionLabel = gamePositionIdToLabels.find((item: any) => !!(item.id === positionIndex))
    const playerName = (player && player.id && player.short) || (player && player.id && `${player.surname} ${player.forename && firstLetterUppercased(player.forename)}.`) || `${t('general.choosePlayer')}`;

    const playerPositionColor = getPlayerPositionHexColor(player, theme);
    const swappedAlreadyFromPlayerArea = onSwap && swapPlayerId && player && (swappedFrom === 'starting' && player.inStarting) && swapPlayerId !== player.id;
    const hasInactiveOverlay = swappedAlreadyFromPlayerArea || (swapPlayerId && !swappedAlreadyFromPlayerArea && isSwapAble && !isSwapAble(player));

    const ignoredPlayersIdsForActions = actionLessPlayerIds || [];
    const playerHasAction = player && player.id && ignoredPlayersIdsForActions.indexOf(player.id) === -1;
    const pointsEnabled = (player && player.points !== undefined && player.points !== null) || showPlayerValueInsteadOfPoints || showPlayerStatsPoints;
    const hasStats = player && player.stats && player.stats.length;

    return (
        <PlayerStyle onClick={() => onPlayerClick()} className="player"
        >
            {player && player.id && type === PlayerType.SoccerPortrait && <PlayerBg src={portraitFace} inactive={hasInactiveOverlay} />}

            {
                showPlayerName ?
                    <Badge color={badgeColor} bgColor={type === PlayerType.SoccerShirt ? playerPositionColor : theme.primaryContrast}>
                        <span style={{ color: "#FFF" }}>{playerName}</span>
                    </Badge>
                    :
                    null
            }

            {
                pointsEnabled && hasStats && player && player.points !== null && player.points !== undefined ?
                    <Points color={'#000'} bgColor={isCaptain || isViceCaptain ? '#ffc422' : '#00fe82'}> {player.points} </Points> : null
            }

            {
                (
                    player && showPlayerValue &&
                    <Value benchPlayer={benchPlayer}>
                        <span>{(player.value) ? `€${player.value}M` : null}</span>
                    </Value>
                ) || null
            }

            {(player && playerHasAction && onRemove &&
                <TopLeftAction className="delete" onClick={(e: any) => onRemoveHandler(e, player)} bgColor={theme.primaryColor}>
                    <DeleteIcon />
                </TopLeftAction>) || null
            }
            {(player && onSwap && isSwapAble && isSwapAble(player) && !swappedAlreadyFromPlayerArea && swapPlayerId !== player.id && player.positionId !==0 &&
					<TopLeftAction onClick={(e: any) => onSwapEvent(e, player)} bgColor={theme.primaryColor}>
						<RightSquareFilled style={{fontSize: '20px'}} />
					</TopLeftAction>) || null}

            {
                player && positionLabel && positionLabel.length ?
                    <span className="position-label">{positionLabel}</span> : null
            }

            {((!player || (player && !player.id)) &&
                <NoPlayer onClick={onPlaceHolderClick ? () => onPlaceHolderClick(player) : (() => { })} style={{ margin: '0 auto' }}
                >
                    <AddIcon style={{ cursor: 'pointer', fontSize: '2em', width: '100%', color: badgeBgColor }} />
                </NoPlayer>
            )}
        </PlayerStyle>

    );
}