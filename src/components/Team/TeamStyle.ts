import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { TeamProps } from "./Team";
import { PlayerStyle } from "../Player/PlayerStyle";

export const TeamStyle = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 0px 0 30px;
    flex: 1;
    max-width: 975px;
    height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 1.5 * 320}px; /*  Make mobile size higher */
    background: url('${(props: any) => props.bg}') no-repeat center center/120% 100%;
    border-radius: 0;
    margin: 75px auto;

    .position {
        display: flex;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        
        @media ${mediaQueries.tablet} {
            flex-wrap: nowrap;
        }

        ${PlayerStyle} {
            margin: 8px;

            @media ${mediaQueries.mobileM} {
                margin: 4px;
            }

            @media ${mediaQueries.tablet} {
                margin: 0 10px;
            }

            @media ${mediaQueries.desktop} {
                margin: 0 8px;
            }
        }
    }

    @media ${mediaQueries.mobileM} {
        padding: 0px 0 30px;
        height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 1.5 * 375}px;
        margin: ${(props: TeamProps) => (props.centerAligned ? "0 auto;" : "inherit")};
    }

    @media ${mediaQueries.tablet} {
        max-width: 960px;
        height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 730}px;
        background-size: 100% 100%;
    }
` as any;