import { useGetMatchesQuery } from "@/services/matchesApi";
import { groupBy, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { TableStyle } from "@/components/PlayerList/PlayerListStyle";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import "dayjs/locale/nl-be";
import { ClubBadgeBg, ClubDetails, ClubName, ContainerStyle, FiltersArea } from "./CalendarStyle";
import { useTranslation } from "react-i18next";
import Icon from "@ant-design/icons";
import { Button } from "@/components/UI/Button/Button";
import { Select } from "../UI/Select/Select";
import { Navigate } from "react-router-dom";
import config from "@/config";

type CalendarProps = {
	weekId: number
	showHeader?: boolean
	size: number
}

type CalendarState = {
	filters: any
	navigateToMatchId: any
	filtersActivated: boolean
	weekId: number
}

export const Calendar = (props: CalendarProps) => {
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { t } = useTranslation();
	const [state, setState] = useState<CalendarState>({
		filters: {
			month: -1
		},
		filtersActivated: false,
		navigateToMatchId: null,
		weekId: props.weekId
	});

	const onFilterChange = (name: string, value: string | number) => {
		const filters: any = Object.assign({}, state.filters, { [name]: value });
		setState({ ...state, filters })
	};

	const matchFilter = (match: Match, filters: any) => {
		let show = true;
		if (filters.month !== -1 && filters.month !== dayjs(match.date).month()) {
			show = false;
		}
		return show;
	}

	const onCalendarWeekChanged = (weekId: number) => {
		setState({ ...state, weekId: weekId });
	};

	const tableEventHandler = (match: any) => ({
		onClick: (event: any) => {
			const matchDate = dayjs(match.date);
			if (dayjs().isAfter(matchDate)) {
				setState({ ...state, navigateToMatchId: match.id });
			}
		}
	});

	const matchWeekIds = useMemo(() => uniqBy(matches, match => match.weekId)
		.map(match => ({ id: match.weekId, name: `${t("general.week")} ${match.weekId}` }))
		.sort((a: any, b: any) => a.id - b.id), [matches]);

	const visibleMatches = useMemo(() => matches && matches.filter((match: Match) => match.weekId === state.weekId), [matches, state]);
	const matchesByDates = useMemo(() => groupBy(visibleMatches, (match: Match) => dayjs(match.date).format("DD/MM/YYYY")), [visibleMatches]);
	const selectedWeekId = useMemo(() => matchWeekIds.find((item: any) => item.id === state.weekId), [state.weekId]);

	const columns = [
		{
			title: "Home",
			key: "home",
			dataIndex: "home",
			width: "40%",
			render: (homeId: any, record: any) => {
				const clubBadge = `${config.API_URL}/static/badges/${record.home.externalId}.png`;

				return <ClubDetails left>
					<ClubName className="team-name" fullName={record.home.name} shortName={record.home.short}></ClubName>
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
				const matchDate = dayjs(record.date);
				const matchToStart = dayjs().isBefore(matchDate);
				return <b className={`score ${matchToStart ? "scheduled" : "started"}`}>
					{matchToStart ? dayjs(record.date).format("HH:mm") : `${record.homeScore} - ${record.awayScore}`}
				</b>;
			}
		},
		{
			title: "Away",
			key: "away",
			dataIndex: "away",
			width: "40%",
			render: (awayId: any, record: any) => {
				const clubBadge = `${config.API_URL}/static/badges/${record.away.externalId}.png`;

				return <ClubDetails>
					<ClubBadgeBg src={clubBadge} />
					<ClubName className="team-name" fullName={record.away.name} shortName={record.away.short}></ClubName>
				</ClubDetails>;
			}
		}
	];

	return (
		<ContainerStyle>
			{
				state.navigateToMatchId && <Navigate to={{ pathname: `/match/${state.navigateToMatchId}` }} />
			}
			<FiltersArea>
				{
					state.filtersActivated && selectedWeekId && selectedWeekId.id ?
						<Select
							$block
							keyProperty="id"
							textProperty="name"
							onSelect={(value: any) => onCalendarWeekChanged(value)}
							value={selectedWeekId.id}
							values={matchWeekIds}
						/> : null
				}
			</FiltersArea>
			{
				Object.keys(matchesByDates).map((date: string, key: number) => {
					return (
						<div key={`gameday-${key + 1}`} className={`gameday day-${key + 1}`}>
							<Title level={4}>{dayjs(date, "DD/MM/YYYY").format("dddd D MMMM")}</Title>
							<TableStyle
								columns={columns}
								dataSource={matchesByDates[date]}
								showHeader={props.showHeader}
								onRow={tableEventHandler}
								loading={matchesLoading}
								pagination={visibleMatches.length > props.size ? { pageSize: props.size } : false}
								rowKey={(record: any) => `match-${record.id}`}
								rowClassName={(record: object, index: number) =>
									index % 2 ? "ant-table-row--odd" : "ant-table-row--even"
								}
								locale={{ emptyText: t("general.noMatchesFound") }}
							/>
						</div>
					);
				})
			}
		</ContainerStyle>
	);
};