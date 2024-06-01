import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const TransfersOverviewStyle = styled.div`
`;

export const TransferListStyle = styled(Table)`
	background: transparent;

	.ant-table {
		border-radius: 0 0 0.5rem 0.5rem;
		border-top: none;
		border: 1px solid rgba(255 255 255 / 0.15);
		background: ${theme.primaryColor};

		table {
			td {
				border: none;
				padding: 0.2rem 1rem;
				}
				
			}
		}
		.ant-table-tbody {
			color:white;

			.ant-table-row {
				&>.ant-table-cell-row-hover  {
					background: none;
				}
				&>.ant-table-cell {
					&:nth-child(1) {
						text-align: left;
					}
					&:nth-child(2) {
						text-align: center;
					}
					&:nth-child(3) {
						text-align: right;
					}
				}
			}
		}
	}
`;

export const StatsStyle = styled.div<any>`
	border-radius:  ${(props: any) => props.single ? "0.5rem" : "0.5rem 0.5rem 0 0;" };
	background-color: ${theme.primaryContrast};
	border: 1px solid rgba(255 255 255 / 0.15);
	${(props: any) => !props.single && "border-bottom: none" };
	

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
			color: ${theme.secondaryColor};
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