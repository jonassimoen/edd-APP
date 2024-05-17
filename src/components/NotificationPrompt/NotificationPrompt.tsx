import { useEffect, useState } from "react";
import { fetchToken } from "@/firebase";
import { NotificationPromptStyle } from "./NotificationPromptStyle";
import { useTranslation } from "react-i18next";
import { BellOutlined } from "@ant-design/icons";
import { usePostTokenMutation } from "@/services/generalApi";

export const NotificationPrompt = () => {
	// const [] = useState();
	const [t] = useTranslation();
	const [isTokenFound, setTokenFound] = useState(false);
	const [requestModalOpen, setRequestModalOpen] = useState(false);
	const [pushNotif] = usePostTokenMutation();

	const onNotificationRequest = () => {
		setRequestModalOpen(false);
		if ("Notification" in window && Notification.permission !== "granted") {
			console.log("request notif");
			Notification.requestPermission().then((permission: NotificationPermission) => {
				if(permission === "granted") {
					console.log("Notifications enabled");
					fetchToken(setTokenFound, pushNotif);
				} 
			});
		}
	};

	useEffect(() => { 
		if ("Notification" in window && Notification.permission === "default")  {
			setRequestModalOpen(true);
		}
	}, []);

	return (
		<NotificationPromptStyle
			mask={true}
			title={
				<>
					<BellOutlined />
					{t("notifications.modalTitle")}
				</>
			}
			open={requestModalOpen}
			okText={(t("notifications.modalEnable"))}
			cancelButtonProps={{style: {display: "none"}}}
			onOk={onNotificationRequest}
		>
			{t("notifications.modalDescription")}
		</NotificationPromptStyle>
	);
};