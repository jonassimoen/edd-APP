import { useGetMatchesQuery } from "@/services/matchesApi";
import { groupBy, uniqBy } from "lodash";
import { useMemo, useState } from "react";
import { TableStyle } from "@/components/PlayerList/PlayerListStyle";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import 'dayjs/locale/nl-be'
import { ClubBadgeBg, ClubName, ContainerStyle, FiltersArea } from "./CalendarStyle";
import { useTranslation } from "react-i18next";
import Icon from "@ant-design/icons";
import { Button } from "@/components/UI/Button/Button";
import { Select } from "../UI/Select/Select";
import { Navigate } from "react-router-dom";

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
        filtersActivated: true,
        navigateToMatchId: null,
        weekId: props.weekId
    })

    const matchWeekIds = useMemo(() => uniqBy(matches, match => match.weekId)
        .map(match => ({ id: match.weekId, name: `${t('general.week')} ${match.weekId}` }))
        .sort((a: any, b: any) => a.id - b.id), [matches]);
    const visibleMatches = useMemo(() => matches && matches.filter((match: Match) => match.weekId === state.weekId), [matches]);
    const matchesByDates = useMemo(() => groupBy(visibleMatches, (match: Match) => dayjs(match.date).format('DD/MM/YYYY')), [visibleMatches]);
    const selectedWeekId = useMemo(() => matchWeekIds.find((item: any) => item.id === state.weekId), [state.weekId]);

    const enableFilters = () => {
        setState({ ...state, filtersActivated: true });
    }

    const onCalendarWeekChanged = (weekId: number) => {
        setState({ ...state, weekId });
    }

    const tableEventHandler = (match: any) => ({
        onClick: (event: any) => {
            const matchDate = dayjs(match.date);
            if (dayjs().isAfter(matchDate)) {
                setState({ ...state, navigateToMatchId: match.id });
            }
        }
    })

    const columns = [
        {
            title: 'Home',
            key: 'home',
            dataIndex: 'home',
            width: '40%',
            render: (homeId: any, record: any) => {
                const clubBadge = 'null';

                return <>
                    <ClubName className="team-name" fullName={record.home.name} shortName={record.home.short}></ClubName>
                    <ClubBadgeBg src={clubBadge} />
                </>;
            }
        },
        {
            title: 'Score',
            key: 'date',
            dateIndex: 'date',
            width: '20%',
            render: (txt: any, record: any) => {
                const matchDate = dayjs(record.date);
                const matchToStart = dayjs().isBefore(matchDate);
                return <b className={`score ${matchToStart ? 'scheduled' : 'started'}`}>
                    {matchToStart ? dayjs(record.date).format('DD/MM HH:mm') : `${record.homeScore} - ${record.awayScore}`}
                </b>
            }
        },
        {
            title: 'Away',
            key: 'away',
            dataIndex: 'away',
            width: '40%',
            render: (away: any, record: any) => {
                const clubBadge = 'null';

                return <>
                    <ClubBadgeBg src={clubBadge} />
                    <ClubName className="team-name" fullName={record.away.name} shortName={record.away.short}></ClubName>
                </>;
            }
        }
    ]

    return (
        <ContainerStyle>
            {
                state.navigateToMatchId && <Navigate to={{ pathname: `/match/${state.navigateToMatchId}` }} />
            }
            <FiltersArea>
                {
                    !state.filtersActivated ?
                        <Button
                            type="primary"
                            onClick={enableFilters}>
                            Filter
                            <Icon type="right" />
                        </Button>
                        : null
                }
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
                            <Title level={4}>{dayjs(date, 'MM/DD/YYYY').format('dddd D MMMM')}</Title>
                            <TableStyle
                                columns={columns}
                                dataSource={matchesByDates[date]}
                                showHeader={props.showHeader}
                                onRow={tableEventHandler}
                                loading={matchesLoading}
                                pagination={visibleMatches.length > props.size ? { pageSize: props.size } : false}
                                rowKey={(record: any) => `match-${record.id}`}
                                rowClassName={(record: object, index: number) =>
                                    index % 2 ? 'ant-table-row--odd' : 'ant-table-row--even'
                                }
                                locale={{ emptyText: t('general.noMatchesFound') }}
                            />
                        </div>
                    )
                })
            }
        </ContainerStyle>
    );
}