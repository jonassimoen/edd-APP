
import { Navigate, Outlet, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "@/components/Header/Header";
import { LoginCallback } from "./pages/LoginCallback";
import { Home } from "./pages/Home/Home";
import { NewTeam } from "./pages/NewTeam/NewTeam";
import { Admin } from "./pages/Admin";
import { PlayerManagement } from "./pages/PlayerManagement/PlayerManagement";
import { ClubManagement } from "./pages/ClubManagement/ClubManagement";
import { GameManagement } from "./pages/GameManagement/GameManagement";
import { GameStatsManagement } from "./pages/GameStatsManagement/GameStatsManagement";
import { TeamPage } from "./pages/Team/Team";
import { WeekManagement } from "./pages/WeekManagement/WeekManagement";
import { Rules } from "./pages/Rules/Rules";
import { Profile } from "./pages/Profile/Profile";
import { Deadlines } from "./pages/Deadlines/Deadlines";
import { Stats } from "./pages/Stats/Stats";
import { Footer } from "./components/Footer/Footer";
import { TransfersPage } from "./pages/Transfers/Transfers";
import { PointsPage } from "./pages/Points/Points";
import { MatchContainer } from "./pages/Match/Match";
import { PageManagement } from "./pages/PageManagement/PageManagement";
import { GeneralManagement } from "./pages/GeneralManagement/GeneralManagement";
import { Rankings } from "./pages/Rankings/Rankings";
import { EditTeam } from "./pages/EditTeam/EditTeam";
import { PageNotFound } from "./pages/PageNotFound";
import { ErrorPage } from "./pages/ErrorPage";
import { useEffect } from "react";
import * as Cronitor from "@cronitorio/cronitor-rum";
import { useTranslation } from "react-i18next";
import { PaymentResult } from "./components/Payment/PaymentResult";
import { PaymentEnvironment } from "./pages/Payment/PaymentEnvironment";
import { UserManagement } from "./pages/UserManagement/UserManagement";
import { News } from "./pages/News/News";
import { NewsArticle } from "./pages/News/NewsArticle";
import { NewsManagement } from "./pages/NewsManagement/NewsManagement";

const Layout = ({ children }: any) => {
	const location = useLocation();
	const {i18n} = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		if(location.pathname.includes("/en")) {
			i18n.changeLanguage("en");
			navigate(window.location.pathname.replace("/en",""));
		} else if(location.pathname.includes("/nl")) {
			i18n.changeLanguage("nl");
			navigate(window.location.pathname.replace("/nl",""));
		}
		Cronitor.track("Pageview");
	}, [location.pathname]);

	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [{
			errorElement: <ErrorPage />,
			children: [
				{
					path: "",
					element: <Navigate to={{ pathname: "/home" }} />,
				},
				{
					path: "home",
					element: <Home />
				},
				{
					path: "new",
					element: <ProtectedRoute access={true} redirectPath="/home"><NewTeam /></ProtectedRoute>
				},
				{
					path: "points/:id", 
					element: <ProtectedRoute access={true} redirectPath="home"><PointsPage /></ProtectedRoute>
				},
				{
					path: "public/:id", //todo
					element: <ProtectedRoute access={true} redirectPath="home"><PointsPage /></ProtectedRoute>
				},
				{
					path: "team/:id",
					element: <ProtectedRoute access={true} redirectPath="/home"><TeamPage /></ProtectedRoute>
				},
				{
					path: "transfers/:id", 
					element: <ProtectedRoute access={true} redirectPath="/home"><TransfersPage /></ProtectedRoute>
				},
				{
					path: "edit/:id",
					element: <ProtectedRoute access={true} redirectPath="/home"><EditTeam /></ProtectedRoute>
				},
				{
					path: "profile",
					element: <ProtectedRoute access={true} redirectPath="/home"><Profile /></ProtectedRoute>
				},
				{
					path: "deadlines", //todo
					element: <ProtectedRoute access={true} redirectPath="/home"><Deadlines /></ProtectedRoute>
				},
				{
					path: "stats",
					element: <ProtectedRoute access={true} redirectPath="/home"><Stats /></ProtectedRoute>
				},
				{
					path: "match/:id", 
					element: <ProtectedRoute access={true} redirectPath="/home"><MatchContainer /></ProtectedRoute>
				},
				{
					path: "payment/*",
					element: <ProtectedRoute access={true} redirectPath="/home"><PaymentEnvironment /></ProtectedRoute>,
				},
				{
					path: "news",
					element: <News />,
				},
				{
					path: "news/*",
					element: <NewsArticle />,
				},
				{
					path: "rankings",
					element: <Rankings />
				},
				{
					path: "rules", 
					element: <Rules />,
				},
				{
					path: "admin",
					element: <ProtectedRoute access={true} redirectPath='/home'><Admin redirectPath='/home' /></ProtectedRoute>,
					children: [
						{
							path: "",
							element: <GeneralManagement />
						},
						{
							path: "users",
							element: <UserManagement />
						},
						{
							path: "pages",
							element: <PageManagement />
						},
						{
							path: "news",
							element: <NewsManagement />
						},
						{
							path: "players",
							element: <PlayerManagement />
						},
						{
							path: "clubs",
							element: <ClubManagement />
						},
						{
							path: "games",
							element: <GameManagement />
						},
						{
							path: "weeks",
							element: <WeekManagement />
						},
						{
							path: "games/events/:id",
							element: <GameStatsManagement />
						}
					]
				},
				{
					path: "login/callback",
					element: <LoginCallback />,
				},
				{
					path: "*",
					element: <Home />
				}
			]
		}
		]
	}
]);