
import Title from "antd/lib/typography/Title";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export const Denied = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();

	const reason = searchParams.get("reason");
	
	return <>
		{
			reason === "banned" && <Title level={2}>Dit account werd geweigerd.</Title>
		}
		{
			reason === "registrations-disabled" && <Title level={2}>Registreren is niet meer mogelijk</Title>
		}
	</>;
};