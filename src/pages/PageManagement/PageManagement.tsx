import { CreateModal } from "@/components/CreateModal";
import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { useCreatePageMutation, useDeletePageMutation, useGetPagesQuery, useUpdatePageMutation } from "@/services/pagesApi";
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveFilled } from "@ant-design/icons";
import { Divider, Form, Input, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import parseHTML from "html-react-parser";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TranslationStyle } from "./PlayerManagementStyle";
import JoditEditor from "jodit-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

declare type PageManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	editObject?: Page
	changingLang?: number
	changingLangValue?: string
}

export const PageManagement = () => {
	const { t } = useTranslation();
	const { data: pages, isLoading: pagesLoading, isError: pagesError, isSuccess: pagesSucces } = useGetPagesQuery();
	const [updatePage] = useUpdatePageMutation();
	const [createPage] = useCreatePageMutation();
	const [deletePage] = useDeletePageMutation();

	const [state, setState] = useState<PageManagementState>({
		openEditModal: false,
		openCreateModal: false,
		changingLang: -1,
	});

	const PageForm =
		<>
			<Row>
				<Col span={24}>
					<FormItem
						name={"slug"}
						label={t("property.page.slug")}
					>
						<Input />
					</FormItem>
				</Col>
			</Row>
			<Divider style={{margin: "1rem 0"}} />
			<Form.List name="translation">
				{(fields, { add, remove }) => (
					<>
						{
							fields.map((field) => (
								<Row key={field.key}>
									<Col span={16}>
										<Form.Item
											label={t("property.page.translation.langCode")}
											name={[field.name, "langCode"]}
										>
											<Input />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Button
											icon={<EditOutlined />}
											onClick={(event) => {
												setState((state) => ({...state, changingLang: field.key, changingLangValue: state.editObject.translation[field.key]?.body }));
											}}
											style={{ marginTop: "30px" }}
										>
											{t("management.page.edit")}
										</Button>
										<Button
											icon={<DeleteOutlined />}
											onClick={() => remove(field.name)}
											type="dashed"
											style={{ marginTop: "30px" }}
										>
											{t("management.page.remove")}
										</Button>
									</Col>
									<Col span={24}>
										{parseHTML(state.editObject.translation[field.key]?.body || t("management.page.noBody")) }
									</Col>
									<Divider style={{margin: "1rem 0"}} />
								</Row>
							))}

						<Button
							icon={<PlusOutlined />}
							onClick={() => add()}
							type="primary"
							style={{width:"100%"}}
						>
							{t("management.page.add")}
						</Button>
					</>
				)}
			</Form.List>
			<Divider style={{margin: "1rem 0"}} />
			{
				state.changingLang !== -1 ? (
					<>
						<CKEditor
							editor={ ClassicEditor }
							data={state.changingLangValue}
							onReady={ editor => editor.data.set(state.changingLangValue || "Write html...") }
							onChange={ ( event, editor ) => setState((state) => ({...state, changingLangValue: editor.data.get()})) }
						/>
						<Button
							icon={<SaveFilled />}
							onClick={() => {
								console.log(state.editObject, state.changingLang, state.changingLangValue);
								const translations = state.editObject.translation.map((tl: PageTranslation, index: number) => 
									(index === state.changingLang) ? ({...tl, body: state.changingLangValue}) : tl);
								setState({
									...state, 
									editObject: {
										...state.editObject,
										translation: translations
									},
									changingLang: -1,
									changingLangValue: "",
								});
							}}
							type="primary"
							style={{width:"100%"}}
						></Button>
					</>
				) : null
			}
			
		</>;

	return (
		<>

			<Row align='middle'>
				<Col md={20} sm={12} xs={24}>
					<Title level={2}>Pages management</Title>
				</Col>
				<Col md={4} sm={12} xs={24}>
					<Button style={{ float: "right" }} icon={<PlusOutlined />} onClick={() => setState({ ...state, openCreateModal: true })} type="primary">{t("management.page.add")}</Button>
				</Col>
			</Row>

			{pages && (
				<Table
					loading={pagesLoading}
					dataSource={pages}
					rowKey={"id"}
					size="small"
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							width: "3%",
						},
						{
							title: "Slug",
							dataIndex: "slug",
							width: "5%",
							render: (txt: number, record: any) => {
								return (
									<p>{txt}</p>
								);
							}
						},
						{
							title: "Translations",
							dataIndex: "translation",
							width: "5%",
							render: (translations: PageTranslation[], record: any) => {
								return translations.map((tl: PageTranslation) => (
									<TranslationStyle key={`tl_${tl.id}`}>
										<b>{tl.langCode}</b>
										<p>{tl.body.slice(0, 100)}...</p>
									</TranslationStyle>
								));
							},
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
										<Button
											icon={<DeleteOutlined />}
											onClick={() => deletePage(record)}
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
				onCreate={(page: any) => { updatePage(page); setState({ ...state, openEditModal: false }); }}
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='page'
				action='edit'
				width={950}
			>

				<FormItem
					name={"id"}
					hidden={true}
				>
					<InputNumber />
				</FormItem>
				{PageForm}
			</EditModal>
			<CreateModal
				open={state.openCreateModal}
				object={{} as Page}
				onCreate={(page: Page) => { createPage(page); setState({ ...state, openCreateModal: false }); }}
				onCancel={() => setState({ ...state, openCreateModal: false })}
				title={t("pageTitle")}
				width={950}
			>
				{PageForm}
			</CreateModal>
		</>
	);
};