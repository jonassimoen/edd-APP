import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { Divider, Form, Modal } from "antd";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";

type ScoreStatsProps = {
	open: boolean;
	numberGoalsHome: number;
	numberGoalsAway: number;
	goalMinutes: {
		home: number[];
		away: number[];
	},
	onConfirm: (goalMinutes: {
		home: number[];
		away: number[];
	}) => void;
	onCancel: () => void;
}

export const ScoreStatsModal = (props: ScoreStatsProps) => {
	const [formH] = Form.useForm();
	const [formA] = Form.useForm();
	const { t } = useTranslation();

	const keyUpHandler = (event: any) => {
		// enter
		if(event.keyCode === 13) {
			Promise.all([formH.validateFields(), formA.validateFields()])
				.then(([home, away]: {[key: string]: number}[]) => props.onConfirm({home: Object.values(home), away: Object.values(away)}));
		}
	};
	
	if(props.goalMinutes) {
		return (
			<Modal
				open={props.open}
				title={"Wijzig goal minuten"}
				okText={t("editBtn")}
				cancelText={t("cancelBtn")}
				onOk={() => Promise
					.all([formH.validateFields(), formA.validateFields()])
					.then(([home, away]: {[key: string]: number}[]) => props.onConfirm({home: Object.values(home), away: Object.values(away)}))
				}
				onCancel={props.onCancel}
			>
				<Form
					onKeyUp={keyUpHandler}
					colon={false}
					form={formH}
					layout="vertical"
					name={"modal_form_home_goals"}
				>
					<Row>
						<Col>
							<p>Home</p>
						</Col>
						{props.numberGoalsHome 
							? (new Array<number>(props.numberGoalsHome).fill(0).map((_: any, index: number) => (
								<Col key={`goal-home-${index}`}>
									<Form.Item
										name={`goal-home-${index}`}
										label={`Goal ${index + 1}`}
										initialValue={props.goalMinutes.home[index]}
									>
										<InputNumber size={"small"} controls={false} />
									</Form.Item>
								</Col>
							)))
							: (<Col>Geen doelpunten.</Col>)}
					</Row>
				</Form>
				<Divider />
				<Form
					onKeyUp={keyUpHandler}
					colon={false}
					form={formA}
					layout="vertical"
					name={"modal_form_away_goals"}
				>
					<Row>
						<Col>
							<p>Away</p>
						</Col>
						{props.numberGoalsAway
							? (new Array<number>(props.numberGoalsAway).fill(0).map((_: any, index: number) => (
								<Col key={`goal-away-${index}`}>
									<Form.Item
										name={`goal-away-${index}`}
										label={`Goal ${index + 1}`}
										initialValue={props.goalMinutes.away[index]}
									>
										<InputNumber size={"small"} controls={false} />
									</Form.Item>
								</Col>
							)))
							: (<Col>Geen doelpunten.</Col>)}
					</Row>
				</Form>
			</Modal>
		);
	}
};