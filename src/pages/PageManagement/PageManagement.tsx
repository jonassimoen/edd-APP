import { CreateModal } from "@/components/CreateModal";
import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { useCreatePageMutation, useDeletePageMutation, useGetPagesQuery, useUpdatePageMutation } from "@/services/pagesApi";
import { theme } from "@/styles/theme";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Form, Input, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TranslationStyle } from "./PlayerManagementStyle";

declare type PageManagementState = {
	openEditModal: boolean
	openCreateModal: boolean
	editObject?: Page
}

export const PageManagement = () => {
	const { data: pages, isLoading: pagesLoading, isError: pagesError, isSuccess: pagesSucces } = useGetPagesQuery();
	const [updatePage] = useUpdatePageMutation();
	const [createPage] = useCreatePageMutation();
	const [deletePage] = useDeletePageMutation();

	const [state, setState] = useState<PageManagementState>({
		openEditModal: false,
		openCreateModal: false,
	});

	const { t } = useTranslation();

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
											icon={<DeleteOutlined />}
											onClick={() => remove(field.name)}
											type="dashed"
											style={{ marginTop: "30px" }}
										>
											{t("management.page.remove")}
										</Button>
									</Col>
									<Col span={24}>
										<Form.Item
											label={t("property.page.translation.body")}
											name={[field.name, "body"]}
										>
											<TextArea rows={10} />
										</Form.Item>
									</Col>
									<Divider />
								</Row>
							))}

						<Button
							icon={<PlusOutlined />}
							onClick={() => add()}
							type="primary"
						>
							{t("management.page.add")}
						</Button>
					</>
				)}
			</Form.List>
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
				onCreate={(page: any) => { console.log(page); updatePage(page); setState({ ...state, openEditModal: false }); }}
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='page'
				action='edit'
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
			>
				{PageForm}
			</CreateModal>
		</>
	);
};