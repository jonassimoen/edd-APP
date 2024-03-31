import { EditModal } from "@/components/EditModal";
import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import Icon, { CheckOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, DatePicker, Table, Tag } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import locale from "antd/es/date-picker/locale/nl_BE";
import { useCreateWeekMutation, useGetWeeksQuery, useUpdateWeekMutation, useValidateWeekMutation } from "@/services/weeksApi";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { statusToIconColor } from "@/lib/helpers";
import React from "react";
import { ConfirmedSvg, UnConfirmedSvg } from "@/styles/custom-icons";
import { Input } from "@/components/UI/Input/Input";

const ConfirmedIcon = (props: any) => <Icon component={ConfirmedSvg} {...props} />;
const UnConfirmedIcon = (props: any) => <Icon component={UnConfirmedSvg} {...props} />;

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
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSucces } = useGetMatchesQuery();
	const [updateWeek] = useUpdateWeekMutation();
	const [createWeek] = useCreateWeekMutation();
	const [validateWeek] = useValidateWeekMutation();

	const numberMatchesByStateByWeekId = useMemo(() => matches?.reduce((group: { [key: number]: { [key: string]: number } }, match: Match) => {
		if (!group[match.weekId]) {
			group[match.weekId] = {};
		}
		if (!group[match.weekId][match.status]) {
			group[match.weekId][match.status] = 1;
		} else {
			group[match.weekId][match.status]++;
		}
		return group;
	}, {}) || {}, [matches]);

	const WeekForm = (<>
		<Row>
			<Col span={6}>
				<FormItem
					name={"id"}
					label={"ID"}
				>
					<Input type="number" />
				</FormItem>
			</Col>
			<Col span={18}>
				<FormItem
					name={"name"}
					label={"Naam"}
				>
					<Input />
				</FormItem>
			</Col>
		</Row>
		<Row>
			<Col span={24}>
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
		</Row></>
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
							title: "Deadline date",
							dataIndex: "deadlineDate",
							width: "30%",
							render: (date: Date, record: any) => {
								return (
									<p>{dayjs(date).format("DD/MM/YYYY HH:mm")}</p>
								);
							}
						},
						{
							title: "Naam",
							dataIndex: "name",
							width: "35%",
							render: (name: string, record: any) => {
								return (
									<p>{t(`general.weeks.${name}`)}</p>
								);
							}
						},
						{
							title: "Status",
							dataIndex: "validated",
							width: "15%",
							render: (validated: boolean, record: any) => {
								return (
									<React.Fragment>
										{
											validated ?
												<ConfirmedIcon />
												:
												<UnConfirmedIcon />
										}
									</React.Fragment>
								);
							}
						},
						{
							title: "Games",
							dataIndex: "id",
							width: "15%",
							render: (id: number, record: any) => {

								return (
									<>
										{numberMatchesByStateByWeekId[id] &&
											Object.entries(numberMatchesByStateByWeekId[id]).map(([status, nr]: [string, number]) => {

												const { color, icon } = statusToIconColor(status);
												return (

													<Badge count={nr} key={`match_${id}_${status}`}>
														<Tag color={color} icon={icon}>{status}</Tag>
													</Badge>
												);
											})

										}
									</>
								);
							}
						},
						{
							dataIndex: "id",
							width: "10%",
							align: "left",
							render: (_: any, record: any) => {
								// console.log(`Week ${record.id}: ${matches?.filter((m: Match) => m.weekId === record.id).length} matches, ${matches?.filter((m: Match) => m.status === "STATS_UPDATED").length} updated stats`)
								const isReadyToProcess = matches?.filter((m: Match) => m.weekId === record.id).reduce((statsUpdated: boolean, currentMatch: Match) => statsUpdated && currentMatch.status === "STATS_UPDATED", true);
								return <>
									{!record.validated &&
										<Button
											icon={< EditOutlined />}
											onClick={() => setState({ ...state, openEditModal: true, editObject: record })}
											shape="circle"
											type="primary"
										/>
									}
									{isReadyToProcess && !record.validated &&
										<Button
											icon={< CheckOutlined />}
											onClick={() => validateWeek({ id: record.id })}
											shape="circle"
											type="primary"
										/>
									}
								</>;
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