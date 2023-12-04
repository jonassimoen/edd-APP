import App from "@/App";
import { CreateModal } from "@/components/CreateModal";
import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { Form, FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Input } from "@/components/UI/Input/Input";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useCreateClubMutation, useGetClubsQuery, useImportClubsMutation, useUpdateClubMutation } from "@/services/clubsApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { DownloadOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, InputNumber, Modal, notification } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
declare type ClubManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	openImportModal: boolean
	editObject?: Club
}

export const ClubManagement = () => {
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSucces } = useGetPlayersQuery();
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
	const [updateClub, { data: updatedClub, isLoading: isUpdateClubsLoading, isError: isUpdateClubError, error: updateClubError, isSuccess: isUpdateClubsSuccess }] = useUpdateClubMutation(); // todo: change with fullfilled: useEffect on fullfill
	const [createClub, { data: createdClub, isLoading: isCreateClubsLoading, isError: isCreateClubError, error: createClubError, isSuccess: isCreateClubSuccess }] = useCreateClubMutation();
	const [importClubs, { data: imports, isLoading: isImportClubsLoading, isError: isImportClubsError, error: importClubsError, isSuccess: isImportClubsSuccess }] = useImportClubsMutation();
	const [state, setState] = useState<ClubManagementState>({
		openEditModal: false,
		openCreateModal: false,
		openImportModal: false,
	});
	const { t } = useTranslation();

	const ClubForm =
		<>
			<Row gutter={16}>
				<Col span={8}>
					<FormItem
						name={"externalId"}
						label={"Extern ID"}
						tooltip='Extern API id'
					>
						<InputNumber />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<FormItem
						name={"name"}
						label={"Name"}
						rules={([{
							required: true,
							message: t("property.club.name.required")
						}])}
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem
						name={"short"}
						label={"Short name"}
						rules={([{
							required: true,
							message: t("property.club.short.required")
						}])}
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
					<Title level={2}>Club management</Title>
				</Col>
				<Col lg={4} md={7}>
					<Button style={{ width: "100%" }} icon={<DownloadOutlined />} onClick={() => setState({ ...state, openImportModal: true })} type="default">{t("management.club.import")}</Button>
				</Col>
				<Col lg={4} md={7}>
					<Button style={{ width: "100%" }} icon={<PlusOutlined />} onClick={() => setState({ ...state, openCreateModal: true })} type="primary">{t("management.club.add")}</Button>
				</Col>
			</Row>
			{clubs && (
				<Table
					loading={clubsLoading}
					dataSource={clubs}
					rowKey={"id"}
					size="small"
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
							title: "EID",
							dataIndex: "externalId",
							width: "10%",
							render: (txt: number, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Name",
							dataIndex: "name",
							width: "25%",
							render: (txt: string, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Short",
							dataIndex: "short",
							width: "20%",
							render: (txt: string, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "# players",
							dataIndex: "id",
							width: "20%",
							render: (txt: number, record: any) => {
								return (
									<p>{players?.filter((p: Player) => p.clubId === record.id).length}</p>
								);
							}
						},
						{
							dataIndex: "operation",
							width: "10%",
							align: "center",
							render: (_: any, record: any) => {
								return (
									<>
										<Button
											icon={<EditOutlined />}
											onClick={() => setState({ ...state, openEditModal: true, editObject: record })}
											shape={"circle"}
											type="primary"
										/>

									</>
								);
							}
						}
					]}
				/>
			)}
			<EditModal
				object={state.editObject}
				open={state.openEditModal}
				onCreate={(club: Club) => {
					updateClub(club);
					setState({ ...state, openEditModal: false });
				}}
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='club'
				action='edit'
			>
				<FormItem
					name={"id"}
					hidden={true}
				>
					<InputNumber />
				</FormItem>
				{ClubForm}

			</EditModal>
			<EditModal
				object={{} as Club}
				open={state.openCreateModal}
				onCreate={(club: Club) => {
					createClub(club);
					setState({ ...state, openCreateModal: false });
				}}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				type='club'
				action='create'
			>
				{ClubForm}

			</EditModal>

			<Modal
				title={t("management.import.confirmTitle")}
				open={state.openImportModal}
				onOk={async () => {
					toast.loading(t("admin.importing.loading"), { toastId: "loading-importing-clubs" });
					try {
						const data = await importClubs().unwrap();
						toast.dismiss("loading-importing-clubs");
						openSuccessNotification({ title: "Import successfull", message: `${data.count} clubs imported` });
					} catch(err) {
						toast.dismiss("loading-importing-clubs");
						openErrorNotification({ title: "Importing clubs failed" });
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