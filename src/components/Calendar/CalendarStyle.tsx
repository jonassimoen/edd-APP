import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const ContainerStyle = styled.div`
.gameday {
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
        
        td:first-child {
            text-align right;
        }

        td:nth-child(2) {
            text-align: center;
        }

        td:last-child {
            text-align left;
        }
    }

    td { 
        .team-name, .score {
        }

        .score {
            font-size: 18px;
            display: flex;
            justify-content: center;
            
            &.created, &.played, &.statsimported {
                color:gray;
            }
        }
    }
}
`;

export const ClubDetails = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    justify-content: center;
    align-items: center;
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