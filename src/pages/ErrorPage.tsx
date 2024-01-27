import { Button, Result } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import { Crisp } from "crisp-sdk-web";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router";

export const ErrorPage = () => {
	const error = useRouteError();
	const { t } = useTranslation();
	const [showError, setShowError] = useState(false);

	return (
		<Result
			status="warning"
			title={t("pageError.title")}
			subTitle={t("pageError.subtitle")}
			extra={[
				<Button
					type="primary"
					key="show"
					onClick={() => setShowError(!showError)}
				>
					{t("pageError.view")}
				</Button>,
				<Button
					type="primary"
					key="message"
					onClick={() => {
						if(!Crisp.chat.isChatOpened()) {
							Crisp.chat.open();
						}
						Crisp.message.sendText(t("pageError.message"));
						Crisp.message.sendText(`${(error as Error).name}: ${(error as Error).message}: ${(error as Error).stack}`);
						Crisp.message.showText(t("errorPage.processing"));
					}}
				>
					{t("pageError.contactAdmin")}
				</Button>
			]}
		>
			{showError && (
				<div>
					<Paragraph>
						<Text
							strong
							style={{
								fontSize: 16,
							}}
						>
							{(error as Error).name}: {(error as Error).message}
						</Text>
					</Paragraph>
					<p>{(error as Error).stack}</p>
				</div>
			)}
		</Result>
	);
};
