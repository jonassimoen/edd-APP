import { Image, Row } from "antd"
import { PlayerModalStyle, PointsOverviewTable } from "./PlayerModalStyle"
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

const PlayerActionsPoints: any = {
    yellowCard: { 1: -1, 2: -1, 3: -1, 4: -1 },
    redCard: { 1: -3, 2: -3, 3: -3, 4: -3 },
    ownGoal: { 1: -2, 2: -2, 3: -2, 4: -2 },
    playedUpTo60Min: { 1: 1, 2: 1, 3: 1, 4: 1 },
    playedMoreThan60Min: { 1: 2, 2: 2, 3: 2, 4: 2 },
    drawMatch: { 1: 0, 2: 0, 3: 0, 4: 0 },
    assists: { 1: 3, 2: 3, 3: 3, 4: 3 },
    goals: { 1: 6, 2: 6, 3: 5, 4: 4 },
    missedPenalty: { 1: -2, 2: -2, 3: -2, 4: -2 },
    stoppedPenalty: { 1: 5, 2: 0, 3: 0, 4: 0 },
    cleanSheet: { 1: 4, 2: 4, 3: 1, 4: 0 },
    goalTaken: { 1: -1, 2: -1, 3: 0, 4: 0 },
    savesPerTwo: { 1: 1, 2: 0, 3: 0, 4: 0 },
    bonus: {}
};

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

    const getPointsOverviewList = (player: any) => {
        const pointsOverview: any = [];
        Object.keys(PlayerActionsPoints)
            .map((actionName: string) => {
                const actionPoints = PlayerActionsPoints[actionName][player.positionId];
                switch (actionName) {
                    case 'playedUpTo60Min': {
                        const playedUpTo60Min = player.pointsOverview && player.pointsOverview.minutesPlayed && player.pointsOverview.minutesPlayed < 60;

                        if (playedUpTo60Min) {
                            pointsOverview.push({ action: t('player.playedUpTo60MinLabel'), quantity: 1, points: actionPoints });
                        }
                        break;
                    };
                    case 'playedMoreThan60Min': {
                        const playedMoreThan60Min = player.pointsOverview && player.pointsOverview.minutesPlayed && player.pointsOverview.minutesPlayed >= 60;

                        if (playedMoreThan60Min) {
                            pointsOverview.push({ action: t('player.playedMoreThan60MinLabel'), quantity: 1, points: actionPoints });
                        }
                        break;
                    };
                    case 'savesPerTwo': {
                        const saves = player.pointsOverview && player.pointsOverview.saves;
                        const savesPerTwo = Math.floor(saves / 2);

                        if (savesPerTwo) {
                            pointsOverview.push({ action: t('player.savedPerTwoLabel'), quantity: saves, points: savesPerTwo * actionPoints })
                        }
                        break;
                    }
                    case 'assists': {
                        const assists = player.pointsOverview && player.pointsOverview.assists || 0;
                        if (assists) {
                            pointsOverview.push({ action: t('player.assistsLabel'), quantity: assists, points: assists * actionPoints });
                        }
                        break;
                    };

                    case 'goals': {
                        const goals = player.pointsOverview && player.pointsOverview.goals || 0;
                        if (goals) {
                            pointsOverview.push({ action: t('player.goalsLabel'), quantity: goals, points: goals * actionPoints });
                        }
                        break;
                    };

                }
            });
        return pointsOverview;
    }


    const showPointsOverview = useMemo(() => player && player.points, [player]);
    const pointsOverview = useMemo(() => showPointsOverview ? getPointsOverviewList(player) : [], [player]);
    console.log(player.short, pointsOverview);

    const actionColumnSize = useMemo(
        () => Math.floor(24 / (+!!onCaptainSelect + +!!onViceCaptainSelect + +(!!onSwap && (player.id !== swapPlayerId))
            + +(!!onSwap && (player.id === swapPlayerId)) + +!!props.onRemove)
        ),
        [props]);

    return (
        <PlayerModalStyle
            title={player.short}
            open={props.visible}
            onCancel={props.onCancel}
            footer={[]}
        >
            <Row className="player-header">
                <Col md={6} sm={6} xs={6}>
                    <PlayerStyle className="player-avatar">
                        <Image onError={onBgLoadError} src={props.portraitFace} preview={false} />
                    </PlayerStyle>
                </Col>
                <Col md={12} sm={12} xs={12}>
                    <p className="surname">{player.name}</p>
                    <p className="club">{props.club.name}</p>
                    <p className="position" style={{ color: playerPositionColor }}>{PositionLabels[player.positionId]}</p>

                </Col>
                {
                    showPointsOverview ?
                        <Col md={6} sm={6} xs={6}>
                            <span className="points">
                                <span className="value">{player.points}</span>
                                <span className="label">{t('general.points')}</span>
                            </span>
                        </Col> : null
                }
            </Row>
            <Row className="player-actions">
                {
                    props.onCaptainSelect ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onCaptainSelect}>
                                <CaptainIcon />
                                {t('player.captainBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }
                {
                    props.onViceCaptainSelect ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onViceCaptainSelect}>
                                <ViceCaptainIcon />
                                {t('player.viceCaptainBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    props.onSwap && isSwapAble && props.isSwapAble(player) && (player.id !== swapPlayerId) ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onSwap}>
                                <SwapIcon />
                                {t('player.swapBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    props.onSwap && (player.id === swapPlayerId) ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onSwap}>
                                <UndoIcon />
                                {t('player.undoBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }

                {
                    props.onRemove && !swapPlayerId ?
                        <Col md={actionColumnSize} sm={actionColumnSize} xs={actionColumnSize}>
                            <div className="action" onClick={onRemove}>
                                <DeleteIcon />
                                {t('player.removeBadgeLabel')}
                            </div>
                        </Col> :
                        null
                }
            </Row>
            {
                showPointsOverview ?
                    <PointsOverviewTable>
                        <thead>
                            <tr>
                                <th>{t('player.modal.actionColumnName')}</th>
                                <th>{t('player.modal.quantityColumnName')}</th>
                                <th>{t('player.modal.pointsColumnName')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pointsOverview.map((category: any, index: number) =>
                                    <tr key={`overview-${index}`}>
                                        <td>{category.action}</td>
                                        <td>{category.quantity}</td>
                                        <td>{category.points}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </PointsOverviewTable> : null
            }
        </PlayerModalStyle>
    );
}