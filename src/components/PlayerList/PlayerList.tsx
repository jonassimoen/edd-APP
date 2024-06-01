import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContainerStyle, PlayerStyle, SelectGroupStyle, TableStyle } from "./PlayerListStyle";
import Icon, { EuroOutlined, SearchOutlined, StarOutlined, TagsOutlined } from "@ant-design/icons";
import { CaptainSvg, PlusSvg, RacketSvg, SetPiecesSvg, StarSvg } from "@/styles/custom-icons";
import { getPlayerPositionHexColor } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "../UI/Button/Button";
import { Select } from "../UI/Select/Select";
import { Player } from "../Player/Player";
import { PlayerType } from "@/types/PlayerTypes";
import { Tooltip } from "antd";
import { useGetMatchesQuery } from "@/services/matchesApi";

const CaptainIcon = (props: any) => <Icon component={CaptainSvg} {...props} />;
const SetPiecesIcon = (props: any) => <Icon component={SetPiecesSvg} {...props} />;
const StarIcon = (props: any) => <Icon component={StarSvg} {...props} />;
const InForm = (props: any) => <Icon component={RacketSvg} {...props} />;
const Injury = (props: any) => <Icon component={PlusSvg} {...props} />;

declare type PlayerListProps = {
	data: Player[]
	clubs: Club[]
	matches?: Match[]
	size: number
	activePositionFilter?: number
	setActivePositionFilter?: any
	showHeader: boolean
	hidePositions?: boolean
	onPick?: (player: Player, pickingTax?: boolean) => void
	isPickable?: (player: Player, transferPick?: boolean) => any
	action: boolean
	actionLabel?: string
	isLoading?: boolean
	playerType: PlayerType
	deadlineWeek?: any;
	maxSameClub?: number
	playerTax?: number | undefined;
	assetsCdn: string
	tourRef?: any
}

declare type PlayerListState = {
	filters: any
}

export const PlayerList = (props: PlayerListProps) => {
	const { t } = useTranslation();

	const { 
		assetsCdn, 
		activePositionFilter, 
		setActivePositionFilter, 
		onPick, 
		clubs, 
		hidePositions, 
		isPickable, 
		actionLabel,
		playerType,
		action,
		data,
		isLoading,
		showHeader,
		tourRef,
		matches,
		deadlineWeek
	} = props;

	const [state, setState] = useState<PlayerListState>({
		filters: {
			search: "",
			budget: -1,
			club: -1,
			position: activePositionFilter || -1
		}
	});

	const positions = [
		{ id: -1, name: t("general.allPositions") },
		{ id: 1, name: t("player.goalkeeper") },
		{ id: 2, name: t("player.defender") },
		{ id: 3, name: t("player.midfielder") },
		{ id: 4, name: t("player.attacker") },
	];

	const budgets = [
		{ text: t("general.allBudget"), value: 100 },
		{ text: `${t("general.budgetFilterPrefix")} 10 ${t("general.budgetFilterSuffix")}`, value: 10 },
		{ text: `${t("general.budgetFilterPrefix")} 7 ${t("general.budgetFilterSuffix")}`, value: 7 },
		{ text: `${t("general.budgetFilterPrefix")} 6 ${t("general.budgetFilterSuffix")}`, value: 6 },
		{ text: `${t("general.budgetFilterPrefix")} 5 ${t("general.budgetFilterSuffix")}`, value: 5 },
	];

	const clubsList = [{
		id: -1,
		name: t("general.allClubs")
	}]
		.concat(clubs?.map((c: Club) => ({ id: c.id, name: c.name })));

	useEffect(() => {
		const filters = { ...state.filters, position: activePositionFilter };
		setState({ ...state, filters });
	}, [activePositionFilter]);

	const onFilterChange = (name: string, value: string | number) => {
		const filters: any = Object.assign({}, state.filters, {
			[name]: value,
		});

		if (activePositionFilter && setActivePositionFilter && name === "position") {
			setActivePositionFilter(value);
		} else {
			setState({ ...state, filters });
		}
	};

	const playerFilter = (player: Player) => {
		let show = true;

		if (state.filters.search.length && player.name.toLowerCase().indexOf(state.filters.search.toLowerCase()) === -1) {
			show = false;
		}

		if (state.filters.club !== -1 && state.filters.club !== player.clubId) {
			show = false;
		}

		if (state.filters.position !== -1 && state.filters.position != player.positionId) {
			show = false;
		}

		if (state.filters.budget !== -1 && state.filters.budget < player.value) {
			show = false;
		}
		return show;
	};

	const onPickHandler = (e: any, record: any) => {
		e.stopPropagation();

		if (onPick) {
			onPick(record);
		}
	};

	const currentWeekMatches = useMemo(() => matches?.filter((match: Match) => match.weekId === deadlineWeek), [matches, deadlineWeek]);

	const columns: any = [
		{
			title: "",
			key: "avatar",
			dataIndex: "avatar",
			width: "15%",
			render: (txt: string, record: any) => {
				const imgProps: {
					shirt?: string,
					face?: string,
					faceFallback?: string,
					shirtFallback?: string,
				} = {};

				if (PlayerType.SoccerPortrait === playerType) {
					imgProps.face = `${assetsCdn}/players/${record.id}.png`;
					imgProps.faceFallback = `${assetsCdn}/players/dummy.png`;
				} else if (PlayerType.SoccerShirt === playerType) {
					imgProps.shirt = `${assetsCdn}/jerseys/${record.clubId}.png`;
					imgProps.shirtFallback = `${assetsCdn}/jerseys/dummy.png`;
				}
				const upcomingMatches = matches?.filter((m: Match) => [m.home?.id, m.away?.id].includes(record.clubId));

				return (
					<div className="avatar-container">
						<Player
							key={`playerId-${record.id}`}
							pointsColor={"#000"}
							pointsBgColor={"#fff"}
							badgeColor={"#fff"}
							badgeBgColor={"#fff"}
							avatarOnly={true}
							player={record}
							type={playerType}
							modalEnabled={true}
							upcomingMatches={upcomingMatches}
							club={clubs.find((c: Club) => c?.id === record.clubId )}
							isPickable={isPickable}
							onPick={onPick}
							{...imgProps}
						/>
					</div>
				);
			}
		},
		{
			key: "name",
			title: "Player",
			dataIndex: "name",
			width: "45%",
			render: (txt: string, record: Player, index: number) => {
				const club = clubs?.find(club => club.id === record.clubId);
				const position = positions.find(
					position => position.id === record.positionId
				);
				const positionColor = getPlayerPositionHexColor(record, theme);

				let opponentInfo: any = { playing: "", short: "" };
				const weekMatch = currentWeekMatches?.filter((m: Match) => [m.home?.id, m.away?.id].includes(record.clubId));
				if(weekMatch?.length) {
					const oppId = weekMatch[0].home.id === record.clubId ? weekMatch[0].away.id : weekMatch[0].home.id;
					const club = clubs.find((c: Club) => c.id === oppId);
					opponentInfo.short = club ? club.short : "";
					opponentInfo.playing = weekMatch[0].home.id === record.clubId ? t("player.opponentHome") : t("player.opponentAway");
				} else {
					opponentInfo = null;
				}


				return (
					<>
						<PlayerStyle>
							<p className="name">
								<span>
									{record.short}
								</span>
								<span style={{ float: "right", marginRight: "10px" }}>
									{record.star ?  <Tooltip title="Sterspeler"><span><StarIcon style={{ marginRight: "2px" }} /></span></Tooltip> : null}
									{record.captain ? <Tooltip title="Kapitein"><span><CaptainIcon style={{ marginRight: "2px" }} /></span></Tooltip> : null}
									{record.form ? <Tooltip title="In vorm"><span><InForm style={{ marginRight: "2px" }} /></span></Tooltip> : null}
									{record.injury ? <Tooltip title="Geblesseerd"><span><Injury style={{ marginRight: "2px" }} /></span></Tooltip> : null}
									{record.setPieces ? <Tooltip title="Standaardsituaties expert"><span><SetPiecesIcon style={{ marginRight: "2px" }} /></span></Tooltip> : null}
								</span>
							</p>
							<p className="details">
								<span>
									<span>{club && club.short}</span>
									{opponentInfo ? <span style={{color: "gray"}} > vs {opponentInfo.short}</span> : null}
								</span>
								<span className="player-position" style={{ color: positionColor }}>
									{(!hidePositions && position && position.name) || null} 
								</span>
							</p>
						</PlayerStyle>
					</>
				);
			}
		},
		{
			key: "value",
			title: "Waarde",
			dataIndex: "value",
			width: "20%",
			render: (value: string, record: any) => {
				return (
					<span style={{ fontSize: "1.2rem" }}>
						€{value}M
					</span>
				);
			}
		}
	];

	if (action) {
		columns.push({
			key: "action",
			title: "Pick player",
			dataIndex: "action",
			width: "20%",
			render: (text: string, record: any) => {
				return (
					(isPickable && isPickable(record) && (
						<Button
							type="primary"
							onClick={(e: any) => onPickHandler(e, record)}
							style={{ width: "100%", marginLeft: 0 }}
							size="small"
						>
							{actionLabel || t("general.pick")}
						</Button>
					)) || <span />
				);
			},
		});
	}

	return clubs && matches && (
		<ContainerStyle>
			<div className="filters">
				{
					<Input
						prefix={<SearchOutlined />}
						type="text"
						placeholder={t("general.playersListSearchInputPlaceholder").toString()}
						name="search"
						onChange={(event: any) =>
							onFilterChange(event.target.name, event.target.value)
						}
					/>
				}
				<SelectGroupStyle>
					<Select
						$block
						values={clubsList}
						keyProperty={"id"}
						onSelect={(value: any) => onFilterChange("club", value)}
						textProperty={"name"}
						placeholder={clubsList[0].name}
						placeholderTxt={t("general.club")}
					/>
					<Select
						$block
						values={budgets}
						keyProperty={"value"}
						onSelect={(value: any) => onFilterChange("budget", value)}
						textProperty={"text"}
						placeholder={budgets[0].text}
						placeholderTxt={t("general.price")}
					/>
					<Select
						$block
						values={positions}
						keyProperty={"id"}
						onSelect={(value: any) => onFilterChange("position", value)}
						textProperty={"name"}
						placeholder={positions[0].name}
						placeholderTxt={t("general.position")}
					/>
				</SelectGroupStyle>
			</div>
			{
				matches && deadlineWeek && (
					<TableStyle
						loading={isLoading}
						showHeader={showHeader}
						columns={columns}
						dataSource={data.filter(player => playerFilter(player))}
						rowKey="id"
						rowClassName={(record: Player, index: number) =>
							isPickable(record) ? "pickable": "disabled"
						}
						onRow={(_: any, index: number) => index==0 ? {ref: tourRef} : null }
						pagination={{ position: ["bottomCenter"], pageSize: 9, showLessItems: true, showSizeChanger: false }}
						locale={{
							emptyText: t("players.noneFound")
						}}
					>
					</TableStyle>
				)
			}
		</ContainerStyle>
	);

};