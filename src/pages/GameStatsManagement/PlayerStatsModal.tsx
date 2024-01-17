import { Checkbox } from "@/components/UI/Checkbox/Checkbox";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { Col, Row } from "@/components/UI/Grid/Grid";
import config from "@/config";
import { Form, FormInstance, Modal } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

type PlayerStatsModalProps = {
  open: boolean;
  playerStats: any;
  onConfirm: (playerStat: any) => void;
  onCancel: () => void;
};

export const PlayerStatsModal = (props: PlayerStatsModalProps) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.open && form) {
			form.setFieldsValue(props.playerStats);
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
			<Modal
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
				<Form
					onKeyUp={keyUpHandler}
					colon={false}
					form={form}
					layout="horizontal"
					name={"modal_form_change_stats"}
				>
					{config.STATISTICS.map((group: any[], index: number) => (
						<Row key={`playerstats-modal-row-${index}`}>
							{group.map((stat: any, index: number) => (
								<Col key={`player_${stat.slug}`} md={6}>
									<Form.Item
										labelCol={{ span: 16 }}
										wrapperCol={{ span: 20 }}
										name={stat.slug}
										valuePropName={stat.type === "number" ? "value" : "checked"}
										label={stat.full}
									>
										{stat.type === "number" ? (
											<InputNumber
												size={"small"}
												controls={false}
											/>
										) : (
											<Checkbox />
										)}
									</Form.Item>
								</Col>
							))}
						</Row>
					))}
				</Form>
			</Modal>
		);
	}
};
