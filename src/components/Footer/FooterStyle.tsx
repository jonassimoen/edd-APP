import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const FooterStyle = styled.footer`
margin-top: 40px;
padding: 1rem 6.25rem;
background-color: ${theme.primaryContrast};
position: sticky; 
bottom: 0;

a {
    cursor: pointer; 
    color: #FFF;
    display: block;
    flex: 0 1 auto;
    list-style-type: none;
    width: 100%;
    text-align: center;
    padding: 5px;

    a {				
        .anticon {
            margin-right: 5px;
        }
    }

    a:focus, a:hover {
        color: #FFF !important;
    }
}
` as any;