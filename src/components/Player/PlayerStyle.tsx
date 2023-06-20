import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const PlayerStyle = styled.div`
    position: relative;
    cursor: pointer;
    width: 70px;
    height: 50px;
    text-align: ${(props: any) => !props.player ? 'center' : 'inherit'};

    @media ${mediaQueries.mobileM} {
        width: 60px;
        height: 55px;
    }

    @media ${mediaQueries.tablet} {
        width: 75px;
        height: 70px;
    }

    .position-label {
        position: absolute;
        top: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        text-align: center;
        color: white;
    }
` as any;

export const PlayerBg = styled.div`
    background-size: 125%;
    background-position-x: center;
    background-image: url(${(props: any) => props.src});
    position: absolute;
    top: 4%;
    left: 0;
    right: 0;
    bottom: 25%;
    opacity: ${(props: any) => props.inactive ? 0.6 : 1};
    max-width: 55%;
    margin: 0 auto;

    @media ${mediaQueries.mobileM} {
        max-width: 65%;
    }
` as any;

export const Badge = styled.div`
    position: absolute;
    top: 75%;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: any) => props.bgColor};

    @media ${mediaQueries.tablet} {
        padding: 0 5px;
        padding-right: ${(props: any) => props.paddingRight}px;
        overflow: hidden;
    }

    span {
        font-weight: 400;
        color: black;
        line-height: 1.1;
        font-size: 9px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;

        @media ${mediaQueries.mobileM} {
            font-size: 10px;
            margin: 2px;
            margin-top: 4px;
        }
        color: ${(props: any) => props.color};

        @media ${mediaQueries.tablet} {
            font-family: inherit;
            font-size: 11px;
            font-weight: bold;
        }
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

	display: flex;
	justify-content: center;
	align-items: center;
	background: #00FAFA;
	color: #16002b;

	h4 {
		font-family: Aeonik,"Helvetica Neue",Helvetica,Arial,sans-serif;
		font-weight: 400;
		color: ${(props: any) => props.benchPlayer ? '#000' : '#000'};
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

	&.delete {
		top: 0px;
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
	top: 40%;
	width: 20px;
	height: 20px;

	line-height: 1;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
` as any;