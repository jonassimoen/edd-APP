import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const TableStyle = styled(Table)`
	.ant-table-content {
		overflow-x: scroll;
	}

	.ant-table-thead {
		>tr>th {
			background-color: ${theme.primaryContrast};
			color: ${theme.primaryColor};
			padding-top: 10px;
			padding-bottom: 10px;
			border-radius: 0px !important;
			padding: 7.5px;
            white-space: nowrap;
            text-align: center;

			&:last-child {
				text-align: center;
			}

			&.ant-table-column-has-sorters:hover {
				background: ${theme.primaryColor} !important;
				color: ${theme.primaryContrast} !important;
			}

			&.ant-table-column-has-actions {
                background-clip: initial;
			}

			.ant-table-column-sorter .ant-table-column-sorter-inner {
				color: #bfbfbf;
			}

			&::before {
				display: none;
			}
		}
	}

	.avatar-container {
		margin-bottom: -10px;
	}

	.ant-table-tbody {
		.ant-table-row {
			> td {
				color: #000;
				border: none;
				padding: 7.5px;
				white-space:nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				&:first-child {
					padding: 2.5px 10px 0 15px;
				}

				&:last-child {
					text-align: left;
				}
			}
			&--even {
				background-color: #f2f0f4;
			}
			&--od {
				background-color: #e9e7ec;
			}
		}
	}
` as any;