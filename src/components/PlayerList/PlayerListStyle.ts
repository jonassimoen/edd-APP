import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
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
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;

        .icons {
            display: inline;
            margin-left: 50px;
        }
    }

    .mobile-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
    }

    // .player-position {
    //  display: block;
    // }

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

    .ant-pagination-item {
        border-radius: 0px;

        &:hover:not(.ant-pagination-disabled), &.ant-pagination-item-active {

            a {
                font-weight: bold;
                color: #121212;
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