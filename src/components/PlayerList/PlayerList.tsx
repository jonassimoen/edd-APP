import { Table, Avatar } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { EditableTable } from "../EditableTable"
import { useGetClubsQuery } from "@/services/clubsApi"
import { ContainerStyle, PlayerStyle, SelectGroupStyle, TableStyle } from "./PlayerListStyle"
import Icon, { SearchOutlined, StarOutlined } from "@ant-design/icons"
import { CaptainSvg, GreenSvg, OrangeSvg, RedSvg, SetPiecesSvg, StarSvg } from "@/styles/custom-icons"
import { getPlayerPositionHexColor } from "@/lib/helpers"
import { theme } from "@/styles/theme"
import { Input } from "@/components/UI/Input/Input"
import { Button } from "../UI/Button/Button"
import { Select } from "../UI/Select/Select"
import { Player } from "../Player/Player"
import { PlayerType } from "@/types/PlayerTypes"

const CaptainIcon = (props: any) => <Icon component={CaptainSvg} {...props} />;
const SetPiecesIcon = (props: any) => <Icon component={SetPiecesSvg} {...props} />;
const StarIcon = (props: any) => <Icon component={StarSvg} {...props} />;
const GreenIcon = (props: any) => <Icon component={GreenSvg} {...props} />;
const OrangeIcon = (props: any) => <Icon component={OrangeSvg} {...props} />;
const RedIcon = (props: any) => <Icon component={RedSvg} {...props} />;

declare type PlayerListProps = {
    data: Player[]
    clubs: Club[]
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
}

declare type PlayerListState = {
    filters: any
}

export const PlayerList = (props: PlayerListProps) => {
    const { t } = useTranslation();
    const [state, setState] = useState<PlayerListState>({
        filters: {
            search: '',
            budget: -1,
            club: -1,
            position: props.activePositionFilter || -1
        }
    });

    const positions = [
        // { id: -1, name: <span className={'prefixed-label'}> <FootballFieldIcon /> {t('general.footballAllPositions')} </span> },
        { id: 1, name: t('player.goalkeeper') },
        { id: 2, name: t('player.defender') },
        { id: 3, name: t('player.midfielder') },
        { id: 4, name: t('player.attacker') },
    ];

    const budgets = [
        // { text: <span className={'prefixed-label'}> <EuroIcon /> {t('general.footballAllBudget')} </span>, value: 100 },
        { text: `${t('general.budgetFilterPrefix')} 10 ${t('general.budgetFilterSuffix')}`, value: 10 },
        { text: `${t('general.budgetFilterPrefix')} 7 ${t('general.budgetFilterSuffix')}`, value: 7 },
        { text: `${t('general.budgetFilterPrefix')} 6 ${t('general.budgetFilterSuffix')}`, value: 6 },
        { text: `${t('general.budgetFilterPrefix')} 5 ${t('general.budgetFilterSuffix')}`, value: 5 },
    ];

    const clubsList = [{
        id: -1,
        name: <span className={'prefixed-label'}> <StarOutlined style={{ marginRight: 5 }} /> {t('general.footballAllClubs')} </span>
    }]
        .concat(props.clubs.map((c: Club) => ({ id: c.id, name: <span>{c.name}</span> })));

    useEffect(() => {
        console.log("active position changed")
        const filters = { ...state.filters, position: props.activePositionFilter };
        setState({ ...state, filters });
    }, [props.activePositionFilter]);

    const onFilterChange = (name: string, value: string | number) => {
        const filters: any = Object.assign({}, state.filters, {
            [name]: value,
        });

        if (props.activePositionFilter && props.setActivePositionFilter && name === 'position') {
            props.setActivePositionFilter(value);
        } else {
            setState({ ...state, filters });
        }
    }

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
    }

    const onPickHandler = (e: any, record: any) => {
        e.stopPropagation();

        if (props.onPick) {
            props.onPick(record);
        }
    }

    const columns = [
        {
            title: '',
            key: 'avatar',
            dataIndex: 'avatar',
            width: '15%',
            render: (txt: string, record: any) => {
                const sportSpecificProps: {
                    shirtSoccer?: string,
                    soccerJersey?: string,
                    clubBadge?: string,
                    portraitFace?: string,
                    shirtFallback?: string,
                    portraitFaceFallBack?: string,
                    club?: Club
                } = {};

                if (PlayerType.SoccerPortrait === props.playerType && record) {
                    // sportSpecificProps.soccerJersey = `${assetsCdn}/jerseys/club_${record.clubId}.png`;
                    // sportSpecificProps.clubBadge = `${assetsCdn}/badges/club_${record.clubId}.png`;
                    sportSpecificProps.portraitFace = record.portraitUrl;
                    // sportSpecificProps.portraitFaceFallBack = `${assetsCdn}/players/dummy.png`;
                }

                return (
                    <Player
                        key={`playerId-${record.id}`}
                        pointsColor={'#000'}
                        pointsBgColor={'#fff'}
                        badgeColor={'#fff'}
                        badgeBgColor={'#fff'}
                        avatarOnly={true}
                        player={record}
                        type={props.playerType}
                        {...sportSpecificProps}
                    />
                )
            }
        },
        {
            key: 'name',
            title: 'Player',
            dataIndex: 'name',
            width: '45%',
            render: (txt: string, record: any) => {
                const club = props.clubs?.find(club => club.id === record.clubId);
                const position = positions.find(
                    position => position.id === record.positionId
                );
                const positionColor = getPlayerPositionHexColor(record, theme);
                return (
                    <>
                        <PlayerStyle
                            type="mobile"
                            clubColor={'#81FFBC'}
                            position={record.positionId}
                        >
                            <p className="mobile-name">{record.short}</p>
                            <p>
                                <span style={{ color: "#16002b" }}>{club && club.short}</span> <span className="player-position" style={{ color: positionColor }}>
                                    {(!props.hidePositions && position && position.name) || null}
                                </span>
                            </p>
                            <p>
                                {(record.squadStatus === 'First team') && <GreenIcon style={{ marginRight: "2px" }} />}
                                {(record.squadStatus === 'Rotation') && <OrangeIcon style={{ marginRight: "2px" }} />}
                                {(record.squadStatus === 'Backup') && <RedIcon style={{ marginRight: "2px" }} />}

                                {(record.star === 1) && <StarIcon style={{ marginRight: "2px" }} />}
                                {(record.captain === 1) && <CaptainIcon style={{ marginRight: "2px" }} />}
                                {(record.setPieces === 1) && <SetPiecesIcon style={{ marginRight: "2px" }} />}
                            </p>
                        </PlayerStyle>
                        <PlayerStyle
                            type="desktop"
                            clubColor={'#81FFBC'}
                            position={record.positionId}
                        >
                            <div className="name">
                                <span> {record.short}</span>
                                <div className="icons">
                                    {(record.squadStatus === 'First team') && <GreenIcon style={{ marginRight: "2px" }} />}
                                    {(record.squadStatus === 'Rotation') && <OrangeIcon style={{ marginRight: "2px" }} />}
                                    {(record.squadStatus === 'Backup') && <RedIcon style={{ marginRight: "2px" }} />}

                                    {(record.star === 1) && <StarIcon style={{ marginRight: "2px" }} />}
                                    {(record.captain === 1) && <CaptainIcon style={{ marginRight: "2px" }} />}
                                    {(record.setPieces === 1) && <SetPiecesIcon style={{ marginRight: "2px" }} />}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.8rem' }}>
                                <span style={{ color: "#16002b" }}>{club && club.short}</span> <span className="player-position" style={{ color: positionColor }}>
                                    {(!props.hidePositions && position && position.name) || null}
                                </span>
                            </p>
                        </PlayerStyle>
                    </>
                )
            }
        },
        {
            key: 'value',
            title: 'Waarde',
            dataIndex: 'value',
            width: '20%',
            render: (value: string, record: any) => {
                return (
                    <span style={{ fontSize: '1rem' }}>
                        €{value}M
                    </span>
                )
            }
        }
    ]

    if (props.action) {
        columns.push({
            key: 'action',
            title: 'Pick player',
            dataIndex: 'action',
            width: '20%',
            render: (text: string, record: any) => {
                return (
                    (props.isPickable && props.isPickable(record) && (
                        <Button
                            type="primary"
                            onClick={(e: any) => onPickHandler(e, record)}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            {props.actionLabel || t('general.pick')}
                        </Button>
                    )) || <span />
                );
            },
        })
    }

    return (
        <ContainerStyle>
            {
                <Input
                    prefix={<SearchOutlined />}
                    type="text"
                    placeholder={t('general.playersListSearchInputPlaceholder').toString()}
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
                    style={{ marginLeft: 0 }}
                    keyProperty={'id'}
                    onSelect={(value: any) => onFilterChange('club', value)}
                    textProperty={'name'}
                    placeholder={clubsList[0].name}
                />
                <Select
                    $block
                    values={budgets}
                    style={{ marginRight: 0 }}
                    keyProperty={'value'}
                    onSelect={(value: any) => onFilterChange('budget', value)}
                    textProperty={'text'}
                    placeholder={budgets[0].text}
                />
            </SelectGroupStyle>
            <TableStyle
                loading={props.isLoading}
                showHeader={props.showHeader}
                columns={columns}
                dataSource={props.data.filter(player => playerFilter(player))}
                rowKey="id"
                rowClassName={(record: object, index: number) =>
                    `${index % 2 ? 'ant-table-row--odd' : 'ant-table-row--even'}`
                }
                size="small"
                pagination={{ position: ['bottomCenter'], pageSize: 15, showLessItems: true, showSizeChanger: false }}
            >
                {/* <tbody>
                {
                    props.data.filter(player => playerFilter(player)).map(player => {
                        return (
                            <tr key={player.id}>
                                <td>{player.positionId}</td>
                                <td>{player.name}</td>
                            </tr>
                        );
                    })
                }
            </tbody> */}
            </TableStyle>
        </ContainerStyle>
    )

}