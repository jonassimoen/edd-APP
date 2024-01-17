import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export const PageNotFound = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<Result
			status="warning"
			title={t("pageNotFound.title")}
			extra={
				<Button type="primary" key="console" onClick={() => navigate("/home")}>
					{t("pageNotFound.goBack")}
				</Button>
			}
		/>
	);
};