import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DatePicker, Table } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import locale from "antd/es/date-picker/locale/nl_BE";
import { useCreateWeekMutation, useGetWeeksQuery, useUpdateWeekMutation } from "@/services/weeksApi";

type WeekManagementState = {
    openEditModal: boolean
    openCreateModal: boolean
    editObject?: boolean
}

export const WeekManagement = () => {
	const [state, setState] = useState<WeekManagementState>({
		openCreateModal: false,
		openEditModal: false
	});
	const { t } = useTranslation();
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSuccess } = useGetWeeksQuery();
	const [updateWeek] = useUpdateWeekMutation();
	const [createWeek] = useCreateWeekMutation();

	const WeekForm = (
		<Row>
			<Col span={12}>
				<FormItem
					name={"id"}
					label={"Week ID"}
				>
					<InputNumber />
				</FormItem>
			</Col>
			<Col span={12}>
				<FormItem
					name={"deadlineDate"}
					label={"Deadline date"}
					getValueProps={(i: string) => ({ value: dayjs(i) || dayjs("") })}
				>
					<DatePicker
						showTime={true}
						locale={locale}
						defaultPickerValue={dayjs()}
						allowClear={false} />
				</FormItem>
			</Col>
		</Row>
	);

	return (
		<>
			<Row align='middle'>
				<Col md={20} sm={12} xs={24}>
					<Title level={2}>Week management</Title>
				</Col>
				<Col md={4} sm={12} xs={24}>
					<Button style={{ float: "right" }} icon={<PlusOutlined />} onClick={() => setState({ ...state, openCreateModal: true })} type="primary">{t("management.week.add")}</Button>
				</Col>
			</Row>
			{weeks && (
				<Table
					loading={weeksLoading}
					dataSource={weeks}
					rowKey={"id"}
					size="small"
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"] }}
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							width: "10%",
							render: (id: number, record: any) => {
								return (
									<p>{id}</p>
								);
							}
						},
						{
							title: "Date",
							dataIndex: "deadlineDate",
							width: "70%",
							render: (date: Date, record: any) => {
								return (
									<p>{new Date(date).toLocaleString()}</p>
								);
							}
						},
						{
							dataIndex: "operation",
							width: "20%",
							align: "center",
							render: (_: any, record: any) => {
								return (
									<Button
										icon={<EditOutlined />}
										onClick={() => setState({ ...state, openEditModal: true, editObject: record })}
										shape="circle"
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
				onCreate={(week: Week) => { updateWeek(week); setState({ ...state, openEditModal: false }); }} // todo
				onCancel={() => setState({ ...state, openEditModal: false })}
				type='week'
				action='edit'
			>
				{WeekForm}
			</EditModal>
			<EditModal
				object={{} as Week}
				open={state.openCreateModal}
				onCreate={(week: Week) => { createWeek(week); setState({ ...state, openCreateModal: false }); }} // todo
				onCancel={() => setState({ ...state, openCreateModal: false })}
				type='week'
				action='create'
			>
				{WeekForm}
			</EditModal>
		</>
	);
};