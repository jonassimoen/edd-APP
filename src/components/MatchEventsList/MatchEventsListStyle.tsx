import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const MatchEventsListStyle = styled.div`
    border-top: 3px solid ${theme.primaryContrast}
`;


export const GameInfoStyle = styled.div`
    padding: 2rem;
    background-color: ${theme.primaryContrast};
    border-radius: 0.5rem;
    color: white;
    text-align: center;

    .clubs {
        font-size: 24px;
        font-weight: 400;
    }

    p {
        margin: 0;
    }
` as any;