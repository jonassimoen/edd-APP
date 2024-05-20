import { CreateModal } from "@/components/CreateModal";
import { EditModal } from "@/components/EditModal";
import { useGetClubsQuery } from "@/services/clubsApi";
import { useCreatePlayerMutation, useGetPlayersQuery, useImportPlayersMutation, useUpdatePlayerMutation } from "@/services/playersApi";
import { EditOutlined, PlusOutlined, CopyrightCircleOutlined, PlusCircleOutlined, RocketOutlined, CloseCircleOutlined, StarOutlined, DownloadOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Table, InputNumber, Modal } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SpecialitiesIcons } from "./PlayerManagementStyle";
import { Button } from "@/components/UI/Button/Button";
import { Select } from "@/components/UI/Select/Select";
import { Checkbox } from "@/components/UI/Checkbox/Checkbox";
import { Col, Row } from "@/components/UI/Grid/Grid";
import Input from "antd/es/input/Input";
import { FormItem } from "@/components/UI/Form/Form";
import { toast } from "react-toastify";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";

declare type PlayerManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	openImportModal: boolean
	editObject?: Player
	nameFilter?: string
}



export const PlayerManagement = () => {
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSucces } = useGetPlayersQuery();
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
	const [importPlayers, { data: imports, isLoading: isImportPlayersLoading, isError: isImportPlayersError, error: importPlayersError, isSuccess: isImportPlayersSuccess }] = useImportPlayersMutation();

	const [updatePlayer] = useUpdatePlayerMutation();
	const [createPlayer] = useCreatePlayerMutation();
	const [state, setState] = useState<PlayerManagementState>({
		openEditModal: false,
		openCreateModal: false,
		openImportModal: false,
		nameFilter: "",
	});

	useEffect(() => {
		!isImportPlayersLoading && toast.dismiss("loading-importing-players");
		// isImportPlayersSuccess && openSuccessNotification({title: "Import successfull", message: `${imports.count} clubs imported`});
		// isImportPlayersError && openErrorNotification({title: "Import failed" });
	}, [isImportPlayersLoading]);

	const { t } = useTranslation();
	const positionsName = [
		t("player.goalkeeper"),
		t("player.defender"),
		t("player.midfielder"),
		t("player.attacker"),
	];

	const PlayerForm =
		<>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"externalId"}
						label={t("property.player.externalId")}
						tooltip='Extern API id'
					>
						<InputNumber />
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"value"}
						label={t("property.player.value")}
					>
						<InputNumber addonBefore="€" addonAfter="M" />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"positionId"}
						label={t("property.player.position")}
					>
						<Select
							keyProperty="value"
							textProperty="label"
							placeholder={"Positie"}
							values={positionsName.map((name: string, idx: number) => ({ value: idx + 1, label: name }))}
						/>
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"clubId"}
						label={"Club"}
					>
						<Select
							keyProperty="id"
							textProperty="name"
							placeholder={"Club"}
							values={clubs}
						/>
					</FormItem>

				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={8}>
					<FormItem
						name={"forename"}
						label={"First name"}
						rules={([{
							required: true,
							message: t("property.player.forename.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={8}>
					<FormItem
						name={"surname"}
						label={"Last name"}
						rules={([{
							required: true,
							message: t("property.player.surname.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={8}>
					<FormItem
						name={"short"}
						label={"Short name"}
						rules={([{
							required: true,
							message: t("property.player.shortname.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={4}>
					<FormItem
						name={"captain"}
						label={"Captain"}
						valuePropName="checked"
					>
						<Checkbox style={{ padding: "auto" }} />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"star"}
						label={"Sterspeler"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"setPieces"}
						label={"Set Pieces"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"banned"}
						label={"Banned"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"form"}
						label={"In form"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"injury"}
						label={"Injury"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={24}>
					<FormItem
						name={"portraitUrl"}
						label={"Picture URL"}
					>
						<Input />
					</FormItem>
				</Col>
			</Row>
		</>;




	return (
		<>
			<Row align='middle'>

				<Col lg={16} md={10}>
					<Title level={2}>Player management</Title>
				</Col>
				<Col lg={4} md={7}>
					<Button
						style={{ width: "100%" }}
						icon={<DownloadOutlined />}
						onClick={() => setState({ ...state, openImportModal: true })}
						type="default"
						disabled={isImportPlayersLoading}
					>{t("management.player.import")}
					</Button>
				</Col>
				<Col lg={4} md={7}>
					<Button
						style={{ width: "100%" }}
						icon={<PlusOutlined />}
						onClick={() => setState({ ...state, openCreateModal: true })}
						type="primary"
					>
						{t("management.player.add")}
					</Button>
				</Col>
			</Row>
			<Row>
				<Input
					prefix={<SearchOutlined />}
					type="text"
					placeholder={t("general.playersListSearchInputPlaceholder").toString()}
					name="search"
					onChange={(event: any) => setState({...state, nameFilter: event.target.value})
					}
				/>
			</Row>

			{players && (
				<Table
					loading={playersLoading}
					dataSource={players.filter((p: Player) => p.name.toLowerCase().includes(state.nameFilter))}
					rowKey={"id"}
					size="small"
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							width: "3%",
							render: (txt: number, record: any) => {
								return (
									<p>{txt}</p>
								);
							},
							sorter: (a: Player, b: Player) => b.id - a.id,
							defaultSortOrder: "descend"
						},
						{
							title: "EID",
							dataIndex: "externalId",
							width: "5%",
							render: (txt: number, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Positie",
							dataIndex: "positionId",
							width: "5%",
							render: (positionId: number, record: any) => {
								return (
									<p>{positionsName[positionId - 1]}</p>
								);
							},
							filters: positionsName.map((pos: string, id: number) => ({ text: pos, value: id + 1 })),
							onFilter: (value, record) => record.positionId === value,
						},
						{
							title: "Club",
							dataIndex: "clubId",
							width: "10%",
							render: (playerClubId: number, record: any) => {
								return (
									<p>{clubs?.filter((c: Club) => c.id === playerClubId)?.at(0)?.short}</p>
								);
							},
							filters: clubs?.map((c: Club) => ({ text: c.name, value: +c.id })),
							onFilter: (value, record) => record.clubId === value
						},
						{
							title: "Value",
							dataIndex: "value",
							width: "5%",
							render: (value: number, record: any) => {
								return (
									<p>{value}</p>
								);
							},
							sorter: (a: Player, b: Player) => b.value - a.value
						},
						{
							title: "Last name",
							dataIndex: "surname",
							width: "20%",
						},
						{
							title: "First name",
							dataIndex: "forename",
							width: "20%",
							render: (txt: string, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Short name",
							dataIndex: "short",
							width: "15%",
							render: (txt: string, record: any) => {
								return (
									<p>{txt}</p>
								);
							},
						},
						{
							title: "Specialities",
							dataIndex: "id",
							width: "20%",
							render: (id: number, record: any) => {
								const propsNames = ["captain", "banned", "injury", "form", "setPieces", "star"];
								const props = [
									{
										icon: <CopyrightCircleOutlined key='cap' />,
										value: record.captain
									},
									{
										icon: <CloseCircleOutlined key='ban' />,
										value: record.banned
									},
									{
										icon: <PlusCircleOutlined key='injury' />,
										value: record.injury
									},
									{
										icon: <RocketOutlined key='sp' />,
										value: record.setPieces
									},
									{
										icon: <StarOutlined key='star' />,
										value: record.star
									},
								].filter((obj: any) => obj.value).map((obj: any) => obj.icon); //t(`player.properties.${obj.name}`)
								return (
									<SpecialitiesIcons>{props}</SpecialitiesIcons>
								);
							}
						},
						{
							dataIndex: "operation",
							width: "10%",
							align: "center",
							render: (_: any, record: any) => {
								return (
									<Button
										icon={<EditOutlined />}
										onClick={() => setState({ ...state, openEditModal: true, editObject: record })}
										shape={"circle"}
										type="primary"
									/>
								);
							}
						}
					]}
				/>
			)}
			<EditModal
				object={state.editObject}
				open={state.openEditModal}
				onCreate={(player: any) => { updatePlayer(player); setState({ ...state, openEditModal: false }); }}
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='player'
				action='edit'
			>

				<FormItem
					name={"id"}
					hidden={true}
				>
					<InputNumber />
				</FormItem>
				{PlayerForm}
			</EditModal>
			<CreateModal
				open={state.openCreateModal}
				object={{} as Player}
				onCreate={(player: Partial<Player>) => { createPlayer(player); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				title={t("playerTitle")}
			>
				{PlayerForm}
			</CreateModal>
			<Modal
				title={t("management.import.confirmTitle")}
				open={state.openImportModal}
				onOk={async () => {
					toast.loading(t("admin.importing.loading"), { toastId: "loading-importing-players" });
					try {
						const data = await importPlayers("club").unwrap();
						toast.dismiss("loading-importing-players");
						openSuccessNotification({ title: "Import successfully started", message: "Soon all players will be available!" });
					} catch (err) {
						toast.dismiss("loading-importing-players");
						openErrorNotification({ title: "Importing players failed" });
					}
					setState({ ...state, openImportModal: false });
				}}
				onCancel={() => setState({ ...state, openImportModal: false })}
				cancelText={t("cancelBtn")}
			>
				Het importeren is een <b>zeer kostbare</b> operatie. Zeker dat je wilt doorgaan?
				<p><ExclamationCircleOutlined style={{ color: "red" }} /> Het importeren duurt min. 5 minuten!</p>
			</Modal >
		</>
	);
};