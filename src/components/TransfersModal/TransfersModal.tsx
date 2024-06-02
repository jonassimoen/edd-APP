import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@ant-design/icons";
import { DeleteButtonSvg } from "@/styles/custom-icons";
import { Row } from "../UI/Grid/Grid";
import { TransfersModalStyle, TransfersModalListStyle } from "./TransfersModalStyle";

const ExitIcon = (props: any) => <Icon component={DeleteButtonSvg} {...props} />;

declare type TransfersModalProps = {
    visible: boolean
    onCancel: any
    transfers?: any[]
}

declare type TransfersModalState = {
	//todo
}

export const TransfersModal = (props: TransfersModalProps) => {
	const [state, setState] = useState<TransfersModalState>();
	const { t } = useTranslation();
	const { transfers } = props;

	useEffect(() => {
		if(props.visible) {
			document.documentElement.classList.add("fixed-position");
		} else {
			document.documentElement.classList.remove("fixed-position");
		}
	},[props.visible]);


	const columns = [
		{
			key: "id",
			width: "10%",
			title: "#",
			dataIndex: "id",
			render: (txt: string, record: any, index: number) => {
				return index + 1;
			}
		},
		{
			key: "outId",
			width: "45%",
			title: t("team.transferOut"),
			dataIndex: "outId",
			render: (txt: string, record: any) => {
				return record.outPlayer && record.outPlayer.name;
			}
		},
		{
			key: "inId",
			width: "45%",
			title: t("team.transferIn"),
			dataIndex: "inId",
			render: (txt: string, record: any) => {
				return record.inPlayer && record.inPlayer.name;
			}
		},
	];

	return (
		<TransfersModalStyle
			title={t("general.transfers")}
			closable={true}
			open={props.visible}
			onCancel={props.onCancel}
			footer={[]}
		>
			<Row>
				<TransfersModalListStyle
					columns={columns}
					dataSource={transfers}
					showHeader={true}
					locale={{ emptyText: "Geen transfers doorgevoerd." }}
					loading={false}
					pagination={false}
					rowKey={(record: any) => `record-${record.id + 1}`}
					rowClassName={(record: object, index: number) => index % 2 ? "ant-table-row--odd" : "ant-table-row--even"}
				/>
			</Row>
		</TransfersModalStyle>
	);
};