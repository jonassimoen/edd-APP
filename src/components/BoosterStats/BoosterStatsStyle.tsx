import { mediaQueries } from "@/styles/media-queries";
import { theme } from "@/styles/theme";
import styled from "styled-components";

export const BoosterStatsTable = styled.table`
	width: 100%;
	border-collapse: collapse;

	thead {
		background: ${theme.primaryColor};
		color: #000;
		text-align: center;
	}

	tr {
		th, td {
			padding: 5px;
			text-align: left;

			&:nth-child(1) {
				// background-color: red;
				width: 2rem;
				text-align: center;
			}

			.affected-player {
				padding: -5px;
			}
		}
	}
`;

export const PlayerBg = styled.img`
	width: 40px;
` as any;