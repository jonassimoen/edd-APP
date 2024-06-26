import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";
import { theme } from "@/styles/theme";

export const PlayerStyle = styled.div`
    position: relative;
    cursor: pointer;
    text-align: ${(props: any) => !props.player ? "center" : "inherit"};
    width: 60px;
    height: 50px;

	&.no-player {
		background: rgba(255,255,255,0.3);
		border-radius: 1rem 1rem 0 0;
		backdrop-filter: blur(20px);
	}

    @media ${mediaQueries.mobileM} {
        width: 75px;
        height: 65px;
    }

    @media ${mediaQueries.tabletL} {	
        width: 85px;
        height: 70px;
    }

    @media ${mediaQueries.desktopL} {	
        width: 120px;
        height: 100px;
    }

    .position-label {
		position: relative;
		top: 145%;
        text-align: center;
        color: white;
    }

	svg {
		font-size: 20px;
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
	height: 20px;
	display: flex;
    align-items: center;
    justify-content: center;
	
	background: ${(props: any) => props.bgColor};
	color:  ${(props: any) => props.color};

    p {
        text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
    }

	@media ${mediaQueries.tablet} {
		overflow: hidden;
	}
` as any;

export const NoPlayer = styled.div`
	margin: 0 auto;
	position: absolute;
	left:0;right:0;
	top:25%;

	.add-icon {
		fontSize: 2em;
		color: ${theme.primaryColor};
		cursor: pointer;
	}
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

export const WarningLocation = styled.div`
	position: absolute;
	right: 10px;
	width: 20px;
	height: 20px;
	text-align: center;
	cursor: pointer;
	bottom: 20px;
	border-radius: 50%;
	background: ${(props: any) => props.bgColor};
	
	@media ${mediaQueries.mobileM} {
		right: 0px;
	}

	p {
		font-size: 22px;
		font-weight: 700;
		color: ${(props: any) => props.color};
	}

	&.small {
		bottom: 0px;
		p {
			font-size: 16px;
		}
	}
	
` as any;

export const Points = styled.span`
	font-family: C-Regular,"Helvetica Neue",Helvetica,Arial,sans-serif;
	font-weight: bold;
	color: ${(props: any) => props.color};
	background-color: ${(props: any) => props.bgColor};;
	align-self: flex-end;

	position: absolute;
	right: 0px;
    bottom: 20%;
    width: 25px;
    height: 25px;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
` as any;