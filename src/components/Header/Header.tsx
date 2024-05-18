import { defaultUser, useAuth } from "@/lib/stores/AuthContext";
import { useGetProfileQuery, useGetTeamsQuery, useLazyGetProfileQuery, useLogoutMutation } from "@/services/usersApi";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "../UI/Layout/Layout";
import { Hamburger, HeaderStyle } from "./HeaderStyle";
import secureLocalStorage from "react-secure-storage";
import { useAppSelector } from "@/reducers";
import { logout } from "@/features/userSlice";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import { theme } from "@/styles/theme";
import { Crisp } from "crisp-sdk-web";
import { Alert } from "../UI/Alert/Alert";
import parseHTML from "html-react-parser";

export const staticPagesTitleMap: { [key: string]: string } = {
	"/stats": "STATS",
	"/rankings": "KLASSEMENT",
	"/home": "HOME",
	"/login": "LOGIN",
	"/register": "REGISTER",
	"/rules": "SPELREGELS",
	"/deadlines": "WEDSTRIJDEN",
	"/new": "NIEUW TEAM",
	"/profile": "MIJN PROFIEL",
};


export const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { authenticated, user } = useAppSelector((state) => state.userState);
	const [logoutRequest] = useLogoutMutation();
	const { data: teams } = useGetTeamsQuery();
	const dispatch = useDispatch();
	useGetProfileQuery();
	const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
	const [userTeam, setUserTeam] = useState<Team>();
	const [teamVerification, setTeamVerification] = useState(false);


	const [state, setState] = useState({
		windowWidth: window.innerWidth,
		menuToggled: false,
		pageTitle: "",
		showTeams: false,
	});

	const { t, i18n } = useTranslation();
	const application = useSelector((state: StoreState) => state.application);
	const allMenuItems: string[] = ["home", "stats", "rules", "rankings"];
	const isVisible = (menuItem: string) => allMenuItems.indexOf(menuItem) !== -1;
	const isActive = (match: string) => location.pathname.indexOf(match) !== -1;
	const gameInProgress = useMemo(() => deadlineInfoSuccess && !!deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const gameEnded = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek == 0, [deadlineInfo]);
	const showPoints = useMemo(() => userTeam && deadlineInfoSuccess && (gameEnded || (gameInProgress && (deadlineInfo.deadlineInfo.deadlineWeek > userTeam.weekId))), [userTeam, gameEnded, gameInProgress, deadlineInfo]);
	const showTransfers = useMemo(() => userTeam && deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek && (deadlineInfo.deadlineInfo.deadlineWeek > userTeam.weekId) && deadlineInfo.deadlineInfo.deadlineWeek > application.competition.officialStartWeek, [userTeam, deadlineInfo]);
	const userHasPayed = useMemo(() => (user && user.payed) || !authenticated, [user, authenticated]);
	const wildCardOrFreeHitEnabled = useMemo(() => deadlineInfo?.deadlineInfo?.deadlineWeek && userTeam && (deadlineInfo?.deadlineInfo.deadlineWeek === userTeam.freeHit), [userTeam, deadlineInfo]);

	const insertToMenuAtPosition = (positionIndex: number, item: string) => {
		if (allMenuItems.indexOf(item) === -1)
			allMenuItems.splice(positionIndex, 0, item);
	};

	useEffect(() => {
		if (teams) {
			setUserTeam(teams.teams[0]);
			setTeamVerification(true);
		}
	}, [teams]);

	if (user) {
		allMenuItems.push("logout");

		if (user.role === 7) {
			allMenuItems.push("admin");
		}
		if(!userHasPayed) {
			allMenuItems.push("pay");
		}
		
		Crisp.user.setEmail(user.email);
		Crisp.user.setNickname(user.firstName);
	}

	if (user && showPoints) {
		insertToMenuAtPosition(1, "points");
	} else if (authenticated && !userTeam) {
		insertToMenuAtPosition(1, "new");
	}

	if (user && userTeam && gameInProgress) {
		if (showPoints) {
			insertToMenuAtPosition(2, "team");
		} else {
			insertToMenuAtPosition(1, "team");
		}
	}

	if (authenticated && userTeam && !showTransfers && gameInProgress) {
		if (showTransfers) {
			insertToMenuAtPosition(3, "edit");
		} else {
			insertToMenuAtPosition(2, "edit");
		}
	}

	if (wildCardOrFreeHitEnabled) {
		insertToMenuAtPosition(3, "edit");
	}

	if (authenticated && showTransfers && gameInProgress && !wildCardOrFreeHitEnabled) {
		if (showTransfers) {
			insertToMenuAtPosition(4, "transfers");
		} else {
			insertToMenuAtPosition(3, "transfers");
		}
	}

	const openSubMenu = (ev: any) => {
		setState({ ...state, menuToggled: !state.menuToggled });
	};
	const onLogout = (e: any) => {
		logoutRequest();
		secureLocalStorage.removeItem("user");

		dispatch(logout);
		window.location.reload();
	};


	return (
		<>
			<HeaderStyle className={state.menuToggled ? "has-open-nav" : ""}>
				<div className="js-nav-holder c-header">
					<div className="c-header__nav">
						<Layout>
							<div className="c-header__nav-inner">
								<Link to="/"><h1 className="c-logo" style={{ backgroundImage: "url('/euro_DD_HOR.png')" }}>Fantasy League</h1></Link>
								<nav className="c-nav-main js-nav" role="navigation">
									<ul className="c-nav-main__list">
										{(isVisible("pay") && 
											<li className={`c-nav_item ${(isActive("payment")) ? "is-selected" : " "}`}>
												<Link
													className="c-nav-main__link"
													to={"payment"}
												>
													{t("menu.payment")}
												</Link>
											</li>
										) || null
										}
										{(userTeam && isVisible("team") && 
											<li className={`c-nav_item ${(isActive("team")) ? "is-selected" : " "}`}>
												<Link
													className="c-nav-main__link"
													to={`/team/${userTeam.id}`}
												>
													{t("menu.team")}
												</Link>
											</li>
										) || null
										}
										{(teamVerification && !userTeam && isVisible("new") &&
											<li className={`c-nav-main__item ${(isActive("new")) ? "is-selected" : ""}`}>
												<Link
													className="c-nav-main__link"
													to={"/new"}
												>
													{t("menu.newTeam")}
												</Link>
											</li>
										) || null
										}
										{(isVisible("stats") &&
											<li className={`c-nav-main__item ${(isActive("stats")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" to="/stats">{t("menu.stats")}</Link>
											</li>
										) || null
										}
										{(isVisible("rankings") &&
											<li className={`c-nav-main__item ${(isActive("rankings")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" to="/rankings">{t("menu.rankings")}</Link>
											</li>
										) || null
										}
										{(isVisible("rules") &&
											<li className={`c-nav-main__item${(isActive("rules")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" to="/rules">{t("menu.rules")}</Link>
											</li>
										) || null
										}
										{(isVisible("admin") &&
											<li className={`c-nav-main__item${(isActive("admin")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" to="/admin">{t("menu.admin")}</Link>
											</li>
										) || null
										}
										{(isVisible("logout") &&
											<li className={`c-nav-main__item ${(isActive("logout")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" onClick={onLogout} to="/home">{t("menu.logout")}</Link>
											</li>
										) || null
										}
									</ul>
								</nav>
								<Hamburger><a className="c-nav-trigger" onClick={openSubMenu}><span className="is-hidden">Menu</span><span className="c-nav-trigger__top" style={{ backgroundColor: theme.primaryColor }}></span><span className="c-nav-trigger__middle" style={{ backgroundColor: theme.primaryColor }}></span><span className="c-nav-trigger__bottom" style={{ backgroundColor: theme.primaryColor }}></span></a></Hamburger>

							</div>
						</Layout>
					</div>
				</div>
				{(isVisible("team") || isVisible("points")) &&
					<div className="c-row c-row--sm c-row--alpha" style={{ marginBottom: "15px" }}>
						<Layout>
							<ul className="o-list c-nav-tabs">
								{(isVisible("points") &&
									<li className={`c-nav-tabs__item ${(isActive("points")) ? "is-selected" : ""}`}>
										<Link className="c-nav-tabs__link" to={`/points/${userTeam.id}`}>{t("menu.points")}</Link>
									</li>
								) || null}
								{(isVisible("team") &&
									<li className={`c-nav-tabs__item ${(isActive("team")) ? "is-selected" : ""}`}>
										<Link className="c-nav-tabs__link" to={`/team/${userTeam.id}`}>{t("menu.team")}</Link>
									</li>
								) || null}
								{(isVisible("edit") &&
									<li className={`c-nav-tabs__item ${(isActive("edit")) ? "is-selected" : ""}`}>
										<Link className="c-nav-tabs__link" to={`/edit/${userTeam.id}`}>{t("menu.edit")}</Link>
									</li>
								) || null}
								{(isVisible("transfers") &&
									<li className={`c-nav-tabs__item ${(isActive("transfers")) ? "is-selected" : ""}`}>
										<Link className="c-nav-tabs__link" to={`/transfers/${userTeam.id}`}>{t("menu.transfers")}</Link>
									</li>
								) || null}
							</ul>
						</Layout>
					</div>
				}
				<nav className="c-nav-mobile js-nav-mobile">
					<div className="c-nav-mobile__main">
						<ul className="o-list c-nav-mobile__list">
							{((userTeam && isVisible("pay")) &&
								<li className={`c-nav-mobile__item ${isActive("payment") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={"payment"}>{t("menu.payment")}</Link></li>) || null}

							{((userTeam && isVisible("points")) &&
								<li className={`c-nav-mobile__item ${isActive("points") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/points/${userTeam.id}`}>{t("menu.points")}</Link></li>) || null}

							{(userTeam && isVisible("team") &&
								<li className={`c-nav-mobile__item ${isActive("team") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/team/${userTeam.id}`}>{t("menu.team")}</Link></li>) || null}

							{(userTeam && isVisible("edit") &&
								<li className={`c-nav-mobile__item ${isActive("edit") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/edit/${userTeam.id}`}>{t("menu.edit")}</Link>
								</li>) || null}

							{(teamVerification && !userTeam && isVisible("new") &&
								<li className={`c-nav-mobile__item ${isActive("new") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/new">{t("menu.newTeam")}</Link></li>) || null
							}

							{(userTeam && isVisible("transfers") &&
								<li className={`c-nav-mobile__item ${isActive("transfers") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/transfers/${userTeam.id}`}>{t("menu.transfers")}</Link>
								</li>) || null}

							{(isVisible("leagues") &&
								<li className={`c-nav-mobile__item ${isActive("leagues") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/leagues">{t("menu.minicompetition")}</Link></li>) || null}

							{(isVisible("stats") &&
								<li className={`c-nav-mobile__item ${isActive("stats") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/stats">{t("menu.stats")}</Link></li>) || null}

							{(isVisible("rankings") &&
								<li className={`c-nav-mobile__item ${isActive("rankings") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/rankings">{t("menu.rankings")}</Link></li>) || null}

							{(isVisible("rules") &&
								<li className={`c-nav-mobile__item ${isActive("rules") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/rules">{t("menu.rules")}</Link>
								</li>) || null}


							{(isVisible("admin") &&
								<li className={`c-nav-mobile__item ${(isActive("admin")) ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/admin">{t("menu.admin")}</Link>
								</li>) || null}

							{(isVisible("logout") &&
								<li className={`c-nav-mobile__item ${isActive("logout") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={onLogout} to="/home">{t("menu.logout")}</Link>
								</li>) || null}
						</ul>
					</div>
				</nav>
			</HeaderStyle >
			<Layout>
				{
					(!userHasPayed && !window.location.href.includes("payment")) ? 
						<Alert
							description={parseHTML(t("general.notPayed"))}
							type="warning"
							className="warning-not-payed"
							showIcon
						/> 
						: null
				}
				<Outlet />
			</Layout>
		</>
	);
};