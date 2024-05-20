import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const BoosterStyle = styled.div`
	text-align: center;
	font-size: 16px;
	padding: 1rem 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

	.booster-type {
		// font-size: 12px;
		// height: 1rem;
		// @media ${mediaQueries.desktop} {
		// 	height: 2rem;
		// }
	}
	
	.booster-icon {
		vertical-align: middle;
		height: 5rem;
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

	.anticon {
		font-size: 50px;
		display: block;
		&.activeBooster {
			color: ${theme.primaryContrast};
		}
	}

	.ant-btn-primary {
		width: 100%;
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