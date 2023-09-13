import { Image, Row } from "antd"
import { PlayerModalStyle } from "./PlayerModalStyle"
import { Col } from "../UI/Grid/Grid"
import { PlayerStyle } from "../PlayerList/PlayerListStyle"
import { PlayerBg } from "../Player/PlayerStyle"
import { getPlayerPositionHexColor } from "@/lib/helpers"
import { theme } from "@/styles/theme"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import Icon from "@ant-design/icons"
import { CaptainButtonSvg, DeleteButtonSvg, RollBackSvg, SwapButtonSvg, ViceCaptainButtonSvg } from "@/styles/custom-icons"

const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;
const DeleteIcon = (props: any) => <Icon component={DeleteButtonSvg} {...props} />;
const SwapIcon = (props: any) => <Icon component={SwapButtonSvg} {...props} />;
const UndoIcon = (props: any) => <Icon component={RollBackSvg} {...props} />;

type PlayerModalProps = {
    player: Player
    club: Club
    visible: boolean
    onCancel: any
    portraitFace?: string
    portraitFaceFallback?: string
    onCaptainSelect?: any
    onViceCaptainSelect?: any
    onRemove?: any
    isSwapAble?: any
    onSwap?: any
    swapPlayerId?: number | null
}

export const PlayerModal = (props: PlayerModalProps) => {
    const { t } = useTranslation();

    const { player, isSwapAble, swapPlayerId } = props;

    const playerPositionColor = getPlayerPositionHexColor(player, theme);
    const PositionLabels: any = {
        0: t('player.coach'),
        1: t('player.goalkeeper'),
        2: t('player.defender'),
        3: t('player.midfielder'),
        4: t('player.attacker')
    };

    const onBgLoadError = (event: any) => {
        if (props.portraitFaceFallback) {
            props.portraitFace = props.portraitFaceFallback;
        }
    };

    const onSwap = (event: any) => {
        props.onSwap(player);
        props.onCancel(event);
    };

    const onRemove = (event: any) => {
        props.onRemove(player);
        props.onCancel(event);
    };

    const onCaptainSelect = (event: any) => {
        props.onCaptainSelect(player);
        props.onCancel(event);
    }

    const onViceCaptainSelect = (event: any) => {
        props.onViceCaptainSelect(player);
        props.onCancel(event);
    }


    const showPointsOverview = useMemo(() => player && player.points != null && player.points !== undefined, [player]);
    const actionColumnSize = useMemo(
        () => Math.floor(24 / (+!!onCaptainSelect + +!!onViceCaptainSelect + +(!!onSwap && (player.id !== swapPlayerId))
            + +(!!onSwap && (player.id === swapPlayerId)) + +!!onRemove)
        ),
        [props]);

    console.log(actionColumnSize);

    return (
        <PlayerModalStyle
            title={player.short}
            open={props.visible}
            onCancel={props.onCancel}
        >
            <Row className="player-info">
                <Col md={6} sm={6} xs={6}>
                    <PlayerStyle className="player-avatar">
                        <Image onError={onBgLoadError} src={props.portraitFace} preview={false} />
                    </PlayerStyle>
                </Col>
                <Col md={18} sm={18} xs={18}>
                    <p className="surname">{player.name}</p>
                    <p className="club">{props.club.name}</p>
                    <p className="position" style={{ color: playerPositionColor }}>{PositionLabels[player.positionId]}</p>

                    {
                        showPointsOverview ?
                            <span className="points">
                                <span className="value">{player.points}</span>
                                <span className="label">{t('general.points')}</span>
                            </span> : null
                    }
                </Col>
            </Row>
            <Row className="player-actions">
                {
                    onCaptainSelect ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onCaptainSelect}>
                                <CaptainIcon />
                                {t('player.captainBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }
                {
                    onViceCaptainSelect ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onViceCaptainSelect}>
                                <ViceCaptainIcon />
                                {t('player.viceCaptainBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    onSwap && isSwapAble && isSwapAble(player) && (player.id !== swapPlayerId) ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onSwap}>
                                <SwapIcon />
                                {t('player.swapBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    onSwap && (player.id === swapPlayerId) ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onSwap}>
                                <UndoIcon />
                                {t('player.undoBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    onRemove && !swapPlayerId ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onRemove}>
                                <DeleteIcon />
                                {t('player.removeBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }
            </Row>
        </PlayerModalStyle>
    );
}