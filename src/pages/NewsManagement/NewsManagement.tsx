import { CreateModal } from "@/components/CreateModal";
import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Table } from "antd";
import { useCreateArticleMutation, useDeleteArticleMutation, useGetNewsQuery, useUpdateArticleMutation } from "@/services/newsApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Input } from "@/components/UI/Input/Input";
import { Checkbox } from "@/components/UI/Checkbox/Checkbox";
import JoditEditor from "jodit-react";

declare type NewsManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	editObject?: Article
	editorValue?: string
}

export const NewsManagement = () => {
	const { data: news, isLoading: newsLoading, isError: newsError, isSuccess: newsSucces } = useGetNewsQuery();
	const [updateArticle] = useUpdateArticleMutation();
	const [createArticle] = useCreateArticleMutation();
	const [deleteArticle] = useDeleteArticleMutation();

	const [state, setState] = useState<NewsManagementState>({
		openEditModal: false,
		openCreateModal: false,
	});
	const application = useSelector((state: StoreState) => state.application);
	const configEditor = useMemo(() => ({
		readonly: false, 
		placeholder: "Start met het schrijven van artikel",
	}), []);

	const { t } = useTranslation();

	const onArticleCreate = (article: Article) => { 
		setState((state) => ({ ...state, openCreateModal: false, editorValue: "" })); 
		createArticle(article); 
	};
	const onArticleUpdate = (article: Article) => { 
		setState((state) => ({ ...state, openEditModal: false, editorValue: "" })); 
		updateArticle(article); 
	};
	
	const ArticleForm =
		<>
			<Row gutter={16}>
				<Col span={8}>
					<FormItem
						name={"slug"}
						label={"Slug"}
						required
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={16}>
					<FormItem
						name={"imageUrl"}
						label={"Afbeelding [w/o sirv.com]"}
					>
						<Input />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={20}>
					<FormItem
						name={"title"}
						label={"Title"}
						required
					>
						<Input />
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem
						name={"readMore"}
						label={"Read more"}
						tooltip={"Zorgt voor redirect naar /news/<slug>"}
						valuePropName="checked"
					>
						<Checkbox />
					</FormItem>
				</Col>
			</Row>
			<Row gutter={16}>
				<FormItem
					name={"description"}
					label={"Beschrijving"}
					style={{width: "100%"}}
					required
				>
					<JoditEditor
						value={state.editorValue}
						config={configEditor}
						onBlur={newContent => setState((state) => ({...state, editorValue: newContent}))} // preferred to use only this option to update the content for performance reasons
						onChange={null}
					/>
				</FormItem>
			</Row>
		</>;

	return (
		<>
			<Row align='middle'>
				<Col md={20} sm={12} xs={24}>
					<Title level={2}>News management</Title>
				</Col>
				<Col md={4} sm={12} xs={24}>
					<Button style={{ float: "right" }} icon={<PlusOutlined />} onClick={() => setState({ ...state, openCreateModal: true })} type="primary">{t("management.article.add")}</Button>
				</Col>
			</Row>

			{news && (
				<Table
					loading={newsLoading}
					dataSource={news.articles}
					rowKey={"id"}
					size="small"
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							width: "5%"
						},
						{
							title: "Slug",
							dataIndex: "slug",
							width: "10%",
						},
						{
							title: "Tijdstip",
							dataIndex: "id",
							width: "15%",
							render: (txt: string, record: any) => {
								return record.timestampUpdated ? 
									<p>{`(${dayjs(record.timestampCreated).format("D MMM [om] HH:MM")})`}<br /> {dayjs(record.timestampUpdated).format("D MMM [om] HH:MM")}</p>
									: <p>{dayjs(record.timestampCreated).format("D MMM [om] HH:MM")}</p>
								;
							}
						},
						{
							title: "Title",
							dataIndex: "title",
							width: "25%",
						},
						{
							title: "Afbeelding",
							dataIndex: "imageUrl",
							width: "10%",
							render: (imageUrl: string, record: any) => {
								return imageUrl ? <Image src={`${application.competition.assetsCdn}/news/${imageUrl}`} preview={false} /> : null;
							}
						},
						{
							title: "Lees meer?",
							dataIndex: "readMore",
							width: "5%",
							render: (rm: boolean, record: any) => {
								return rm ? <CheckOutlined /> : <CloseOutlined />;
							}
						},
						{
							title: "Auteur",
							dataIndex: "author",
							width: "10%",
							render: (user: User, record: any) => {
								return user.firstName || "Geen auteur.";
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
											onClick={() => setState({ ...state, openEditModal: true, editObject: record, editorValue: record?.description })}
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
				open={state.openEditModal}
				object={state.editObject}
				onCreate={onArticleUpdate}
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='article'
				action='edit'
				width={1000}
			>

				<FormItem
					name={"id"}
					hidden={true}
				>
					<InputNumber />
				</FormItem>
				{ArticleForm}
			</EditModal>
			<CreateModal
				open={state.openCreateModal}
				object={{} as Article}
				onCreate={onArticleCreate}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				title={t("articleTitle")}
				width={1000}
			>
				{ArticleForm}
			</CreateModal>
		</>
	);
};