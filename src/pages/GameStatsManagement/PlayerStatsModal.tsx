import { Checkbox } from "@/components/UI/Checkbox/Checkbox";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { Col, Row } from "@/components/UI/Grid/Grid";
import config from "@/config";
import { Card, Form, FormInstance, Modal } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PlayerStatsModalStyle } from "./PlayerStatsModalStyle";

type PlayerStatsModalProps = {
  open: boolean;
  playerStats: any;
  onConfirm: (playerStat: any) => void;
  onCancel: () => void;
}
;
const playerStateNil = config.STATISTICS.map((stat: any) => stat.inputs).flat().reduce((obj: any, item: any) => {
	obj[item.slug]=null;
	return obj;
}, {});

export const PlayerStatsModal = (props: PlayerStatsModalProps) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.open && form) {
			form.setFieldsValue({...playerStateNil, ...props.playerStats});
		}
	}, [props.open, props.playerStats, form]);

	const keyUpHandler = (event: any) => {
		// enter
		if(event.keyCode === 13) {
			form
				.validateFields()
				.then((obj) => props.onConfirm(obj));
		}
	};

	if (props.playerStats) {
		return (
			<PlayerStatsModalStyle
				width={1250}
				open={props.open}
				title={`Wijzig statistieken ${props.playerStats.short}`}
				okText={t("editBtn")}
				cancelText={t("cancelBtn")}
				onOk={() => {
					form
						.validateFields()
						.then((obj) => props.onConfirm(obj))
						.catch((err) => {
							console.log("Error while editing stats:", err);
						});
				}}
				onCancel={props.onCancel}
			>
				<p>Geef voor elke statistiek een hoeveelheid in. Bij het leeglaten wordt automatisch 0 ingevuld. Let erop dat je slechts 1 motm aanduidt!</p>
				<Form
					onKeyUp={keyUpHandler}
					colon={false}
					form={form}
					layout="horizontal"
					labelAlign="left"
					labelWrap
					labelCol={{ flex: 1 }}
					wrapperCol={{ flex: "25%" }}
					name={"modal_form_change_stats"}
				>
					<Row gutter={0}>
						{config.STATISTICS.filter((group: any) => group.positions?.includes(props.playerStats.positionId)).map((group: any, index: number) => (
							<Col 
								key={`stat-group-${index}`}
							>
								<Card
									size="small"
									title={group.name}
									style={{height: "100%", width: "100%"}}
								>
									{group.inputs.map((stat: any, index: number) => (
										<Form.Item
											key={`stat-${stat.slug}`}
											name={stat.slug}
											valuePropName={stat.type === "number" ? "value" : "checked"}
											label={stat.full}
										>
											{stat.type === "number" ? (
												<InputNumber
													size={"small"}
													controls={false}
													placeholder="0"
												/>
											) : (
												<Checkbox />
											)}
										</Form.Item>
									))}
								</Card>
							</Col>
						))}
					</Row>
				</Form>
			</PlayerStatsModalStyle>
		);
	}
};
