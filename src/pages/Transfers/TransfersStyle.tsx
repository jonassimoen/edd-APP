import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const TransfersStyle = styled.div`
    .title {
        border-radius: 1rem;
        color:white;

        h1,h2,h3 {
            margin-top: 0;
        }
        margin-bottom: 1rem;
        background: ${theme.primaryColor};
        padding: 1rem;
    }
`;