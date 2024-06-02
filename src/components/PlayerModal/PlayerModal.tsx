import { PlayerModalStyle, PointsTableStyle, TableStyle } from "./PlayerModalStyle";
import { Col, Row } from "../UI/Grid/Grid";
import { PlayerStyle } from "../PlayerList/PlayerListStyle";
import { calendarLiveScoreComponent, getPlayerPositionHexColor, getPointsOverviewList } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import Icon from "@ant-design/icons";
import { AddButtonSvg, CaptainButtonSvg, DeleteButtonSvg, RollBackSvg, SuperSubsSvg, SwapButtonSvg, ViceCaptainButtonSvg } from "@/styles/custom-icons";
import { GoalRushSvg, HiddenGemSvg, TripleCaptSvg } from "@/styles/custom-icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { ClubBadgeBg, ClubDetails, ClubName } from "../Calendar/CalendarStyle";
import Title from "antd/es/typography/Title";
import { Scrollbars } from "react-custom-scrollbars";

const CaptainIcon = (props: any) => <Icon component={CaptainButtonSvg} {...props} />;
const ViceCaptainIcon = (props: any) => <Icon component={ViceCaptainButtonSvg} {...props} />;
const DeleteIcon = (props: any) => <Icon component={DeleteButtonSvg} {...props}  shape="circle"/>;
const SwapIcon = (props: any) => <Icon component={SwapButtonSvg} {...props} />;
const UndoIcon = (props: any) => <Icon component={RollBackSvg} {...props} />;
const AddIcon = (props: any) => <Icon component={AddButtonSvg} {...props} />;

type PlayerModalProps = {
	player: Player
	club?: Club
	visible: boolean
	onCancel: any
	portraitFace?: string
	portraitFaceFallback?: string
	onCaptainSelect?: any
	onViceCaptainSelect?: any
	onRemove?: any
	isSwapAble?: any
	onSwap?: any
	isPickAble?: any
	onPick?: any
	swapPlayerId?: number | null
	isCaptain?: boolean
	isViceCaptain?: boolean
	noActions?: boolean
	upcomingMatches?: Match[]
}

const BoosterIcons: {[type: string]: () => JSX.Element} = {
	"TripleCaptain": TripleCaptSvg,
	"GoalRush": GoalRushSvg,
	"HiddenGem": HiddenGemSvg,
	"SuperSubs": SuperSubsSvg,
	"FanFavourite": TripleCaptSvg,
};

export const PlayerModal = (props: PlayerModalProps) => {
	const { t } = useTranslation();
	const {competition} = useSelector((state: StoreState) => state.application);

	const { player, isSwapAble, swapPlayerId, noActions, upcomingMatches, isPickAble } = props;

	const playerPositionColor = getPlayerPositionHexColor(player, theme);
	const PositionLabels: any = {
		0: t("player.coach"),
		1: t("player.goalkeeper"),
		2: t("player.defender"),
		3: t("player.midfielder"),
		4: t("player.attacker")
	};

	const onBgLoadError = (event: any) => {
		if (props.portraitFaceFallback) {
			props.portraitFace = props.portraitFaceFallback;
		}
	};

	const onPick = (event: any) => {
		props.onPick(player);
		props.onCancel(event);
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
	};

	const onViceCaptainSelect = (event: any) => {
		props.onViceCaptainSelect(player);
		props.onCancel(event);
	};

	const hasSelectionActions = useMemo(
		() => !noActions && 
			!!(
				props.onCaptainSelect || props.onViceCaptainSelect || 
				(props.onSwap && isSwapAble && isSwapAble(player) && (player.id !== swapPlayerId)) || 
				(props.onPick) || 
				(props.onRemove && !swapPlayerId)
			), 
		[props]
	);

	const actionColumnSize = useMemo(
		() => Math.floor(24 / (
			+!!onCaptainSelect + +!!onViceCaptainSelect + 
			+(!!onSwap && (player.id !== swapPlayerId)) + 
			+(!!onSwap && (player.id === swapPlayerId)) + 
			+!!props.onPick +
			+!!props.onRemove
		)),
		[props]);

	const showPointsOverview = player && player.pointsOverview && !!player.pointsOverview.minutesPlayed;
	const pointsOverviewList = useMemo(() => getPointsOverviewList(player, t), [player]);
	const playerPointMatch = useMemo(() => player && player.currentMatches?.length && player.currentMatches[0], [player.currentMatches]);

	const columns = [
		{
			title: "Home",
			key: "home",
			dataIndex: "home",
			width: "40%",
			render: (homeId: any, record: any) => {
				const clubBadge = record.home ? `${competition.assetsCdn}/badges/${record.home.id}.png` : `${competition.assetsCdn}/badges/dummy.png`;

				return <ClubDetails className="right">
					<ClubName className="team-name" fullName={record.home?.name || t("general.team.tobedetermined")} shortName={record.home?.short || t("general.team.tbd")}></ClubName>
					<ClubBadgeBg src={clubBadge} />
				</ClubDetails>;
			}
		},
		{
			title: "Score",
			key: "date",
			dateIndex: "date",
			width: "20%",
			render: (txt: any, record: any) => {
				return calendarLiveScoreComponent(record, true);
			}
		},
		{
			title: "Away",
			key: "away",
			dataIndex: "away",
			width: "40%",
			render: (awayId: any, record: any) => {
				const clubBadge = record.away ? `${competition.assetsCdn}/badges/${record.away.id}.png` : `${competition.assetsCdn}/badges/dummy.png`;

				return <ClubDetails className="left">
					<ClubBadgeBg src={clubBadge} />
					<ClubName className="team-name" fullName={record.away?.name || t("general.team.tobedetermined")} shortName={record.away?.short || t("general.team.tbd")}></ClubName>
				</ClubDetails>;
			}
		}
	];
	
	const columnsPoints = [
		{
			title: t("player.modal.actionColumnName"),
			key: "action",
			dataIndex: "action",
		},
		{
			title: t("player.modal.quantityColumnName"),
			key: "quantity",
			dataIndex: "quantity",
			render: (q: number) => q ? q : "", 
		},
		{
			title: t("player.modal.pointsColumnName"),
			key: "points",
			dataIndex: "points",
		},
	];
	const dataPoints = useMemo(() => {
		if(pointsOverviewList.length) {
			const pointsWithTotal = pointsOverviewList.concat([{
				special: true,
				action: t("player.modal.totalRegularPoints"),
				quantity: 0,
				points: pointsOverviewList.reduce((acc: number, v: any) => acc + v.points, 0)
			}]);
			return (player.booster ? 
				pointsWithTotal.concat([{
					special: true,
					action: (
						<div className="with-icon">
							<Icon component={BoosterIcons[player.booster]} style={{fontSize: 28}} />
							{t(`boosters.${player.booster.charAt(0).toLowerCase() + player.booster.slice(1)}`)}
						</div>
					),
					quantity: 0,
					points: (player.points - player.stats[0].points) || 0
				}])
				: pointsWithTotal)?.map((booster: any, index: number) => ({...booster, key: index}));
		} else {
			return null;
		}
	}, [pointsOverviewList]);

	const handleUpdate = (values: any) => {
		const { scrollTop } = values;
		const playerInfoHeader = document.getElementsByClassName("player-header")[0];
		if (playerInfoHeader) {
			if (scrollTop > 10) {
				playerInfoHeader.classList.add("small-header", "on-scroll-gradient");
			} else {
				playerInfoHeader.classList.remove("small-header", "on-scroll-gradient");
			}
		}
	};
	
	return (
		<PlayerModalStyle
			bg={props.portraitFace}
			transitionName=""
			title={[]}
			open={props.visible}
			onCancel={props.onCancel}
			footer={[]}
		>
			<Row className="player-header">
				<div className="thumbnail" />
				<div className="right">
					<p className="forename">{player.forename}</p>
					<p className="surname">{player.surname}</p>
					<div className="clubPosition">
						{props.club ? props.club?.name : ""}
						{" - "}
						<span style={{ color: playerPositionColor }}> {PositionLabels[player.positionId]}</span>
					</div>
				</div>
			</Row>
			<Scrollbars onUpdate={handleUpdate}>
				<div className="player-body">
					{
						hasSelectionActions && (
							<div className="player-actions">
								{
									props.onPick ?
										<div className={`action ${isPickAble && isPickAble(player)?"":"disabled"}`} onClick={onPick}>
											<AddIcon />
											{t("player.addBadgeLabel")}
										</div> :
										null
								}
								{
									props.onCaptainSelect ?
										<div className="action" onClick={onCaptainSelect}>
											<CaptainIcon />
											{t("player.btnCaptainBadgeLabel")}
										</div> :
										null
								}
								{
									props.onViceCaptainSelect ?
										<div className="action" onClick={onViceCaptainSelect}>
											<ViceCaptainIcon />
											{t("player.btnViceCaptainBadgeLabel")}
										</div> :
										null
								}

								{
									props.onSwap && isSwapAble && isSwapAble(player) && (player.id !== swapPlayerId) ?
										<div className="action" onClick={onSwap}>
											<SwapIcon />
											{t("player.swapBadgeLabel")}
										</div> :
										null
								}

								{
									props.onSwap && (player.id === swapPlayerId) ?
										<div className="action" onClick={onSwap}>
											<UndoIcon />
											{t("player.undoBadgeLabel")}
										</div> :
										null
								}

								{
									props.onRemove && !swapPlayerId ?
										<div className="action" onClick={onRemove}>
											<DeleteIcon />
											{t("player.removeBadgeLabel")}
										</div> :
										null
								}
							</div>
						)
					}
					<Row className="player-stats">
						<Col className="stat">
							<div className="label">{t("player.modal.stats.selected")}</div>
							<div className="value">{player.pSelections}%</div>
						</Col>
						<Col className="stat">
							<div className="label">{t("player.modal.stats.points")}</div>
							<div className="value">{player.points} {t("general.short.points")}</div>
						</Col>
						<Col className="stat">
							<div className="label">{t("player.modal.stats.price")}</div>
							<div className="value">€{player.value || 0}M</div>
						</Col>
					</Row>
					{
						upcomingMatches ?
							(
								<TableStyle
									columns={columns}
									dataSource={upcomingMatches}
									showHeader={false}
									pagination={false}
									rowKey={(record: any) => `match-${record.id}`}
									rowClassName={(record: object, index: number) =>
										index % 2 ? "ant-table-row--odd" : "ant-table-row--even"
									}
									locale={{ emptyText: t("general.noMatchesFound") }}
								/>
							) : null
					}
					{ playerPointMatch &&
						<Row className="match-details">
							<Col span={10}>
								<ClubDetails className="right">
									<ClubName className="team-name" fullName={playerPointMatch.home?.name || t("general.team.tobedetermined")} shortName={playerPointMatch.home?.short || t("general.team.tbd")}></ClubName>
									<ClubBadgeBg src={playerPointMatch.home ? `${competition.assetsCdn}/badges/${playerPointMatch.home.id}.png` : `${competition.assetsCdn}/badges/dummy.png`} />
								</ClubDetails>
							</Col>
							<Col span={4}>
								{calendarLiveScoreComponent(playerPointMatch, true)}
							</Col>
							<Col span={10}>
								<ClubDetails className="left">
									<ClubBadgeBg src={playerPointMatch.away ? `${competition.assetsCdn}/badges/${playerPointMatch.away.id}.png` : `${competition.assetsCdn}/badges/dummy.png`} />
									<ClubName className="team-name left" fullName={playerPointMatch.away?.name || t("general.team.tobedetermined")} shortName={playerPointMatch.away?.short || t("general.team.tbd")}></ClubName>
								</ClubDetails>
							</Col>
						</Row>
					}
					{
						player && player.pointsOverview && showPointsOverview ?
							<PointsTableStyle
								className="points"
								columns={columnsPoints}
								dataSource={dataPoints}
								showHeader={true}
								pagination={false}
								rowKey={(rec: any) => rec?.special ? `special-statpoints-${rec.key}` : `statpoints-${rec.key}`}
							/>
							: null
					}
				</div>
			</Scrollbars>
		</PlayerModalStyle>
	);
};