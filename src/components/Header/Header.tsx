import { defaultUser, useAuth } from "@/lib/stores/AuthContext";
import { useGetProfileQuery, useGetTeamsQuery } from "@/services/usersApi";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "../UI/Layout/Layout";
import { Hamburger, HeaderStyle } from "./HeaderStyle";
import secureLocalStorage from "react-secure-storage";
import { useAppSelector } from "@/reducers";
import { logout } from "@/features/userSlice";

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
	const { data: teams } = useGetTeamsQuery();
	const dispatch = useDispatch();
	// const { user, setUser, authenticated, setAuthenticated } = useAuth();
	// const { user, teams, authenticated, logout } = useContext(UserContext);
	const [userTeam, setUserTeam] = useState<Team>();

	const [state, setState] = useState({
		windowWidth: window.innerWidth,
		menuToggled: false,
		pageTitle: "",
		showTeams: false,
	});

	const { t, i18n } = useTranslation();
	// const gameInProgress = !!matches.info.deadlineWeek;


	const allMenuItems: string[] = ["home", "stats", "rules", "rankings"];
	const isVisible = (menuItem: string) => allMenuItems.indexOf(menuItem) !== -1;
	const isActive = (match: string) => location.pathname.indexOf(match) !== -1;

	useEffect(() => {
		if (teams) {
			setUserTeam(teams.teams[0]);
		}
	}, [teams]);

	if (user) {
		allMenuItems.push("logout");
	}

	if (user && user.role === 7) {
		allMenuItems.push("admin");
	}
	const openSubMenu = (ev: any) => {
		setState({ ...state, menuToggled: !state.menuToggled });
	};

	const insertToMenuAtPosition = (positionIndex: number, item: string) => {
		if (allMenuItems.indexOf(item) === -1) {
			allMenuItems.splice(positionIndex, 0, item);
		}
	};

	if (authenticated && !userTeam) {
		insertToMenuAtPosition(1, "new");
	}

	if (user && userTeam) {
		insertToMenuAtPosition(2, "team");
	}
	const onLogout = (e: any) => {
		secureLocalStorage.removeItem("token");
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
										{(userTeam &&
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
										{(!userTeam && isVisible("new") &&
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
											<li className={`c-nav-main__item ${(isActive("rules")) ? "is-selected" : ""}`}>
												<Link className="c-nav-main__link" to="/rules">{t("menu.rules")}</Link>
											</li>
										) || null
										}
										{(isVisible("admin") &&
											<li className={`c-nav-main__item ${(isActive("admin")) ? "is-selected" : ""}`}>
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
								<Hamburger><a className="c-nav-trigger" onClick={openSubMenu}><span className="is-hidden">Menu</span><span className="c-nav-trigger__top" style={{ backgroundColor: "#00FAFA" }}></span><span className="c-nav-trigger__middle" style={{ backgroundColor: "#00FAFA" }}></span><span className="c-nav-trigger__bottom" style={{ backgroundColor: "#00FAFA" }}></span></a></Hamburger>

							</div>
						</Layout>
					</div>
				</div>
				<nav className="c-nav-mobile js-nav-mobile">
					<div className="c-nav-mobile__main">
						<ul className="o-list c-nav-mobile__list">
							{((userTeam && isVisible("points")) &&
								<li className={`c-nav-mobile__item ${isActive("points") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to="/points">{t("menu.points")}</Link></li>) || null}

							{(userTeam && isVisible("team") &&
								<li className={`c-nav-mobile__item ${isActive("team") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/team/${userTeam.id}`}>{t("menu.team")}</Link></li>) || null}

							{(userTeam && isVisible("edit") &&
								<li className={`c-nav-mobile__item ${isActive("edit") ? "active" : ""}`}>
									<Link className="c-nav-mobile__link" onClick={openSubMenu} to={`/edit/${userTeam.id}`}>{t("menu.transfers")}</Link>
								</li>) || null}

							{(!userTeam && isVisible("new") &&
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

							{/* </li>) || null} */}

						</ul>
					</div>
				</nav>

				{/* 
			<Flex
				className="header_inner"
				justify={"space-between"}
				align={"center"}
				p="md"
				mb="xl"
				bg={"primaryContrast.0"}
			>
				<Group>
					<Link to="/home">
						<h1 className="logo" style={{ backgroundImage: "url('/logo_fantasy.svg')" }}>Fantasy team</h1>
					</Link>
				</Group>
				<MediaQuery smallerThan="md" styles={{ display: "none" }}>
					<Group spacing={"lg"} className="header_inner_nav">
						{(userTeam &&
							<Link className={`nav_item ${(isActive('team')) ? 'is-selected' : ' '}`} to={`/team/${userTeam.id}`}>
								{t("menu.team")}
							</Link>
						)}
						{(!userTeam && isVisible("new") &&
							<Link className={`nav_item ${(isActive('new')) ? 'is-selected' : ' '}`} to={"/new"}>
								{t("menu.newTeam")}
							</Link>
						)}
						{(isVisible("stats") &&
							<Link className={`nav_item ${(isActive('stats')) ? 'is-selected' : ' '}`} to={"/stats"}>
								{t("menu.stats")}
							</Link>
						)}
						{(isVisible("rankings") &&
							<Link className={`nav_item ${(isActive('ranking')) ? 'is-selected' : ' '}`} to={"/rankings"}>
								{t("menu.rankings")}
							</Link>
						)}
						{(isVisible("rules") &&
							<Link className={`nav_item ${(isActive('rules')) ? 'is-selected' : ' '}`} to={"/rules"}>
								{t("menu.rules")}
							</Link>
						)}
						{(isVisible("admin") &&
							<Link className={`nav_item ${(isActive('admin')) ? 'is-selected' : ' '}`} to={"/admin"}>
								{t("menu.admin")}
							</Link>
						)}
					</Group>
				</MediaQuery>
				<MediaQuery largerThan="md" styles={{ display: "none" }}>
					<Burger opened={opened} onClick={toggle} size="sm" color="white" />
				</MediaQuery>

				<Transition transition="slide-left" duration={200} mounted={opened}>
					{styles => (
						<Paper
							className="header_mobile_inner"
							style={{
								...styles,
								position: "absolute",
								top: "4rem",
								left: 0,
								right: 0,
								zIndex: 2,
								height: '100vh',
								textAlign: 'center',
								fontSize: '16px'
							}}
							radius="none"
							onClick={close}
						>
							<Stack justify="flex-start" align="stretch" spacing="none" className="header_mobile_inner_nav">

								{(userTeam &&
									<Link className={`nav_item ${(isActive('team')) ? 'is-selected' : ' '}`} to={`/team/${userTeam.id}`}>
										{t("menu.team")}
									</Link>
								)}
								{(!userTeam && isVisible("new") &&
									<Link className={`nav_item ${(isActive('new')) ? 'is-selected' : ' '}`} to={"/new"}>
										{t("menu.newTeam")}
									</Link>
								)}
								{(isVisible("stats") &&
									<Link className={`nav_item ${(isActive('stats')) ? 'is-selected' : ' '}`} to={"/stats"}>
										{t("menu.stats")}
									</Link>
								)}
								{(isVisible("rankings") &&
									<Link className={`nav_item ${(isActive('ranking')) ? 'is-selected' : ' '}`} to={"/rankings"}>
										{t("menu.rankings")}
									</Link>
								)}
								{(isVisible("rules") &&
									<Link className={`nav_item ${(isActive('rules')) ? 'is-selected' : ' '}`} to={"/rules"}>
										{t("menu.rules")}
									</Link>
								)}
								{(isVisible("admin") &&
									<Link className={`nav_item ${(isActive('admin')) ? 'is-selected' : ' '}`} to={"/admin"}>
										{t("menu.admin")}
									</Link>
								)}
							</Stack>
						</Paper>
					)}
				</Transition>
			</Flex> */}

				{/* </Layout> */}
			</HeaderStyle >
			<Layout>
				<Outlet />
			</Layout>
		</>
	);
};