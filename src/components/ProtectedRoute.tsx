import { useAppSelector } from "@/reducers";
import { Navigate } from "react-router-dom";

export type ProtectedRouteProps = {
	access: boolean;
	redirectPath: string;
	children: JSX.Element;
};

export default function ProtectedRoute({ access, redirectPath, children }: ProtectedRouteProps) {
	const auth = useAppSelector((state) => state.userState).authenticated;
	if ((access && auth) || (!access && !auth)) {
		return children;
	} else {
		return <Navigate to={{ pathname: redirectPath }} />;
	}
}
