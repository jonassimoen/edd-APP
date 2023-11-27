import { theme } from '@/styles/theme';
import styled from 'styled-components';

export const StatsStyle = styled.div `
	border-radius: 0;
	margin: 10px auto;
	background-color: ${theme.primaryContrast};
	// background-color: white;
	box-shadow: rgba(0,0,0,0.1) 0px 12px 27px 4px;

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

		.team-name {
			color: white;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            vertical-align: middle;
		}
	}

	.stat {
		padding: 15px 10px;
		border-bottom: 1px solid rgba(238,238,238,0.3);
		color: white;
		// color: ${theme.primaryContrast};

		.label {
			text-align: left;
			font-size: 1.1em;
		}

		.points {
			color: ${props => props.theme.primaryColor};
			font-size: 1.1em;
			text-align: right;
		}

		.has-transfers {
			span {
				border-bottom: 2px solid ${props => props.theme.primaryColor};
				cursor: pointer;
				padding: 0px 5px 0px 5px;
			}
		}

		.green {
			color: green;
		}

		.red {
			color: red;
		}
	}
`;

export const MatchStatsStyle = styled.div `
	display:flex;
	justify-content: center;
	background-color: ${theme.primaryContrast};
	color: white;
	font-size: 15px;

	.team {
		padding: 15px;
	}

	.score {
		display:flex;
		align-items: center;
	}
`;