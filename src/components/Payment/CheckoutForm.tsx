import config from "@/config";
import { openErrorNotification } from "@/lib/helpers";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Col, Row } from "../UI/Grid/Grid";
import { Button } from "../UI/Button/Button";
import { EuroOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const {t} = useTranslation();

	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
	
		if (!stripe || !elements) {
			return;
		}
	
		setIsLoading(true);
	
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${config.API_URL}/user/payment-result`,
			},
		});
		if (error.type === "card_error" || error.type === "validation_error") {
			openErrorNotification({title: "Something went wrong...", message: error.message});
		} else {
			openErrorNotification({title: "Something went wrong...", message: "An unexpected error occurred"});
		}
	
		setIsLoading(false);
	};
	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<Row>
				<Col md={8}>
					<PaymentElement id="payment-element" options={{layout: "tabs"}} />
					<Button
						type="primary"
						onClick={handleSubmit}
						id="submit"
						disabled={isLoading || !stripe || !elements}
						loading={isLoading}
						style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
						size="large"
					>
						<EuroOutlined style={{ marginRight: "10px" }} />
						{t("payment.payNow")}
					</Button>
				</Col>
			</Row>
		</form>
	);
};