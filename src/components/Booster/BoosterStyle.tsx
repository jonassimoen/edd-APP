import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const BoosterStyle = styled.div`
	text-align: center;
	font-size: 16px;
	padding: 1rem 0.25rem;

	.booster-type {
		height: 3rem;
		@media ${mediaQueries.desktop} {
			height: 4rem;
		}
	}
	
	.booster-icon {
		vertical-align: middle;
		height: 6rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.booster-player {
		display: flex;
		flex-direction: column;

		p.player-name {
			padding: 5px 10px;
			margin-top: -20px;
			z-index: 1;
			background-color: ${theme.primaryContrast};
			color: #fff;
			font-size: 12px;
		}
	}

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