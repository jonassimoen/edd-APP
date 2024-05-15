import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const RulesStyles = styled.div`
	.rules {
		font-size: 14px;
		line-height: 1.2rem;

		table {
			margin: 1rem auto;
			border-collapse: collapse;

			thead {
				text-align: center;
				font-weight: bold;
				background-color: ${theme.primaryContrast};
				color: ${theme.primaryColor};
				th {
					padding: 0.4rem;
					border: none;
				}
			}

			td {
				border: 1px solid lightgray;
				padding: 0.3rem;
			} 
		}

		.points {
			tr td:nth-child(1) {
				text-align: left;
			}

			td {
				text-align: center;
			}
		}

		.boosters {
			.explanation {
				font-style: italic;
				font-size: 12px;
			}
		}

		h2 {
				font-size: 24px;
				color: rgba(0,0,0,0.6);
		}

		h3 {
				font-size: 21px;
				color: rgba(0,0,0,0.6);
		}

		h4, h5 {
				font-size: 18px;
				color: rgba(0,0,0,0.6);
		}
	}
`;