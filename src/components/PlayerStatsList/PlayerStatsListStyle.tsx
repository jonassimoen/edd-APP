import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const ContainerStyle = styled.div`
	
`;

export const tablePagination = `
.ant-pagination {
	width: 100%;
	text-align: center;

	.ant-pagination-prev, .ant-pagination-next {
		a {
			border-radius: 0px;
		}

		&:hover:not(.ant-pagination-disabled) a {
			background-color: ${theme.primaryColor};
			border-color: ${theme.primaryColor};
		}
	}

	.ant-pagination-item {
		border-radius: 0px;

		&:hover:not(.ant-pagination-disabled), &.ant-pagination-item-active {
			background-color: ${theme.primaryColor};
			border-color: ${theme.primaryColor};

			a {
				font-weight: bold;
				color: #000;
			}
		}
	}

	.ant-pagination-disabled {
		a {
			border-color: ${theme.primaryContrast};
			background: ${theme.primaryContrast};
			font-weight: bold;
			color: #ababab;
		}
	}
}
`;

export const TableStyle = styled(Table)`
	.ant-table-content {
		overflow-x: scroll;

		.ant-table-thead {
			th {
				padding-top: 10px;
				padding-bottom: 10px;
				background: ${theme.primaryContrast};
				color: ${theme.primaryColor};
				border-radius: 0px !important;
				padding: 7.5px;
				border: none
	
				&:last-child {
					text-align: left;
				}
			
				&.ant-table-column-has-sorters {
					border-bottom: 1px solid #e8e8e8;
					
					&:hover {
						background: ${theme.primaryColor} !important;
						color: ${theme.primaryContrast} !important;
					}
				}
	
				&.ant-table-column-sort {
					background: ${theme.primaryContrast} !important;
				}
	
				&.ant-table-column-has-actions {
					background-clip: initial;
				}

				&::before {
					background: transparent !important;
				}

				.ant-table-column-sorter-up, .ant-table-column-sorter-down {
					color: #e8e8e8;
					&.active {
						color: ${theme.primaryColor};
					}
				}


			}
		}
		.avatar-container {
			margin-bottom: -10px;
		}
	
		.ant-table-tbody {
			.ant-table-row {
				color: #000;
				background-color: #f2f2f2;
	
				> td {
					border: none;
					padding: 7.5px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
	
					&:first-child {
						padding: 2.5px 10px 0 15px;
					}
	
					&:last-child {
						text-align: right;
					}

					&.ant-table-column-sort:not(:hover) {
						background: rgba(22, 0, 43, 0.01);
					}
				}
	
				&--odd {
					background-color: #FFF;
				}
			}
	
			.cursor-pointer {
				cursor: pointer;
			}
		}
	
		.ant-table-row {
			cursor: pointer;
		}
	}

	${tablePagination}	
` as any;

export const PlayerStyle = styled.div`
	${(props: any) =>
	props.type === "desktop" &&
		`
		display: none;
	`}
	
	@media ${mediaQueries.mobileL} {
		${(props: any) =>
			props.type === "desktop" &&
		`
			display: block;
		`}
	}

	.name {
		color: #FFF;
		white-space: nowrap;
    	overflow: hidden;
    	text-overflow: ellipsis;
    	max-width: 150px;
	}

	${(props: any) =>
			props.type === "mobile" &&
		`
		display: block;
	`}

	@media ${mediaQueries.mobileL} {
		${(props: any) =>
			props.type === "mobile" &&
		`
			display: none;
		`}
	}

	p {
		margin-bottom: 0;

		&:first-child {
			font-weight: bold;
		}

		&:last-child {
			color: ${(props: any) => props.clubColor};

			span {
				${(props: any) =>
			props.position === "gk" &&
		`
					color: ${props.theme.positionGk};
				`}

				${(props: any) =>
			props.position === "df" &&
		`
					color: ${props.theme.positionDf};
				`}

				${(props: any) =>
			props.position === "mf" &&
		`
					color: ${props.theme.positionMf};
				`}

				${(props: any) =>
			props.position === "fw" &&
		`
					color: ${props.theme.positionFw};
				`}
			}
		}

	}
` as any;