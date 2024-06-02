import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const HomeStyle = styled.div`
    .login {
        margin: 20px auto;
        padding: 40px 20px;
        background: ${theme.primaryColor};
        color: #fff;

        h2 {
            font-size: 36px;
            margin-top: 0px;
            margin-bottom: 0.5rem;
            line-height: 2.5rem;
            color: ${theme.secondaryColor};
        }

        .playNow {
            font-weight: 700;
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
            transition: background-color .3s,border-color .3s;
            width 100%;
            height: 50px;
            margin-top: 40px;

            background-color: ${theme.primaryContrast};
            color: #fff;
            border-color: ${theme.primaryContrast};

            &:hover {
                color: ${theme.secondaryColor};
                background-color: ${theme.primaryContrast};
            }
        }
    }
`;

export const Cover = styled.div`
    position: relative;
    height: auto;
    background-color: black;

    img {
        min-width: 100%;
    }

    .overlay {
        display: flex;
        flex-direction: column;
        align-items: center;

        .countdown {
            font-size: 16px;
        }

        .win {
            color: #fff;
            font-size: 12px;
            @media ${mediaQueries.tablet} {
                font-size: 20px;
                margin-bottom: 15px;
            }
        }

        .play-me {
            font-size: 1.3em;
            @media ${mediaQueries.tablet} {
                font-size: 1.8em;
            }
        }

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px 10px;
        padding-top: 10%;

        .bottom {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
        }

        h1 {
            font-size: 16px;
            color: white;
            
            @media ${mediaQueries.tablet} {
                font-size: 30px;
            }

            @media ${mediaQueries.desktop} {
                margin-top: 40px;
            }
        }

        h1, p {
            text-shadow: 2px 2px 20px #000000;
            text-align: center;
        }

        p {
            font-size: 1em !important;
            margin: 20px 0 0;


            @media ${mediaQueries.tablet} {
                font-size: 1.5em !important;
            }
        }

        button {
            font-size: 1.5em;
            height: auto;
        }

        button:hover {
            color: #fff;
        }
    }
`;

export const CardStyle = styled.div`
    margin-bottom: 40px;


    // .ant-card-meta-title {
    //     display: inline-block;
    //     background-color: black;
    //     color: white;
    //     padding: 3px 7px;
    //     color: ${props => props.theme.primaryColor};
    //     font-weight: bold;
    //     margin: 20px 0 10px;
    // }

    .ant-card-meta-description {
        color: black;
    }
`;