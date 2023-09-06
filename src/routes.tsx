
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "@/components/Header/Header";
import { Login } from "@/pages/Login";
import { LoginCallback } from "./pages/LoginCallback";
import secureLocalStorage from "react-secure-storage";
import { Home } from "./pages/Home/Home";
import { NewTeam } from "./pages/NewTeam/NewTeam";
import { Admin } from "./pages/Admin";
import { PlayerManagement } from "./pages/PlayerManagement/PlayerManagement";
import { ClubManagement } from "./pages/ClubManagement/ClubManagement";
import { GameManagement } from "./pages/GameManagement/GameManagement";
import { GameCenterManagement } from "./pages/GameCenterManagement/GameCenterManagement";
import { GameStatsManagement } from "./pages/GameStatsManagement/GameStatsManagement";
import { TeamPage } from "./pages/Team/Team";
import { WeekManagement } from "./pages/WeekManagement/WeekManagement";
import { Rules } from "./pages/Rules/Rules";
import { Profile } from "./pages/Profile/Profile";
import { Deadlines } from "./pages/Deadlines/Deadlines";
import { Stats } from "./pages/Stats/Stats";
import { Footer } from "./components/Footer/Footer";

const Layout = ({children}: any) => {
	return (
		<>
		  <Header />
		  {children}
		  <Footer />
		</>
	);
  }

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Navigate to={{pathname: "/home"}} />,
			},
			{
				path: "/home",
				element: <Home />
			},
			{
				path: "/new",
				element: <ProtectedRoute access={true} redirectPath="/home"><NewTeam /></ProtectedRoute>
			},
			{
				path: "/points/:id", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/public/:id", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/team/:id",
				element: <ProtectedRoute access={true} redirectPath="/home"><TeamPage /></ProtectedRoute>
			},
			{
				path: "/transfers/:id", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/edit/:id", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/profile",
				element: <ProtectedRoute access={true} redirectPath="/home"><Profile /></ProtectedRoute>
			},
			{
				path: "/deadlines", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Deadlines /></ProtectedRoute>
			},
			{
				path: "/stats", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Stats /></ProtectedRoute>
			},
			{
				path: "/match/:id", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/rankings", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Home /></ProtectedRoute>
			},
			{
				path: "/rules", //todo
				element: <ProtectedRoute access={true} redirectPath="/home"><Rules /></ProtectedRoute>
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/admin",
				element: <ProtectedRoute access={true} redirectPath='/home'><Admin redirectPath='/home' /></ProtectedRoute>,
				children: [
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
				path: "/plrmngmnt",
				element: <ProtectedRoute access={true} redirectPath='/home'><PlayerManagement /></ProtectedRoute>,
			},
			{
				path: "/login/callback",
				element:
					<LoginCallback />,
			},
		]
	}
]);