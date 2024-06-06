import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";
import { Table } from "antd";

export const ContainerStyle = styled.div<any>`
    @media ${mediaQueries.tabletL} {
        max-height: ${(props: any) => props.maxheight}px;
        overflow-y: auto;
    }
    .gameday {
        
        &:not(:last-child) {
            .ant-table {
                border-radius: 0;
            }
        }
        
        .date {
            border: 1px solid rgba(255 255 255 / 0.15);
            border-bottom: none;
            padding: 1rem 0 0 0;
            background: ${theme.primaryColor};

            p {
                text-align: center;
                padding: 0.5rem 0;
                color: white;

            }
        }
        &:first-child {
            .date {
                border-radius: 1rem 1rem 0 0;
                border-bottom: none;
            }
        }

        a.team {
            border-bottom: 0;
            color: rgba(0, 0, 0, 0.65);
        }

        .team {
            width: 100%;

            .team-name {
                width: 60%;
                
                @media ${mediaQueries.tablet} {
                    width: 70%;
                }
                
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }

    table {
        tr {
            cursor: pointer;
        }

        td { 
            .team-name, .score {
            }

            .score {
                font-size: 18px;
                display: flex;
                justify-content: center;
                
                &.created, &.played, &.statsimported {
                    color: ${theme.colorGray};
                }
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
                    border-bottom: none;
                    // border-bottom-color: rgba(255, 255, 255, 0.1);
                    padding: 1rem 0;

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
` as any;

export const ClubDetails = styled.div`
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: center;
    align-items: center;

    &.left {
        justify-content: flex-start;
    }
    &.right {
        justify-content: flex-end;
        .team-name {
            text-align: right;
        }
    }
    gap: 0.5rem;
`;

export const ClubBadgeBg = styled.img`
	max-width: 50px;
	display: inline-block;
	margin: 5px;

    &.small {
        max-width: 20px;
        margin: 0px;
    }
` as any;

export const ClubName: any = styled.span`
	&::after {
		content: "${(props: any) => props.shortName}"; 
	}	

	@media ${mediaQueries.tablet} {
		&::after {
			content: "${(props: any) => props.fullName}"; 
		}
	}	
`;

export const FiltersArea = styled.div`
	text-align: center;
	margin: 20px;

	.ant-btn-primary {
		color: ${props => props.theme.primaryColor};
		background-color: #9E9E9E;
	}

	.ant-select {
		max-width: 150px;
	}
` as any;