import { useGetProfileQuery } from "@/services/usersApi";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "../UI/Button/Button";
import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Col } from "../UI/Grid/Grid";
import { CheckoutFormStyle } from "./CheckoutFormStyle";

declare type PaymentResultProps = {
	clientSecret: string
	onReload: () => void
}

export const PaymentResult = (props: PaymentResultProps) => {
	const profile = useGetProfileQuery();
	const stripe = useStripe();
	const {t} = useTranslation();
	const navigate = useNavigate();
	const [code, setCode] = useState("");
	

	useEffect(() => {
		if (!props.clientSecret || !stripe) { return;}
		stripe.retrievePaymentIntent(props.clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
			case "succeeded":
				setCode("success");
				break;
			case "processing":
				setCode("processing");
				break;
			default:
				setCode("failed");
				break;
			}
		});
	}, [props.clientSecret, stripe]);

	return (
		(!profile.isLoading && code) ? (
			<CheckoutFormStyle>
				<Title level={2}>{t(`payment.${code}Title`)}</Title>
				<p>{t(`payment.${code}Description`)}</p>
				{
					(code === "success") || (code === "processing") ?
						(
							<>
								<Button
									onClick={(e: any) => navigate("/new")}
									type="primary"
									style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
									size="large"
								>
									<PlusOutlined style={{ marginRight: "10px" }} />
									{t("team.newTeam")}
								</Button>
							</>
						)
						:
						(
							<Button
								onClick={(e: any) => { navigate("/payment"); props.onReload(); }}
								type="primary"
								style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
								size="large"
							>
								<RedoOutlined style={{ marginRight: "10px" }} />
								{t("payment.tryAgain")}
							</Button>
						)
				}
			</CheckoutFormStyle>
		) : null
	);
};