import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Link } from "react-router-dom";

export const NewsArticleStyle = styled.div`
	margin-top: 1rem;

	.ant-card {
		margin-top: 1rem;
	}
`;

export const BackOverview = styled(Link)`
	color: ${theme.primaryContrast};
`;