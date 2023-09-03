import { MatchEventsList } from "@/components/MatchEventsList/MatchEventsList";
import { useCreateMatchEventsMutation, useCreateMatchStartingMutation, useGetMatchEventsQuery, useGetMatchQuery, useGetMatchesQuery } from "@/services/matchesApi";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { GameCenterManagementStyle } from "./GameCenterManagementStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Grid, InputNumber } from "antd";
import { Button } from "@/components/UI/Button/Button";
import { PlusOutlined, SaveOutlined, SkinOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { FormItem } from "@/components/UI/Form/Form";
import { CreateModal } from "@/components/CreateModal";
import { useGetPlayersQuery } from "@/services/playersApi";
import { useTranslation } from "react-i18next";
import { EditModal } from "@/components/EditModal";
import { Select } from "@/components/UI/Select/Select";
import { Checkbox } from "@/components/UI/Checkbox/Checkbox";

declare type GameCenterManagementState = {
    openCreateModal: boolean
    openSaveModal: boolean
    openStartingModal: boolean
    cacheEvents: MatchEvent[]
}

const EventTypes = ["Goal", "Red card"];

const createStartingEvents = (formObj: object): number[] => {
	return Object.entries(formObj).filter((v: [string, any]) => v[1]).map((v: [string, any]) => +(v[0]));
};

export const GameCenterManagement = () => {
	const { id } = useParams();
	const [state, setState] = useState<GameCenterManagementState>({
		openCreateModal: false,
		openSaveModal: false,
		openStartingModal: false,
		cacheEvents: []
	});

	const { data: match, isLoading: matchLoading, isError: matchError, isSuccess: matchSucces } = useGetMatchQuery(+(id || 0));
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSucces } = useGetPlayersQuery();
	const { data: events, isLoading: eventsLoading, isError: eventsError, isSuccess: eventsSucces } = useGetMatchEventsQuery(+(id || 0));

	const homePlayers = useMemo(() => players?.filter((p: Player) => p.clubId === match?.home?.id), [match, players]);
	const awayPlayers = useMemo(() => players?.filter((p: Player) => p.clubId === match?.away?.id), [match, players]);

	const allEvents: MatchEvent[] = useMemo(() => state.cacheEvents.concat(events || []), [events, state.cacheEvents]);

	const [createMatchEvents] = useCreateMatchEventsMutation();
	const [createMatchStarting] = useCreateMatchStartingMutation();

	const { t } = useTranslation();

	const EventForm =
        <>
        	<Row gutter={16}>
        		<Col span={24}>
        			<FormItem
        				name={"playerId"}
        				label={t("property.event.player")}
        				rules={([{
        					required: true,
        					message: t("property.event.player.required")
        				}])}
        			>
        				<Select
        					keyProperty="value"
        					textProperty="label"
        					placeholder={"Speler"}
        					showSearch
        					optionFilterProp="children"
        					values={players?.filter((player: Player) => player.clubId === match?.home?.id || player.clubId === match?.away?.id).map((player: Player) => ({ value: player.id, label: player.short })) || []}
        				/>
        			</FormItem>
        		</Col>
        	</Row>
        	<Row gutter={16}>
        		<Col span={12}>
        			<FormItem
        				name={"type"}
        				label={t("property.event.type")}
        				rules={([{
        					required: true,
        					message: t("property.event.type.required")
        				}])}
        			>
        				<Select
        					keyProperty="value"
        					textProperty="label"
        					placeholder={"Type"}
        					values={EventTypes?.map((type: string) => ({ value: type, label: type })) || []}
        				/>
        			</FormItem>
        		</Col>
        		<Col span={12}>
        			<FormItem
        				name={"minute"}
        				label={t("property.event.minute")}
        				rules={([{
        					required: true,
        					message: t("property.event.minute.required")
        				}])}
        			>
        				<InputNumber min={0} max={120} />
        			</FormItem>
        		</Col>
        	</Row>
        </>;

	const StartingForm = <>
		{homePlayers?.map((p: Player) =>
			(
				<FormItem
					key={`starting-${p.id}`}
					name={p.id}
					label={p.id}
					valuePropName="checked"
				>
					<Checkbox />
				</FormItem>
			))}
		{awayPlayers?.map((p: Player) =>
			(
				<FormItem
					key={`starting-${p.id}`}
					name={p.id}
					label={p.id}
					valuePropName="checked"
				>
					<Checkbox />
				</FormItem>
			))}
	</>;
	return (
		<GameCenterManagementStyle>
			<Row align='middle'>
				<Col xl={12} md={24} sm={24} xs={24}>
					<Title level={3}>#{match?.id} {match?.home?.name} - {match?.away?.name}</Title>
				</Col>
				<Col xl={4} md={15} sm={12}>
					<p>{new Date(match?.date || "").toLocaleString("nl-BE", { dateStyle: "full", timeStyle: "short" })}</p>
				</Col>
				<Col xl={2} md={3} sm={6}>
					<Button
						type="default"
						icon={<PlusOutlined />}
						onClick={() => setState({ ...state, openCreateModal: true })}
					>
                        Nieuw event
					</Button>
				</Col>
				<Col xl={2} md={3} sm={6}>
					<Button
						type="primary"
						icon={<SaveOutlined />}
						onClick={() => setState({ ...state, openSaveModal: true })}
					>
                        Opslaan
					</Button>
				</Col>
				<Col xl={2} md={3} sm={6}>
					<Button
						type="default"
						icon={<SkinOutlined />}
						onClick={() => setState({ ...state, openStartingModal: true })}
					>
                        Lineup
					</Button>
				</Col>
			</Row>

			{
				match && (new Date(match.date).getTime() + 90 * 60 * 1000 < Date.now()) && <MatchEventsList
					match={match} events={allEvents}
				/>
			}
			{
				match && (new Date(match.date).getTime() + 90 * 60 * 1000 > Date.now()) &&
                <p>Deze wedstrijd is nog niet afgewerkt.</p>
			}
			<EditModal
				open={state.openCreateModal}
				object={{ matchId: match?.id } as MatchEvent}
				onCreate={(event: MatchEvent) => {
					setState({ ...state, openCreateModal: false, cacheEvents: state.cacheEvents.concat([event]) });
				}}
				// onCreate={(event: MatchEvent) => { createMatchEvents(event); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				action='create'
				type='event'
			>
				<FormItem
					name={"matchId"}
					hidden
				>
					<InputNumber />
				</FormItem>
				{EventForm}
			</EditModal>
			<EditModal
				open={state.openSaveModal}
				object={{ matchId: match?.id } as MatchEvent}
				onCreate={() => { createMatchEvents({ events: allEvents, matchId: +(id || 0) }); setState({ ...state, openSaveModal: false }); }}
				// onCreate={(event: MatchEvent) => { createMatchEvents(event); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openSaveModal: false })}
				action='save'
				type='events'
			>
				<FormItem
					name={"matchId"}
					hidden
				>
					<InputNumber />
				</FormItem>
                Saving
			</EditModal>
			<EditModal
				open={state.openStartingModal}
				object={{ matchId: match?.id } as MatchEvent}
				onCreate={(e: MatchEvent) => { const { matchId, ...rest } = e; const events = createStartingEvents(rest); createMatchStarting({ startingIds: events, matchId: matchId || 0 }); setState({ ...state, openStartingModal: false }); }}
				// onCreate={(event: MatchEvent) => { createMatchEvents(event); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openStartingModal: false })}
				action='create'
				type='events'
			>
				<FormItem
					name={"matchId"}
					hidden
				>
					<InputNumber />
				</FormItem>
				{StartingForm}
			</EditModal>
		</GameCenterManagementStyle>

	);
};