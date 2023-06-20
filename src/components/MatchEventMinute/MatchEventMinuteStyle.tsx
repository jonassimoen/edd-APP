import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const MatchEventMinuteStyle = styled.div`
    display: grid;
    grid-template-columns: 1fr 3px 1fr;
    
    .timeline {
        background-color: ${theme.primaryContrast};
        color:white;
        width: 0.5rem;
        height: auto;
        padding: 2rem 0;


        > p {
            width: 2rem;
            height: 2rem;
            text-align: center;
            border-radius: 50%;
            -webkit-transform: translateX(-0.75rem);
            transform: translateX(-0.75rem);
            padding: 0.35rem;
            background-color: ${theme.primaryContrast};
            margin: 0;
        }
        
    }
`;


export const MatchEventMinuteInfoStyle = styled.div`
    top: 0;
    margin: 1rem 3rem;
    padding: 1rem;
    border: 1px solid #5A5A5A;
    border-radius: 0.4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height:auto;
    gap: 0.4rem;

    .details {
        display:flex;
        gap: 1rem;

        &.right {
            justify-content: flex-end;
        }
    }

    & p {
        font-weight: 500;
        margin: 0;
    }

    .anticon {
        font-size: 20px;
    }

    
` as any;