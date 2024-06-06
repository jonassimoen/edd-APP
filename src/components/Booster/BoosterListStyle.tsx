import { theme } from "@/styles/theme";
import styled from "styled-components";

export const BoosterListStyle = styled.div`
	background: ${theme.primaryContrast};
	border-radius: 1rem;
	border: 1px solid rgba(255 255 255 / 0.15);

	h4 {
		margin: 0.5rem 0;
		text-align:center;
		color:white;
	}

	.ant-row {
		margin: 0.5rem 0;
	}
`;