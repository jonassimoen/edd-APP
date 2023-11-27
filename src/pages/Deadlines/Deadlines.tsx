import { Block } from "@/components/Block/Block";
import { TableStyle } from "@/components/PlayerList/PlayerListStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { PageStyle } from "@/components/UI/Layout/LayoutStyle";
import { useGetWeeksQuery } from "@/services/weeksApi";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type DeadlinesProps = {
	//todo
}

type DeadlinesState = {
    selectedWeekMatches: any
    selectedWeek: any
    rssFeeds: any[]
}

export const Deadlines = (props: DeadlinesProps) => {
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSuccess } = useGetWeeksQuery();
	const [state, setState] = useState<DeadlinesState>({
		selectedWeekMatches: [],
		selectedWeek: null,
		rssFeeds: []
	});
	const { t } = useTranslation();
    
	const columns = [
		{
			title: "Speeldag",
			key: "weekId",
			dataIndex: "id",
			width: "30%",
			render: (txt: string, record: any) => {
				return <span>{txt}</span>;
			}
		},
		{
			title: "Deadline",
			key: "deadlineDate",
			dataIndex: "deadlineDate",
			width: "70%",
			render: (txt: string, record: any) => {
				return <b>{dayjs(txt).format("ddd DD/MM [om] HH:mm")}</b>;
			}
		}
	];

	return (
		<React.Fragment>
			<PageStyle>
				<Row>
					<Col md={12} sm={24}>
						<Block>
							<Title level={3}>Speeldagen</Title>
							<TableStyle
								columns={columns}
								dataSource={weeks}
								showHeader={true}
								locale={{ emptyText: t("deadlines.notFound") }}
								loading={weeksLoading}
								pagination={false}
								rowKey={(record: any) => `record-${record.id}`}
								rowClassName={(record: any) => `cursor-pointer ${record && state.selectedWeek && record.weekId === state.selectedWeek.weekId ? "selected-item" : ""} ${record.id % 2 ? "ant-table-row--odd" : "ant-table-row--even"}`}
							/>
						</Block>
					</Col>
				</Row>
			</PageStyle>
		</React.Fragment>
	);
};