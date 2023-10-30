import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam"
import { Block } from "@/components/Block/Block";
import { Team } from "@/components/Team/Team";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { roundNextHalf, selectionPlayerSellValue, startingListToPositionsList } from "@/lib/helpers";
import { useAppSelector } from "@/reducers";
import { useGetTeamQuery } from "@/services/teamsApi";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import Title from "antd/es/typography/Title";
import { pick } from "lodash";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { useGetClubsQuery } from "@/services/clubsApi";
import { TransfersList } from "@/components/TransfersList/TransfersList";
import { Button } from "@/components/UI/Button/Button";
import Icon from "@ant-design/icons/lib/components/Icon";
import { CloseCircleFilled, SaveFilled } from "@ant-design/icons";
import { Element } from "react-scroll";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { notification } from "antd";
import { TransfersOverview } from "@/components/Stats/TransfersOverview";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";

type TransfersProps = {

};

type TransfersState = {
    notFound: boolean
    performingTransfer: boolean
    performingTransferReset: boolean
    transferConfirmModalVisible: boolean
};

const _Transfers = (props: AbstractTeamType) => {
    const [state, setState] = useState<TransfersState>({
        notFound: false,
        performingTransfer: false,
        performingTransferReset: false,
        transferConfirmModalVisible: false,
    });
    const application = useSelector((state: StoreState.All) => state.application);
    const { user, teams } = useAppSelector((state) => state.userState);

    const { id } = useParams();
    const { t } = useTranslation();

    const { data: teamResult, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess } = useGetTeamQuery(+(id || 0));
    const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
    const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
    const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
    const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSuccess } = useGetPlayersQuery();

    useEffect(() => {
        if (teamSuccess) {
            const playerProps =
                ['id', 'name', 'short', 'positionId', 'clubId', 'value', 'ban', 'injury', 'form', 'forename', 'surname', 'portraitUrl'];
            const selectionProps: any[] = [];

            const starting = teamResult.players
                .filter((player: any) => player.selection.starting === 1)
                .map((player: any) => {
                    const tfValue = selectionPlayerSellValue(player);
                    return Object.assign({ inStarting: true }, pick(player, playerProps), pick(player.selection, selectionProps), { value: tfValue });
                });
            const bench = teamResult.players
                .filter((player: any) => player.selection.starting === 0)
                .map((player: any) => {
                    const tfValue = selectionPlayerSellValue(player);
                    return Object.assign({ inStarting: false }, pick(player, playerProps), pick(player.selection, selectionProps), { value: tfValue });
                });

            const teamName = teamResult.team.name;

            const captainPlayer = teamResult.players.find((player: any) => player.selection.captain === 1);
            const captainId = captainPlayer && captainPlayer.id;
            const viceCaptainPlayer = teamResult.players.find((player: any) => player.selection.captain === 2);
            const viceCaptainId = (viceCaptainPlayer && viceCaptainPlayer.id) || null;

            const pastTransfers = !teamResult.transfers ? ([] as Transfer[]) :
                teamResult.transfers
                    .filter((tf: any) => deadlineInfo.deadlineInfo.deadlineWeek && (tf.weekId < deadlineInfo.deadlineInfo.deadlineWeek))
                    .map((tf: any) => ({ inId: tf.inId, outId: tf.outId, weekId: tf.weekId }));
            const deadlineWeekTransfers = !teamResult ? ([] as Transfer[]) :
                teamResult.transfers
                    .filter((tf: any) => deadlineInfo.deadlineInfo.deadlineWeek && (tf.weekId === deadlineInfo.deadlineInfo.deadlineWeek))
                    .map((tf: any) => ({ inId: tf.inId, outId: tf.outId, weekId: tf.weekId, extra: tf.extra }));

            const getPlayersValueWithTransfers = (players: any) => {
                const playersValue = players
                    .reduce((acc: any, player: any) => {
                        const wasTfed = teamResult.transfers.find((tf: any) => tf.inId === player.id);
                        const playerValue = wasTfed ?
                            roundNextHalf(player.value + (player.value * (application.competition.transferTaxPercentage || 0) / 100)) :
                            player.value;
                        return acc + playerValue;
                    }, 0);
                return application.competition.budget - playersValue;
            };

            const budget = teamResult.team.budget !== null ?
                teamResult.team.budget : getPlayersValueWithTransfers(teamResult.players);


            const boosters = {
                freeHit: teamResult.team.freeHit,
                bank: teamResult.team.bank,
                tripleCaptain: teamResult.team.tripleCaptain,
                wildCard: teamResult.team.wildCard
            };

            props.initTeamState(starting, bench, teamName, captainId, budget, undefined, undefined, undefined, teamResult.transfers, deadlineWeekTransfers, pastTransfers, viceCaptainId, boosters);
        }
        if (teamError) {
            console.error(teamError);
            setState({ ...state, notFound: true });
        }
    }, [teamResult]);

    const formatTransfers = (tf: any) => {
        const inPIDmeta = tf && (tf.inId && Object.keys(tf.inId).length);
        const outPIDmeta = tf && (tf.outId && Object.keys(tf.outId).length);

        const inPlayer = players && players.find((player: any) => player.id === tf.inId);
        const outPlayer = players && players.find((player: any) => player.id === tf.outId);
        return {
            inPlayer: inPIDmeta ? tf.inId : inPlayer,
            outPlayer: outPIDmeta ? tf.outId : outPlayer,
            weekId: tf && tf.weekId,
            inId: inPIDmeta ? tf.inId.id : tf.inId,
            outId: outPIDmeta ? tf.outId.id : tf.outId,
        };
    };

    const showTransferConfirmModal = () => {
        setState({ ...state, transferConfirmModalVisible: true });
    };

    const onTransferConfirmCancel = () => {
        setState({ ...state, transferConfirmModalVisible: false });
    };

    const onTransferConfirmAccept = () => {
        console.log("TRANSFERS ACCEPTED");
        props.onTransfersSubmit(+(id || 0));
        setState({ ...state, transferConfirmModalVisible: false });
    }

    const isNotExtraTransfer = (transfer: any) => {
        return !transfer.extra;
    };

    const playerIsExtra = (player: Player) => {

    }

    const onPlayerOut = (player: Player, isLineup: boolean, extraOutTransfer: boolean, clubsWithExtraPlayers: any[]) => {
        const clubsWithExtraPlayersIds = clubsWithExtraPlayers.map((club: any) => club.id);
        if (extraOutTransfer && !clubsWithExtraPlayersIds.includes(player.clubId)) {
            const clubNames = clubsWithExtraPlayers.map((club => club.name)).join(',');
            notification.warning({ message: `Je team is momenteel ongeldig. Je kan enkel een speler van ${clubNames} transfereren.` })
            return;
        }
        if (isLineup) {
            props.removeStartingPlayer(player);
        } else {
            props.removeBenchPlayer(player);
        }

        const playerExtra = playerIsExtra(player);
        props.onTransferPlayerOut(player, false);
    }

    const onPlayerIn = (player: Player) => {
        props.pickPlayer(player, false);
        props.onTransferPlayerIn(player);
    }

    const {
        starting, bench, boosters, initializedExternally, captainId,
        viceCaptainId, deadlineWeekTransfers, draftTransfers, activePositionFilter,
        pastTransfers, budget
    } = props;

    const pastTransfersFormatted = pastTransfers
        .map(formatTransfers);
    const deadlineWeekTransfersFormatted = deadlineWeekTransfers
        .concat(draftTransfers)
        .map(formatTransfers);
    const canSaveDraftTransfers = draftTransfers
        .filter(draftTf => !!draftTf.inId && !!draftTf.outId)
        .length === draftTransfers.length;
    const deadlineWeekTransfersFormattedWithoutExtra = deadlineWeekTransfers
        .concat(draftTransfers)
        .filter(isNotExtraTransfer)
        .map(formatTransfers);

    const team = useMemo(() => teamResult && teamResult.team, [teamResult]);
    const notTeamOwner = useMemo(() => team && team.userId && user && (team.userId !== user.id), [team, user]);
    const gameStarted = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek && deadlineInfo.deadlineInfo.deadlineWeek > application.competition.officialStartWeek, [deadlineInfo]);
    const deadlineWeek = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo])
    const enabledWildOrFreeHit = useMemo(() => boosters.wildCard === deadlineWeek || boosters.freeHit === deadlineWeek, [boosters]);
    const startingByPositions = useMemo(() => startingListToPositionsList([].concat(starting as any, bench as any), [2, 5, 5, 3]), [starting, bench]);
    const remainingTransfers = useMemo(() => {
        let remainingTransfers = null;
        if (application.competition.weeklyTransfers) {
            remainingTransfers = application.competition.transfersAllowed - deadlineWeekTransfersFormattedWithoutExtra.length;
        } else if (application.competition.transferCanBeSaved) {
            remainingTransfers = application.competition.transfersAllowed * (deadlineWeek - 1) - (deadlineWeekTransfersFormattedWithoutExtra.length + pastTransfersFormatted.length);
        } else {
            remainingTransfers = application.competition.transfersAllowed - (deadlineWeekTransfersFormattedWithoutExtra.length + pastTransfersFormatted.length);
        }
        return remainingTransfers;
    }, [application, deadlineWeekTransfersFormattedWithoutExtra, pastTransfersFormatted, deadlineWeek]);
    const canTransferOut = useMemo(() => remainingTransfers > 0, [remainingTransfers]);

    const startingPicked = useMemo(() => starting.filter(player => player && player.id), [starting]);
    const benchPicked = useMemo(() => bench.filter(player => player && player.id), [bench]);

    return (
        (clubs && teamResult && matches && players && deadlineInfo) && (
            <React.Fragment>
                {(notTeamOwner || state.notFound) &&
                    <Navigate to={`/home`} />
                }
                {(team && deadlineInfo.deadlineInfo.deadlineWeek && (!gameStarted || enabledWildOrFreeHit)) &&
                    <Navigate to={`/edit/${teamResult.team.id}`} />
                }
                {
                    (initializedExternally &&
                        <Row>
                            <Col md={12} sm={12} xs={24}>
                                <Block>
                                    <Title level={2}>{t('transfersPage.transfersBlockTitle')}</Title>
                                    <React.Fragment>
                                        <div style={{ textAlign: 'center' }}>
                                            <Title level={4}>{`${t('general.footballWeek')} ${deadlineWeek}`}</Title>
                                        </div>
                                        <TransfersList
                                            data={deadlineWeekTransfersFormatted}
                                            showHeader={true}
                                            tax={application.competition.transferTaxPercentage}
                                            size={15}
                                        />
                                        <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                                            {
                                                (draftTransfers && draftTransfers.length && canSaveDraftTransfers && team &&
                                                    <span style={{ padding: '5px' }}>
                                                        <Button
                                                            onClick={(e: any) => showTransferConfirmModal()} // todo
                                                            disabled={state.performingTransfer}
                                                            type="primary"
                                                            loading={state.performingTransfer}
                                                        >
                                                            {
                                                                (!state.performingTransfer &&
                                                                    <SaveFilled />
                                                                ) || null
                                                            }
                                                            {t('transferPage.confirmTransfers')}
                                                        </Button>
                                                    </span>
                                                ) || null
                                            }
                                            {
                                                (draftTransfers && draftTransfers.length &&
                                                    <span style={{ padding: '15px' }}>
                                                        <Button
                                                            onClick={(e: any) => props.onDraftTransfersClear()}
                                                            type="primary"
                                                        >
                                                            <CloseCircleFilled />
                                                            {t('transferpage.clearTransfers')}
                                                        </Button>
                                                    </span>) || null
                                            }
                                        </div>
                                    </React.Fragment>
                                    <div style={{ marginBottom: '15px' }}>
                                        <TransfersOverview
                                            budget={budget}
                                            totalPlayers={application.competition.lineupSize + application.competition.benchSize}
                                            totalPlayersSelected={startingPicked.length + benchPicked.length}
                                            minusPoints={0}
                                            remainingFreeTransfers={remainingTransfers}
                                        />
                                    </div>
                                </Block>
                                <Block>
                                    <Title level={2}>{t('general.footballLineup')}</Title>
                                    <Team
                                        widthRatio={15}
                                        heightRatio={10}
                                        clubs={clubs}
                                        bg={teamBackground}
                                        captainId={captainId}
                                        selection={startingByPositions}
                                        playerType={PlayerType.SoccerShirt}
                                        playerBadgeColor="#000"
                                        playerBadgeBgColor={theme.primaryColor}
                                        modalEnabled={true}
                                        showCaptainBadge={true}
                                        showPlayerValue={true}
                                        viceCaptainId={viceCaptainId}
                                        showPlayerValueInsteadOfPoints={true}
                                        onRemove={canTransferOut && ((player: Player) => props.onTransferPlayerOut(player))}
                                        onPlaceholderClick={null}
                                        actionLessPlayerIds={null}
                                        playerPointsColor={"#000"}
                                        playerPointsBgColor="#84FF00"
                                        assetsCdn={""}
                                    />
                                </Block>
                            </Col>
                            <Col md={12} sm={12} xs={24}>
                                <Block>
                                    <Title level={2}>{t('general.footballAllPlayers')}</Title>
                                    <Element name="all-players">
                                        <PlayerList
                                            clubs={clubs}
                                            matches={matches}
                                            deadlineWeek={deadlineWeek}
                                            isLoading={playersLoading}
                                            hidePositions={false}
                                            activePositionFilter={activePositionFilter}
                                            isPickable={(player: Player) => props.isPickAble(player, false, true)}
                                            playerType={PlayerType.SoccerShirt}
                                            actionLabel={t('transferPage.transferButtonLabel')}
                                            data={players}
                                            playerTax={application.competition.transferTaxPercentage}
                                            onPick={onPlayerIn}
                                            action
                                            showHeader={false}
                                            size={10}
                                        />
                                    </Element>
                                </Block>
                            </Col>
                        </Row>
                    ) || null
                }
                <ConfirmModal
                    visible={state.transferConfirmModalVisible}
                    onCancel={(e: any) => onTransferConfirmCancel()}
                    onConfirm={(e: any) => onTransferConfirmAccept()}
                    title={t('transfersPage.transferConfirmTitle')}
                    text={t('transfersPage.transferConfirmMessage')}
                />
            </React.Fragment>
        )
    )

};

export const TransfersPage = () => AbstractTeam(_Transfers, {});