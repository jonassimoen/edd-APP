import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const TeamBoosterStyle = styled.div`
	text-align: center;
	font-size: 16px;
	padding: 1rem 0.25rem;

	p {
		padding: 0.75rem;
	}

	.ant-btn-primary {
		&:disabled {
			background-color: transparent;
			color: ${theme.primaryContrast};
		}
		&.activeBooster {
			background-color: ${theme.primaryColor};
			color: ${theme.primaryContrast};
		}
	}
`;