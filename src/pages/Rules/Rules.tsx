import { Col, Row } from "@/components/UI/Grid/Grid";
import Title from "antd/es/typography/Title";
import { t } from "i18next";

type RulesProps = {
	// todo
}

export const Rules = (props: RulesProps) => {
	return (
		<Row>
			<Col span={24}>
				<Title level={2}>{t("general.rules")}</Title>
								
			</Col>
		</Row>
	);
};