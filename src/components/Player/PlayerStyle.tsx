import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const PlayerStyle = styled.div`
    position: relative;
    cursor: pointer;
    text-align: ${(props: any) => !props.player ? "center" : "inherit"};
    width: 70px;
    height: 50px;

    @media ${mediaQueries.mobileM} {
        width: 70px;
        height: 65px;
    }

    @media ${mediaQueries.tablet} {
        width: 80px;
        height: 75px;
    }

    .position-label {
        position: absolute;
        top: 125%;
        margin: 0 auto;
        text-align: center;
        color: white;
		left: 40%;
    }

    margin: auto;
` as any;

export const PlayerBg = styled.img`
    position: absolute;
	max-width: 55%;
	opacity: ${(props: any) => props.inactive ? 0.4 : 1};
	margin: 0 auto;
    inset: 5% 0px 25%;
    background-size: 100%;
    background-position-x: 50%;
	background-image: url("${(props: any) => props.src}");

	@media ${mediaQueries.mobileM} {
		max-width: 65%;
	}
` as any;

export const Badge = styled.div`
    background-color: ${(props: any) => props.bgColor};
	color: ${(props: any) => props.color};
    position: absolute;
    top: 74%;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    span {
        font-weight: 400;
        text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 12px;
		line-height: normal;
		padding: 5px;

		@media ${mediaQueries.mobileM} {
			font-size: 10px;
		}

		@media ${mediaQueries.tablet} {
			font-family: inherit;
			font-size: 12px;
			font-weight: bold;
		}
    }
` as any;

export const OpponentBadge = styled.div`
	position: absolute;
	inset: 100% 0px 0px;
	width: 100%;
	font-size: 10px;
	height: 15px;
	
	background: ${(props: any) => props.bgColor};
	color:  ${(props: any) => props.color};
	padding: 3px;

    span {
        text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1.1;
		padding: 5px;
		
		@media ${mediaQueries.tablet} {
			font-family: inherit;
		}
    }

	@media ${mediaQueries.tablet} {
		overflow: hidden;
	}
` as any;

export const NoPlayer = styled.div`
	margin: 0 auto;
` as any;

export const Value = styled.div`
    position: absolute;
    top:100%;
    bottom:0;
    left:0;
    right:0;
	width: 100%;
	height: 20px;
	font-size: 13px;

	display: flex;
	justify-content: center;
	align-items: center;
	background: ${theme.primaryColor};
	color: ${(props: any) => props.color};

	h4 {
		font-family: Aeonik,"Helvetica Neue",Helvetica,Arial,sans-serif;
		font-weight: 400;
		color: ${(props: any) => props.benchPlayer ? "#000" : "#000"};
		line-height: 1.1;
		white-space: nowrap;
		margin: 0;
    	height: 10px;

		@media ${mediaQueries.mobileM} {
		}

		@media ${mediaQueries.tablet} {
			font-family: inherit;
			font-weight: bold;
		}
	}
`as any;


export const TopRightAction = styled.div`
	position: absolute;
	right: 10px;
	width: 20px;
	top: 0px;
	height: 20px;
	text-align: center;
	cursor: pointer;
	
	@media ${mediaQueries.mobileM} {
		right: 0px;
	}
` as any;

export const TopLeftAction = styled.div`
	position: absolute;
	left: 10px;
	width: 20px;
	height: 20px;
	text-align: center;
	cursor: pointer;
	
	@media ${mediaQueries.mobileM} {
		left: 0px;
	}
	
	top: 0px;
` as any;

export const Points = styled.span`
	font-family: C-Regular,"Helvetica Neue",Helvetica,Arial,sans-serif;
	font-weight: bold;
	color: ${(props: any) => props.color};
	background-color: ${(props: any) => props.bgColor};;
	align-self: flex-end;

	position: absolute;
	right: 0px;
	top: 40%;
	width: 20px;
	height: 20px;

	line-height: 1;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
` as any;