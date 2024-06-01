import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const RankingsStyle = styled.div`
`;
export const tablePagination = `
    .ant-pagination {
        background: ${theme.primaryColor};
        border: 1px solid rgba(255 255 255 / 0.15);
        color: white;
        border-radius: 0.5rem;
        text-align: center;

        .ant-pagination-prev, .ant-pagination-next {
            &.ant-pagination-disabled svg {
                color: ${theme.colorGray};
            }
            svg {
                color:white;
                &:hover {
                    color: ${theme.secondaryColor};
                }
            }
            a {
                border-radius: 0px;
            }
        }
        .ant-pagination-jump-next, .ant-pagination-jump-prev {
            .ant-pagination-item-link-icon, .ant-pagination-item-ellipsis {
                color: white;
            }
        }

        .ant-pagination-item {
            border-radius: 1rem;
            a, svg {
                color: white;
            }

            &-active {
                border: none;
                background: ${theme.secondaryColor};
                a {
                    color: ${theme.primaryColor};
                }
            }

            &:hover:not(.ant-pagination-item-active) a {
                color: ${theme.secondaryColor};
            }
        }

}
`;

export const TableStyle = styled(Table)`
	.ant-table {
		scrollbar-color: unset;
		border-radius: 0.5rem;

		&::-webkit-scrollbar {
			background:red;
			height:4px;
			width:4px;
		}
	}

	.ant-table-content {
		overflow-x: auto;
	}

	.ant-table-thead {
		>tr>th {
			background-color: ${theme.primaryColor};
			color: ${theme.colorLightGray};
			padding: 0.5rem;
            white-space: nowrap;
			&:first-child {
				padding-left: 1rem;
			}
			&:last-child {
				padding-left: 1rem;
			}

			&:last-child {
				text-align: left;
			}

			&.ant-table-column-sort {
				background: ${theme.primaryColor};
				color: ${theme.secondaryColor};
			}

			&.ant-table-column-has-sorters:hover {
				background: ${theme.primaryColor} !important;
				color: ${theme.secondaryColor} !important;
			}

			&.ant-table-column-has-actions {
                background-clip: initial;
			}

			.ant-table-column-sorter .ant-table-column-sorter-inner {
				color: #bfbfbf;
			}

			.ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active {
				color: ${theme.secondaryColor};
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
		}
	}

	${tablePagination}

` as any;