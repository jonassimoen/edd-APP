import { useGetMatchesQuery } from "@/services/matchesApi";
import { groupBy, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import "dayjs/locale/nl-be";
import { ClubBadgeBg, ClubDetails, ClubName, ContainerStyle, FiltersArea, TableStyle } from "./CalendarStyle";
import { useTranslation } from "react-i18next";
import { Select } from "../UI/Select/Select";
import { Navigate } from "react-router-dom";
import { calendarLiveScoreComponent } from "@/lib/helpers";

type CalendarProps = {
	weekId: number
	showHeader?: boolean
	size: number
	assetsCdn: string
	maxHeight?: number
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

	useEffect(() => setState({ ...state, weekId: props.weekId }), [props]);

	const onFilterChange = (name: string, value: string | number) => {
		const filters: any = Object.assign({}, state.filters, { [name]: value });
		setState({ ...state, filters });
	};

	const matchFilter = (match: Match, filters: any) => {
		let show = true;
		if (filters.month !== -1 && filters.month !== dayjs(match.date).month()) {
			show = false;
		}
		return show;
	};

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
				const clubBadge = record.home ? `${props.assetsCdn}/badges/${record.home.id}.png` : `${props.assetsCdn}/badges/dummy.png`;

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
				return calendarLiveScoreComponent(record);
			}
		},
		{
			title: "Away",
			key: "away",
			dataIndex: "away",
			width: "40%",
			render: (awayId: any, record: any) => {
				const clubBadge = record.away ? `${props.assetsCdn}/badges/${record.away.id}.png` : `${props.assetsCdn}/badges/dummy.png`;

				return <ClubDetails className="left">
					<ClubBadgeBg src={clubBadge} />
					<ClubName className="team-name" fullName={record.away?.name || t("general.team.tobedetermined")} shortName={record.away?.short || t("general.team.tbd")}></ClubName>
				</ClubDetails>;
			}
		}
	];

	return matchesSuccess && (
		<ContainerStyle maxheight={props.maxHeight}>
			{
				state.navigateToMatchId && <Navigate to={{ pathname: `/match/${state.navigateToMatchId}` }} />
			}
			{
				state.filtersActivated && (
					<FiltersArea>
						{
							selectedWeekId && selectedWeekId.id ?
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
				)
			}
			{
				Object.keys(matchesByDates).map((date: string, key: number) => {
					return (
						<div key={`gameday-${key + 1}`} className={`gameday day-${key + 1}`}>
							<div className="date">
								<p>{dayjs(date, "DD/MM/YYYY").format("dddd D MMMM")}</p>
							</div>
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