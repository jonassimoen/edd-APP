import { sizes } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const MatchStyles = styled.div`
	.left, .right {
		@media (max-width: ${sizes.tabletL}) {
				width: 100%;
		}
	}
	
	h2 {
		font-size: 16px;
		border-radius: 0.5rem 0.5rem 0rem 0rem;
		text-align: center;
		padding: 0.5rem;
		background: ${theme.primaryColor};
		border: 1px solid rgba(255 255 255 / 0.15);
		border-bottom: none;
		margin-bottom: 0px;
	}
	
	
	.points {
		display: block;
		font-size: 16px;
		text-align: center;
		background: ${theme.primaryContrast};
		color: white;
		padding: 0.5rem;
		border-radius: 0rem 0rem 0.5rem 0.5rem;
		border: 1px solid rgba(255 255 255 / 0.15);
		border-top: none;
	}
`;