import { useState } from "react";
import { PWAPromptStyle } from "./PWAPromptStyle";
import { HomeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Steps } from "antd";
import parseHTML from "html-react-parser";

// let isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

export const PWAPrompt = () => {
	const [t] = useTranslation();
	const [addToHomeOpen, setAddToHomeOpen] = useState(
		/iPad|iPhone|iPod/.test(navigator.platform) && !(navigator as any).standalone
	);

	return (
		<PWAPromptStyle
			mask={true}
			title={
				<>
					<HomeOutlined />
					{t("promptPWA.modalTitle")}
				</>
			}
			open={addToHomeOpen}
			okButtonProps={{style: {display: "none"}}}
			cancelButtonProps={{style: {display: "none"}}}
		>
			<>
				<p className="description">Om notificaties te kunnen inschakelen en een vlotte toegang tot de app te verzekeren is het noodzakelijk dat je deze app toevoegt aan je startscherm.</p>
				<Steps
					direction="vertical"
					size="small"
					items={[
						{ 
							title: parseHTML(t("promptPWA.step1")),
							status: "process",
						},
						{
							title: parseHTML(t("promptPWA.step2")),
							status: "process",
						},
						{
							title: parseHTML(t("promptPWA.step3")),
							status: "process",
						},
					]}
				/>
			</>
		</PWAPromptStyle>
	);
};