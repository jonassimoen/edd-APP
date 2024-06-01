import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const NewTeamStyle = styled.div`
    .left, .right {
        @media (max-width: 1024px) {
            width: 100%;
        }
    }

    @media (max-width: 992px) {
        .right {
            margin-top: 3rem;
        }
    }

    .title {
        border-radius: 1rem;
        color:white;

        h1,h2,h3 {
            margin-top: 0;
        }
        background: ${theme.primaryColor};
        padding: 1rem;
    }

    .ant-tour {
        background-color: red;
    }
` as any;