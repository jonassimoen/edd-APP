import { Button, Result } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
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
			extra={
				<Button
					type="primary"
					key="console"
					onClick={() => setShowError(!showError)}
				>
					{t("pageError.view")}
				</Button>
			}
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
