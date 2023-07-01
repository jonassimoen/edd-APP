import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const ContainerStyle = styled.div`
    
`;

export const SelectGroupStyle = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 10px;

    > div {
        margin: 5px 0;
    }

    @media ${mediaQueries.tablet} {
        flex-wrap: nowrap;
        justify-content: space-between;

        > div {
            margin: 0 5px;
        }
    }
` as any;

export const PlayerStyle = styled.div`
    display: block;

    .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;
        display: inline;
    }

    p {
		margin-bottom: 0;

		&:first-child {
			font-weight: bold;
		}
    }
` as any;

export const tablePagination = `
.ant-pagination {
    width: 100%;
    text-align: center;

    .ant-pagination-prev, .ant-pagination-next {
        a {
            border-radius: 0px;
        }

        &:hover:not(.ant-pagination-disabled) a {
            color: white;
        }
    }

    .ant-pagination-jump-next, .ant-pagination-jump-prev {
        .ant-pagination-item-link-icon {
            color: ${theme.primaryContrast};
        }
    }

    .ant-pagination-item {
        border-radius: 0px;

        &:hover:not(.ant-pagination-disabled), &.ant-pagination-item-active {
            border-color: ${theme.primaryColor};
            a {
                font-weight: bold;
                color: ${theme.primaryContrast};
            }
        }
    }

    .ant-pagination-disabled {
        a {
            font-weight: bold;
            color: #ababab;
        }
    }
}
`;

export const TableStyle = styled(Table)`
    .ant-table {
        color: #000;
    }

    .ant-table-thead {
        th {
            padding-top: 10px;
            padding-bottom: 10px;
            background: ${props => props.theme.primaryContrast};
            color: ${props => props.theme.primaryColor};
        }
    }

	.avatar-container {
		margin-bottom: -15px;
	}

    .ant-table-tbody {
        .ant-table-row {
            background-color: #FFF;
            > td {
                border: none;
                padding: 7.5px;

                &:first-child {
                    padding: 2.5px 10px 0 15px;
                }

                & p {
                    margin-top:0;
                }
            }

            &--odd {
                background-color: #f2f0f4;
            }
        }

        .cursor-pointer {
            cursor: pointer;
        }
    }

    ${tablePagination}  
` as any;