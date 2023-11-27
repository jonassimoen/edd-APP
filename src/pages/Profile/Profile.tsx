import { TableStyle } from "@/components/PlayerList/PlayerListStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { useAuth } from "@/lib/stores/AuthContext";
import { useAppSelector } from "@/reducers";
import { Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useMemo } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export const Profile = () => {
	const user = useAppSelector((state) => state.userState.user);
	const { t } = useTranslation();
	return (
		<React.Fragment >
			<Row>
				<Col xl={12} md={16} sm={24}>
					<Title level={2}>Uw gegevens</Title>
					<p>Op onze servers wordt de data van je Google-account gebruikt. <br />
												Hierdoor is het niet mogelijk om hier je gegevens aan te passen, dat moet via Google gebeuren.</p>

					<Title level={5}>Opgeslagen gegevens:</Title>
					<TableStyle
						dataSource={[
							{
								property: t("profile.mail"),
								value: user.email,
							},
							{
								property: t("profile.firstname"),
								value: user.firstName,
							},
							{
								property: t("profile.lastname"),
								value: user.lastName,
							},
						]}
						columns={[
							{
								dataIndex: "property",
								render: (prop: string, record: any) => {
									return (<b>{prop}</b>);
								}
							},
							{
								dataIndex: "value",
							}
						]}
						pagination={false}
						rowKey={(record: any) => `record-${record.property}`}
					/>
				</Col>
			</Row>
		</React.Fragment >
	);
};