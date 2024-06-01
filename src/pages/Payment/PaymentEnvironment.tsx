import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { usePaymentIntentMutation } from "@/services/usersApi";
import { CheckoutForm } from "@/components/Payment/CheckoutForm";
import { PaymentResult } from "@/components/Payment/PaymentResult";
import { theme } from "@/styles/theme";
import { useAppSelector } from "@/reducers";
import { Navigate } from "react-router-dom";
import { Block } from "@/components/Block/Block";

export const PaymentEnvironment = () => {
	const [clientSecret, setClientSecret] = useState("");
	const [showResult, setShowResult] = useState(false);
	const [isLoading, setLoading] = useState(true);

	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY);

	const [createPaymentIntent] = usePaymentIntentMutation();

	const onReload = () => {
		setLoading(true);
		if(window.location.href.includes("result")) {	
			const clientSecretURL = new URLSearchParams(window.location.search).get(
				"payment"
			);		
			if (!clientSecretURL) {
				createPaymentIntent().unwrap().then((data: any) => setClientSecret(data.clientSecret));
			} else {
				setShowResult(true);
				setClientSecret(clientSecretURL);
			}
		} else {
			setShowResult(false);
			createPaymentIntent().unwrap().then((data: any) => setClientSecret(data.clientSecret));
		}
		setLoading(false);
	};

	useEffect(() => {
		onReload();
	},[]);

	const { authenticated, user } = useAppSelector((state) => state.userState);

	const stripeOptions = useMemo(() => ({
		clientSecret,
		appearance: {
			theme: "flat",
			variables: {
				colorPrimary: theme.primaryContrast,
			},
		},
	}), [clientSecret]);
	return !isLoading && !!clientSecret && (
		<Block style={{margin: "2rem", background: theme.primaryColor, borderRadius: "1rem", padding: "3rem"}}>
			<Elements options={stripeOptions as any} stripe={stripePromise}>
				{!showResult ? <CheckoutForm /> : <PaymentResult clientSecret={clientSecret} onReload={onReload} />}
			</Elements>
		</Block>
	);
};