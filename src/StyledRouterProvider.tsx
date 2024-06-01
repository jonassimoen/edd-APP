import { RouterProvider } from "react-router-dom";
import styled from "./styles/styled-components";
import pitchBg from "./assets/img/pitch-xl.png";

export const StyledRouterProvider = styled(RouterProvider)`
	background: linear-gradient(0deg, rgba(20, 60, 219, 0.8), rgba(20, 60, 219, 1)), url(${pitchBg});
	background-size: cover;
	background-position:center;
	background-repeat: no-repeat;
	background-color: $primaryColor;
	background-attachment: fixed;
`;