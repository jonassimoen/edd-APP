import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Input } from "@/components/UI/Input/Input";
import { Select } from "@/components/UI/Select/Select";
import { openErrorNotification, openSuccessNotification, statusToIconColor } from "@/lib/helpers";
import { useGetClubsQuery } from "@/services/clubsApi";
import { useCreateMatchMutation, useGetMatchesQuery, useImportMatchesMutation, useUpdateMatchMutation } from "@/services/matchesApi";
import { useGetWeeksQuery } from "@/services/weeksApi";
import { CloseOutlined, DownloadOutlined, EditOutlined, PlusOutlined, QuestionOutlined, SkinOutlined } from "@ant-design/icons";
import { DatePicker, InputNumber, Modal, Table, Tag } from "antd";
import locale from "antd/es/date-picker/locale/nl_BE";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
declare type GameManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	openImportModal: boolean
	editObject?: Match
	selectedHomeId?: number
	selectedAwayId?: number
}

export const GameManagement = () => {
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSucces } = useGetMatchesQuery();
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSucces } = useGetWeeksQuery();
	const [importMatches, { data: imports, isLoading: isImportMatchesLoading, isError: isImportMatchesError, error: importMatchesError, isSuccess: isImportMatchesSuccess }] = useImportMatchesMutation();

	const [createMatch] = useCreateMatchMutation();
	const [updateMatch] = useUpdateMatchMutation();
	const [state, setState] = useState<GameManagementState>({
		openEditModal: false,
		openCreateModal: false,
		openImportModal: false,
	});
	const { t } = useTranslation();

	const ScoreMatchEdit =
		<>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"homeScore"}
						label={"Home"}
						rules={([{
							required: true,
							message: t("property.match.homescore.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"awayScore"}
						label={"Away"}
						rules={([{
							required: true,
							message: t("property.match.awayscore.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
			</Row>
		</>;

	const MatchCreateForm =
		<>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"date"}
						label={"Date"}
						getValueProps={(i: string) => ({ value: dayjs(i) || dayjs("") })}
						rules={([{
							required: true,
							message: t("property.match.date.required")
						}])}
					>
						<DatePicker
							showTime={true}
							locale={locale}
							defaultPickerValue={dayjs()}
							allowClear={false}
						// format={["DD/MM/YYYY HH:mm", "YYYY-MM-DD\THH:mm:ss.SSS\Z"]}
						/>
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"weekId"}
						label={"Week"}
						rules={([{
							required: true,
							message: t("property.match.week.required").toString()
						}])}
					>
						<Select
							keyProperty="id"
							textProperty="id"
							placeholder={"Week"}
							values={weeks || []}
							onChange={(value: number) => setState({ ...state, selectedAwayId: value })}
						/>
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"homeId"}
						label={"Home"}
						rules={([
							{
								message: t("property.match.differentClubs"),
								validator: (_: any, value: number) => {
									if (!state.selectedAwayId || state.selectedAwayId !== value) {
										return Promise.resolve();
									} else {
										return Promise.reject("Same value for home and club");
									}
								}
							}
						])}
					>
						<Select
							keyProperty="id"
							textProperty="name"
							placeholder={"Home"}
							values={clubs || []}
							onChange={(value: number) => setState({ ...state, selectedHomeId: value })}
						/>
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"awayId"}
						label={"Away"}
						rules={([
							{
								message: t("property.match.differentClubs"),
								validator: (_: any, value: number) => {
									if (!state.selectedHomeId || state.selectedHomeId !== value) {
										return Promise.resolve();
									} else {
										return Promise.reject("Same value for home and club");
									}
								}
							}
						])}
					>
						<Select
							keyProperty="id"
							textProperty="name"
							placeholder={"Away"}
							values={clubs || []}
							onChange={(value: number) => setState({ ...state, selectedAwayId: value })}
						/>
					</FormItem>
				</Col>
			</Row>
		</>;
	return (
		<>
			<Row align='middle'>
				<Col lg={16} md={10}>
					<Title level={2}>Game management</Title>
				</Col>

				<Col lg={4} md={7}>
					<Button
						style={{ width: "100%" }}
						icon={<DownloadOutlined />}
						onClick={() => setState({ ...state, openImportModal: true })}
						type="default"
						disabled={isImportMatchesLoading}
					>{t("management.game.import")}
					</Button>
				</Col>
				<Col lg={4} md={7}>
					<Button
						style={{ width: "100%" }}
						icon={<PlusOutlined />}
						onClick={() => setState({ ...state, openCreateModal: true })}
						type="primary"
					>
						{t("management.game.add")}
					</Button>
				</Col>
			</Row>
			{matches && (
				<Table
					loading={matchesLoading}
					dataSource={matches}
					rowKey={"id"}
					size="small"
					bordered
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							width: "5%",
							render: (txt: number, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Week",
							dataIndex: "weekId",
							width: "5%",
							render: (weekId: number, record: any) => {
								const week = weeks && weeks.find((week: Week) => week.id === weekId);
								console.log(week);
								if(week) {
									return (<p>{week && week?.name ? t(`general.weeks.${week?.name}`) : `${t("general.footballWeek")} ${weekId}`}</p>);
								} else {
									return (<p>-</p>);
								}
							}
						},
						{
							title: "Date",
							dataIndex: "date",
							width: "20%",
							render: (date: Date, record: any) => {
								return (
									<p>{dayjs(date).format("DD/MM/YYYY HH:mm")}</p>
								);
							}
						},
						{
							title: "Status",
							dataIndex: "status",
							width: "5%",
							render: (status: string, record: any) => {
								const { color, icon } = statusToIconColor(status);
								return (
									<Tag color={color} icon={icon}>{status}</Tag>
								);
							}
						},
						{
							title: "Home",
							dataIndex: "home",
							width: "25%",
							render: (club: Club, record: any) => {
								return (
									<p>{club?.name}</p>
								);
							}
						},
						{
							title: "Away",
							dataIndex: "away",
							width: "25%",
							render: (club: Club, record: any) => {
								return (
									<p>{club?.name}</p>
								);
							}
						},
						{
							title: "Score",
							dataIndex: "homeScore",
							width: "10%",
							align: "center",
							render: (txt: string, record: Match) => {
								if (new Date(record.date).getTime() + 90 * 60 * 1000 < Date.now()) {
									if (record.homeScore !== -1 && record.awayScore !== -1) {
										return (<p>{record.homeScore} - {record.awayScore}</p>);
									} else {
										return (<QuestionOutlined />);
									}
								} else {
									return (<CloseOutlined />);
								}
							}
						},
						{
							dataIndex: "operation",
							width: "10%",
							align: "center",
							render: (_: any, record: any) => {
								if (new Date(record.date).getTime() < Date.now() && record.homeId && record.awayId) {
									return (<Link to={`events/${record.id}`}>
										<Button
											icon={<SkinOutlined />}
											shape={"circle"}
											type="primary"
										/>
									</Link>);
								} else {
									return (<Button
										icon={<EditOutlined />}
										onClick={() => setState({ ...state, openEditModal: true, editObject: record })}
										shape={"circle"}
										type="primary"
									/>);
								}
							}
						}
					]}
				/>
			)}
			<EditModal
				open={state.openEditModal}
				onCreate={(match: Match) => { updateMatch(match); setState({ ...state, openEditModal: false }); }}
				onCancel={() => setState({ ...state, openEditModal: false })}
				object={state.editObject}
				type='match'
				action='edit'
			>
				<FormItem
					name={"id"}
					hidden={true}
				>
					<InputNumber />
				</FormItem>
				{MatchCreateForm}

			</EditModal>
			<EditModal
				object={{} as Match}
				open={state.openCreateModal}
				onCreate={(match: Match) => { createMatch(match); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				type='match'
				action='create'
			>
				{MatchCreateForm}

			</EditModal>

			<Modal
				title={t("management.import.confirmTitle")}
				open={state.openImportModal}
				onOk={async () => {
					toast.loading(t("admin.importing.loading"), { toastId: "loading-importing-games" });
					try {
						const data = await importMatches().unwrap();
						toast.dismiss("loading-importing-games");
						openSuccessNotification({ title: "Import successfull", message: `${data.count} games imported` });
					} catch(err) {
						toast.dismiss("loading-importing-games");
						openErrorNotification({ title: "Importing games failed" });
						console.log(err);
					}
					setState({ ...state, openImportModal: false });
				}}
				onCancel={() => setState({ ...state, openImportModal: false })}
				cancelText={t("cancelBtn")}
			>
				Het importeren is een <b>zeer kostbare</b> operatie. Zeker dat je wilt doorgaan? Het importeren kan enkele seconden tot minuten duren!
			</Modal >
		</>
	);
};