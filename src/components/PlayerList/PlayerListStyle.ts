import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const ContainerStyle = styled.div`
    .filters {
        background: ${theme.primaryContrast};
        border-radius: 1rem 1rem 0 0;
        border: 1px solid rgba(255 255 255 / 0.15);
        border-bottom: none;
        padding: 0.5rem 1rem;
    }

    .avatar-container {
        .player {
            height: 70px;
            width: 70px;
            img {
                max-height: 100%;
                max-width: 90%;
            }
        }
    }
`;

export const SelectGroupStyle = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 10px;
    gap: 0.5rem;
    flex-direction: column;

    @media ${mediaQueries.tablet} {
        flex-wrap: nowrap;
        justify-content: space-between;
        flex-direction: row;
    }
` as any;

export const PlayerStyle = styled.div`
    display: block;
    line-height: 1.1;

    .name {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;
        display: inline;
    }

    .details {
        font-size: 12px;
        display: flex;
        flex-direction: column;
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
        background: ${theme.primaryColor};
        border: 1px solid rgba(255 255 255 / 0.15);
        color: white;
        border-radius: 0.5rem;
        width: 100%;
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
        color: white;
        border-radius: 0 0 0.5rem 0.5rem;
        background-color: ${theme.primaryColor};
        border: 1px solid rgba(255 255 255 / 0.15);
        border-top: none;

        &-content {
            table {
                border-spacing: 0;
                border-collapse: collapse;
            }

            .ant-table-row {
                &:last-child {
                    .ant-table-cell {
                        border: none;
                    }
                }
                .ant-table-cell {
                    border-bottom-color: rgba(255, 255, 255, 0.1);
                    &:first-child {
                        padding: 0px;
                    }

                    &-row-hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                }

                &.disabled {
                    background: rgba(0, 0, 0, 0.15);

                    .ant-table-cell {
                        opacity: 0.5;
                        &-row-hover {
                            background: none;
                        }
                    }
                }
            }
        }
    }
    ${tablePagination}  
` as any;