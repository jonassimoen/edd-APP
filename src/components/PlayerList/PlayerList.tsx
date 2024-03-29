import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContainerStyle, PlayerStyle, SelectGroupStyle, TableStyle } from "./PlayerListStyle";
import Icon, { EuroOutlined, SearchOutlined, StarOutlined, TagsOutlined } from "@ant-design/icons";
import { CaptainSvg, FootballShoeSvg, FootballSvg, GreenSvg, OrangeSvg, PlusSvg, RacketSvg, RedSvg, SetPiecesSvg, StarSvg, StarterSvg } from "@/styles/custom-icons";
import { getPlayerPositionHexColor } from "@/lib/helpers";
import { theme } from "@/styles/theme";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "../UI/Button/Button";
import { Select } from "../UI/Select/Select";
import { Player } from "../Player/Player";
import { PlayerType } from "@/types/PlayerTypes";
import { Empty, Tooltip } from "antd";
import config from "@/config";

const CaptainIcon = (props: any) => <Icon component={CaptainSvg} {...props} />;
const SetPiecesIcon = (props: any) => <Icon component={SetPiecesSvg} {...props} />;
const StarIcon = (props: any) => <Icon component={StarSvg} {...props} />;
const InForm = (props: any) => <Icon component={RacketSvg} {...props} />;
const Injury = (props: any) => <Icon component={PlusSvg} {...props} />;

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
	matches?: any
	deadlineWeek?: any;
	playerTax?: number | undefined;
	assetsCdn: string
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
		showHeader
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
		{ id: -1, name: <span className={"prefixed-label"}> <TagsOutlined style={{ marginRight: 5 }} /> {t("general.footballAllPositions")} </span> },
		{ id: 1, name: t("player.goalkeeper") },
		{ id: 2, name: t("player.defender") },
		{ id: 3, name: t("player.midfielder") },
		{ id: 4, name: t("player.attacker") },
	];

	const budgets = [
		{ text: <span className={"prefixed-label"}> <EuroOutlined style={{ marginRight: 5 }} /> {t("general.footballAllBudget")} </span>, value: 100 },
		{ text: `${t("general.budgetFilterPrefix")} 10 ${t("general.budgetFilterSuffix")}`, value: 10 },
		{ text: `${t("general.budgetFilterPrefix")} 7 ${t("general.budgetFilterSuffix")}`, value: 7 },
		{ text: `${t("general.budgetFilterPrefix")} 6 ${t("general.budgetFilterSuffix")}`, value: 6 },
		{ text: `${t("general.budgetFilterPrefix")} 5 ${t("general.budgetFilterSuffix")}`, value: 5 },
	];

	const clubsList = [{
		id: -1,
		name: <span className={"prefixed-label"}> <StarOutlined style={{ marginRight: 5 }} /> {t("general.footballAllClubs")} </span>
	}]
		.concat(clubs.map((c: Club) => ({ id: c.id, name: <span>{c.name}</span> })));

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

	const columns = [
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
			render: (txt: string, record: Player) => {
				const club = clubs?.find(club => club.id === record.clubId);
				const position = positions.find(
					position => position.id === record.positionId
				);
				const positionColor = getPlayerPositionHexColor(record, theme);

				// fetch weekmatches
				const opponentInfo: any = null;

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
							<p>
								<span>{club && club.short} {opponentInfo ? `vs ${opponentInfo.short}` : null} </span>
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

	return (
		<ContainerStyle>
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
					style={{ marginLeft: 0 }}
					keyProperty={"id"}
					onSelect={(value: any) => onFilterChange("club", value)}
					textProperty={"name"}
					placeholder={clubsList[0].name}
				/>
				<Select
					$block
					values={budgets}
					style={{ marginRight: 0 }}
					keyProperty={"value"}
					onSelect={(value: any) => onFilterChange("budget", value)}
					textProperty={"text"}
					placeholder={budgets[0].text}
				/>
			</SelectGroupStyle>
			<SelectGroupStyle>
				<Select
					$block
					values={positions}
					value={state.filters.position}
					style={{ margin: "0px 0px" }}
					keyProperty={"id"}
					onSelect={(value: any) => onFilterChange("position", value)}
					textProperty={"name"}
					placeholder={positions[0].name}
				/>
			</SelectGroupStyle>
			<TableStyle
				loading={isLoading}
				showHeader={showHeader}
				columns={columns}
				dataSource={data.filter(player => playerFilter(player))}
				rowKey="id"
				rowClassName={(record: object, index: number) =>
					`${index % 2 ? "ant-table-row--odd" : "ant-table-row--even"}`
				}
				pagination={{ position: ["bottomCenter"], pageSize: 9, showLessItems: true, showSizeChanger: false }}
				locale={{
					emptyText: t("players.noneFound")
				}}
			>
			</TableStyle>
		</ContainerStyle>
	);

};