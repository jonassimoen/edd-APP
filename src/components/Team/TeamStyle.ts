import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { TeamProps } from "./Team";
import { PlayerStyle } from "../Player/PlayerStyle";
import { theme } from "@/styles/theme";
import pitchBackground from "../../assets/img/pitch-xl.png";
import pitchNoBoarding from "../../assets/img/fpl-pitch-no-boarding.svg";

export const TeamStyle = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 0px 0 30px;
    flex: 1;
    max-width: 975px;
    //height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 1.5 * 320}px; /*  Make mobile size higher */
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

    &::before {
        content: "";
        position: absolute;
        z-index: -999;
        top: -12rem;
        background: url(${pitchBackground});
        background-size: cover;
        background-repeat: no-repeat;
        background-color: transparent;
        background-position: top;
        min-height: 442px;
        pointer-events: none;
        left: 50%;
        transform: translateX(-50%);
        height: 975px;
        width: calc(100vw + 105%);
    }
    
    // &::after {
    //     content: "";
    //     z-index: -1;
    //     position: absolute;
    //     top: 800px;
    //     height: 2rem;
    //     width: calc(150vw);
    //     left: 50%;
    //     transform: translateX(-50%);
    //     transform-origin: bottom;
    //     bottom: 0;
    //     background: ${theme.primaryColor};
    // }

    .pitch
    {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 2rem;
        margin-top: 2rem;
        margin-bottom: 2rem;

        &::before {
            content: "";
            z-index: -2;
            position: absolute;
            top: 0;
            background: url(${pitchNoBoarding});
            background-size: contain;
            background-repeat: no-repeat;
            background-position: top;
            left: 50%;
            width: 1500px;
            height: 825px;
            transform: translateX(-50%);
            clip-path: inset(0 0 26px 0);
            @media ${mediaQueries.tablet} {
                height: 825px;
            }
        }
        &.m-left::before {
            clip-path: inset(0rem 0rem 8rem 0em);

            @media ${mediaQueries.tabletL} {
                clip-path: inset(0rem 0rem 4rem 0em);
            }
        }
        &.m-right::before {
            clip-path: inset(0rem 0rem 6rem 0em);
            @media ${mediaQueries.tabletL} {
                clip-path: inset(0rem 0rem 4rem 23.15em);
            }
        }
    }

    @media ${mediaQueries.mobileM} {
        padding: 0px 0 30px;
        //height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 2 * 350}px;
        margin: ${(props: TeamProps) => (props.centerAligned ? "0 auto;" : "inherit")};
    }

    @media ${mediaQueries.tablet} {
        max-width: 960px;
        //height: ${(props: TeamProps) => (props.heightRatio / props.widthRatio) * 630}px;
    }
` as any;

export const SaveLineupButton = styled.div`
	text-align: center;
	margin: 10px 0px;

	@media ${mediaQueries.tabletL} {
		text-align: right;
	}

	.ant-btn {
		width: 100%;
	}
`;