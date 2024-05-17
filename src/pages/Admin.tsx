import { useAppSelector } from "@/reducers";
import { CalendarOutlined, CopyOutlined, HomeOutlined, SkinOutlined, StarOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const items: MenuProps["items"] = [
	{
		label: (<Link to={{ pathname: "" }}>Home</Link>),
		key: "admin",
		icon: <HomeOutlined />,
	},
	{
		label: (<Link to={{ pathname: "users" }}>Users</Link>),
		key: "users",
		icon: <UserSwitchOutlined />,
	},
	{
		label: (<Link to={{ pathname: "pages" }}>Pages</Link>),
		key: "pages",
		icon: <CopyOutlined />,
	},
	{
		label: (<Link to={{ pathname: "players" }}>Players</Link>),
		key: "players",
		icon: <UserOutlined />,
	},
	{
		label: (<Link to={{ pathname: "clubs" }}>Clubs</Link>),
		key: "clubs",
		icon: <SkinOutlined />,
	},
	{
		label: (<Link to={{ pathname: "games" }}>Games</Link>),
		key: "games",
		icon: <CalendarOutlined />,
	},
	{
		label: (<Link to={{ pathname: "weeks" }}>Weeks</Link>),
		key: "weeks",
		icon: <CalendarOutlined />,
	},
];


export const Admin = (props: { redirectPath: string }) => {
	const location = useLocation();
	const { t } = useTranslation();

	const user = useAppSelector((state) => state.userState.user);
	const [current, setCurrent] = useState(location.pathname.split("/").pop() || "admin");
	const onClick: MenuProps["onClick"] = (e) => {
		setCurrent(e.key);
	};

	function isAdmin(): boolean {
		if (secureLocalStorage.getItem("user") && JSON.parse(secureLocalStorage.getItem("user") as string).role === 7) {
			return true;
		}
		return false;
	}

	if (isAdmin()) {
		return  (
			<>
				{window.location.pathname.includes("localhost") && <Title color={"red"}>NOT RUNNING ON LOCALHOST</Title>}
				<Title>{t("admin.welcome", { name: user?.firstName })}</Title>
				<Menu style={{ backgroundColor: "#f2f0f4" }} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
				<Outlet />
			</>
		);
	} else {
		return <Navigate to={{ pathname: props.redirectPath }} />;
	}
};