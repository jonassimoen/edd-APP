import { theme } from '@/styles/theme';
import styled from 'styled-components';

export const StatsStyle = styled.div `
	border-radius: 0;
	padding-top: 10px;
	padding-bottom: 10p;
	background-color: ${theme.primaryContrast};

	.stat-row {
		&.no-border {
			border-bottom: none;
		}

		.ant-col {
			padding: 10px;
			padding-left: 20px;
			padding-right: 20px;

			&:nth-child(even) {
				text-align: right;
			}
		}

		.label {
			font-size: 14px;
			color: white;
			text-align: center;
			text-transform: none;
    		font-weight: normal;
			display: block;
		}

		.points {
			font-size: 2em;
			color: ${theme.primaryColor};
			display: block;
			text-align: center;
			font-weight: bold;
			margin: 0;
		}
	}
`;
