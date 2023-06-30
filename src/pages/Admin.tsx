import { useAuth } from "@/lib/stores/AuthContext";
import { useAppSelector } from "@/reducers";
import { CalendarOutlined, HomeOutlined, SkinOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
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
	{
		label: (<Link to={{ pathname: "points" }}>Points</Link>),
		key: "points",
		icon: <StarOutlined />,
	},
];


export const Admin = (props: { redirectPath: string }) => {
	const location = useLocation();
    
	const user = useAppSelector((state) => state.userState.user);
    
	const { t } = useTranslation();
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
		return (
			<>
				<Title>{t("admin.welcome", { name: user?.firstName })}</Title>
				<Menu style={{backgroundColor: "#f2f0f4"}} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
				<Outlet />
			</>
		);
	} else {
		return <Navigate to={{ pathname: props.redirectPath }} />;
	}
};