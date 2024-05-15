import { EuroOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "../UI/Input/Input";
import { ContainerStyle, TableStyle } from "./PlayerStatsListStyle";
import { useTranslation } from "react-i18next";
import { SelectGroupStyle } from "../PlayerList/PlayerListStyle";
import { Select } from "../UI/Select/Select";
import { useEffect, useMemo, useState } from "react";
import { useGetClubsQuery } from "@/services/clubsApi";
import { useGetWeeksQuery } from "@/services/weeksApi";
import { useLazyGetPlayerStatsQuery } from "@/services/statisticsApi";

type PlayerStatsListProps = {
	size: number
	showHeader?: boolean
	onSelect?: any
}

type PlayerStatsListState = {
	filters: any
	pagination: any
}

export const PlayerStatsList = (props: PlayerStatsListProps) => {
	const { t } = useTranslation();
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSucces } = useGetWeeksQuery();
	const [getPlayerStats, { data: stats, isLoading: statsLoading, isError: statsError, isSuccess: statsSucces }] = useLazyGetPlayerStatsQuery();

	const [state, setState] = useState<PlayerStatsListState>({
		filters: {
			playerName: "",
			playerValue: 100,
			clubId: -1,
			weekId: -1,
			positionId: -1,
			stat: 0
		},
		pagination: {
			current: 1,
			total: 0,
			pageSize: props.size,
			showSizeChanger: false
		},
	});

	useEffect(() => {
		if(state.filters.weekId != -1)
			getPlayerStats({matchday: state.filters.weekId});
		else 
			getPlayerStats({});
	}, [state.filters.weekId]);

	const clubsList = useMemo(() => ([{
		id: -1,
		name: <span className="prefixed-label">{t("general.allClubs")}</span>
	}] as { id: number, name: any }[]).concat(clubs?.map((c: Club) => ({
		id: c.id,
		name: c.name
	})) || []), [clubs]);

	const weeksList = useMemo(() => ([{
		id: -1,
		name: <span className="prefixed-label">{t("general.allWeeks")}</span>
	}] as { id: number, name: any }[]).concat(weeks?.map((w: Week) => ({
		id: w.id,
		name: `${t("general.week")} ${w.id}`
	})) || []), [weeks]);

	const budgetsList = [
		{ name: <span className={"prefixed-label"}> <EuroOutlined /> {t("general.allBudget")} </span>, value: 100 },
		{ name: `${t("general.budgetFilterPrefix")} 10 ${t("general.budgetFilterSuffix")}`, value: 10 },
		{ name: `${t("general.budgetFilterPrefix")} 9.5 ${t("general.budgetFilterSuffix")}`, value: 9.5 },
		{ name: `${t("general.budgetFilterPrefix")} 9 ${t("general.budgetFilterSuffix")}`, value: 9 },
		{ name: `${t("general.budgetFilterPrefix")} 8.5 ${t("general.budgetFilterSuffix")}`, value: 8.5 },
		{ name: `${t("general.budgetFilterPrefix")} 8 ${t("general.budgetFilterSuffix")}`, value: 8 },
		{ name: `${t("general.budgetFilterPrefix")} 7.5 ${t("general.budgetFilterSuffix")}`, value: 7.5 },
		{ name: `${t("general.budgetFilterPrefix")} 7 ${t("general.budgetFilterSuffix")}`, value: 7 },
		{ name: `${t("general.budgetFilterPrefix")} 6.5 ${t("general.budgetFilterSuffix")}`, value: 6.5 },
		{ name: `${t("general.budgetFilterPrefix")} 6 ${t("general.budgetFilterSuffix")}`, value: 6 },
		{ name: `${t("general.budgetFilterPrefix")} 5.5 ${t("general.budgetFilterSuffix")}`, value: 5.5 },
		{ name: `${t("general.budgetFilterPrefix")} 5 ${t("general.budgetFilterSuffix")}`, value: 5 },
		{ name: `${t("general.budgetFilterPrefix")} 4.5 ${t("general.budgetFilterSuffix")}`, value: 4.5 },
		{ name: `${t("general.budgetFilterPrefix")} 4 ${t("general.budgetFilterSuffix")}`, value: 4 },
		{ name: `${t("general.budgetFilterPrefix")} 1 ${t("general.budgetFilterSuffix")}`, value: 1 }
	];

	const positionsList = [
		{ id: -1, name: <span className={"prefixed-label"}> {t("general.allPositions")} </span> },
		// { id: 0, name: t("player.coach") },
		{ id: 1, name: t("player.goalkeeper") },
		{ id: 2, name: t("player.defender") },
		{ id: 3, name: t("player.midfielder") },
		{ id: 4, name: t("player.attacker") },
	];

	const statsList = [
		{
			id: 0,
			name: <span className={"prefixed-label"}> {t("stats.attackingStats")} </span>,
			value: [
				{ value: "statGoals", label: t("stats.goalsColumnForAllPlayersTable") },
				{ value: "statAssists", label: t("stats.assistsColumnForAllPlayersTable") },
				{ value: "statShotsAccuracy", label: t("stats.shotsAccuracyColumnForAllPlayersTable") },
				{ value: "statPassAccuracy", label: t("stats.passAccuracyColumnForAllPlayersTable") },
				{ value: "statDribbleAccuracy", label: t("stats.dribbleAccuracyColumnForAllPlayersTable") },
			]
		},
		{
			id: 1,
			name: `${t("stats.defendingStats")}`,
			value: [
				{ value: "statTackles", label: t("stats.tacklesColumnForAllPlayersTable") },
				{ value: "statBlocks", label: t("stats.blocksColumnForAllPlayersTable") },
				{ value: "statInterceptions", label: t("stats.interceptionsColumnForAllPlayersTable") },
				{ value: "statConceeded", label: t("stats.againstColumnForAllPlayersTable") },
				{ value: "statCleanSheet", label: t("stats.cleanColumnForAllPlayersTable") }
			]
		},
		{
			id: 2,
			name: `${t("stats.cardStats")}`,
			value: [
				{ value: "statYellows", label: t("stats.yellowColumnForAllPlayersTable") },
				{ value: "statReds", label: t("stats.redColumnForAllPlayersTable") }
			]
		},
		{
			id: 3,
			name: `${t("stats.playStats")}`,
			value: [
				{ value: "statMinutesPlayed", label: t("stats.timePlayedColumnForAllPlayersTable") },
				{ value: "statMatchesPlayed", label: t("stats.matchPlayedColumnForAllPlayersTable") }
			]
		},
		{
			id: 4,
			name: `${t("stats.userStats")}`,
			value: [
				{ value: "statInTeam", label: t("stats.percentageInTeamForAllPlayersTable") },
				{ value: "statCaptain", label: t("stats.percentageCaptainForAllPlayersTable") },
				{ value: "statViceCaptain", label: t("stats.percentageViceCaptainForAllPlayersTable") },
				{ value: "statROI", label: t("stats.roiForAllPlayersTable") }
			]
		},//points per min //selection %// pickorder//
	];
	
	const columns: any[] = [
		{
			key: "rank",
			title: "#",
			dataIndex: "generalInfo",
			render: (text: string, record: any, index: number) => {
				const rank = ((state.pagination.current - 1) * state.pagination.pageSize) + index + 1;

				return (<span>{rank}</span>);
			},
		},
		{
			key: "name",
			title: t("stats.allPlayersTable.playerColumn"),
			sorter: (a: any, b: any) => a.generalInfo.short.localeCompare(b.generalInfo.short),
			dataIndex: "generalInfo",
			render: (text: string, record: any) => {
				return (<span>{record.generalInfo.short || record.generalInfo.name}</span>);
			},
		},
		{   // todo: change to clubName + sorter with compare
			key: "clubName",
			title: t("stats.allPlayersTable.clubColumn"),
			sorter: (a: any, b: any) => a.clubName.localeCompare(b.clubName),
			dataIndex: "clubName",
			render: (text: string, record: any) => {
				return (<span>{text}</span>);
			},
		},
		{
			key: "positionId",
			title: t("stats.allPlayersTable.positionColumn"),
			sorter: (a: any, b: any) => a.positionId - b.positionId,
			dataIndex: "positionId",
			render: (text: string, record: any) => {
				const position = positionsList.find((item: any) => item.id === record.positionId);
				return (<span>{position && position.name || ""}</span>);
			},
		},
		{
			key: "total",
			title: t("stats.allPlayersTable.pointsColumn"),
			sorter: (a: any, b: any) => b.total - a.total,
			dataIndex: "total",
			align: "center",
			render: (text: string, record: any) => {
				return (<span>{record.total}</span>);
			},
		},
		...statsList[state.filters.stat].value.map((stat: any) => ({
			key: stat.value,
			title: stat.label,
			sorter: (a: any, b: any) => a[stat.value] - b[stat.value],
			dataIndex: stat.value,
			align: "center",
			render: (text: string, record: any) => {
				return (<span>{record[stat.value] !== null ? record[stat.value] : "-"}</span>);
			},
		})),
		{
			key: "playerValue",
			title: t("stats.allPlayersTable.valueColumn"),
			sorter: (a: any, b: any) => a.playerValue - b.playerValue,
			dataIndex: "playerValue",
			align: "right",
			render: (text: string, record: any) => {
				return (<span>€ {record.playerValue}M</span>);
			},
		},

	];

	const tableEventHandler = useMemo(() => {
		// todo
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let tableEventHandler: any = () => { };
		if (props.onSelect) {
			tableEventHandler = (player: any) => ({
				onClick: (event: any) => {
					props.onSelect(player);
				},
			});
		}
		return tableEventHandler;
	}, [props.onSelect]);

	const onFilterChange = (name: string, value: string | number) => {
		const filters: any = Object.assign({}, state.filters, {
			[name]: value,
		});
		setState({ ...state, filters });
	};

	const playerFilter = (player: any) => {
		let show = true;
		show &&= !(state.filters.playerName.length && player.generalInfo.name.toLowerCase().indexOf(state.filters.playerName.toLowerCase()) === -1);
		show &&= !(state.filters.playerValue !== -1 && state.filters.playerValue < player.playerValue);
		show &&= !(state.filters.clubId !== -1 && state.filters.clubId !== player.clubId);
		show &&= !(state.filters.positionId !== -1 && state.filters.positionId !== player.positionId);
		return show;
	};

	const handleTableChange = (pagination: any, filters: any, sorter: any, extra: {currentDataSource: any}) => {		
		const newPagination = { ...state.pagination, current: pagination.current };
		setState({ ...state, pagination: newPagination });
	};

	return (
		<ContainerStyle>
			{
				<Input
					prefix={<SearchOutlined />}
					type="text"
					placeholder={t("general.playersListSearchInputPlaceholder")}
					name="playerName"
					onChange={(event: any) =>
						onFilterChange(event.target.name, event.target.value)
					}
				/>
			}
			<SelectGroupStyle>
				<Select
					$block
					keyProperty="id"
					textProperty="name"
					values={clubsList}
					onSelect={(value: any) => onFilterChange("clubId", value)}
					placeholder={clubsList[0].name}
					style={{ marginLeft: 0 }}
				/>
				<Select
					$block
					keyProperty="id"
					textProperty="name"
					value={state.filters.position}
					values={positionsList}
					onSelect={(value: any) => onFilterChange("positionId", value)}
					placeholder={positionsList[0].name}
				/>
				<Select
					$block
					keyProperty="id"
					textProperty="name"
					value={state.filters.weekId}
					values={weeksList}
					onSelect={(value: any) => onFilterChange("weekId", value)}
					placeholder={weeksList[0].name}
				/>
				<Select
					$block
					keyProperty="value"
					textProperty="name"
					values={budgetsList}
					onSelect={(value: any) => onFilterChange("playerValue", value)}
					placeholder={budgetsList[0].name}
					style={{ marginRight: 0 }}
				/>
				<Select
					$block
					keyProperty="id"
					textProperty="name"
					value={state.filters.stat}
					values={statsList}
					onSelect={(value: any) => onFilterChange("stat", value)}
					placeholder={statsList[0].name}
					style={{ marginRight: 0 }}
				/>
			</SelectGroupStyle>
			<TableStyle
				columns={columns}
				dataSource={stats?.filter(playerStat => playerFilter(playerStat))}
				showHeader={props.showHeader}
				locale={{ emptyText: t("general.playersListEmpty") }}
				loading={statsLoading}
				pagination={state.pagination}
				onRow={tableEventHandler}
				onChange={handleTableChange}
				rowKey="playerId"
				rowClassName={(record: object, index: number) =>
					`${index % 2 ? "ant-table-row--odd" : "ant-table-row--even"} ${props.onSelect ? "cursor-pointer" : ""}`
				}
				bordered={false}
			/>

		</ContainerStyle>
	);
};