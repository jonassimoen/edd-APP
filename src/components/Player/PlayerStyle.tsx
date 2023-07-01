import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const PlayerStyle = styled.div`
    position: relative;
    cursor: pointer;
    text-align: ${(props: any) => !props.player ? "center" : "inherit"};
    width: 100px;
    height: 60px;

    @media ${mediaQueries.mobileM} {
        width: 85px;
        height: 55px;
    }

    @media ${mediaQueries.tablet} {
        width: 90px;
        height: 70px;
    }

    .position-label {
        position: absolute;
        top: 100%;
        margin: 0 auto;
        text-align: center;
        color: white;
    }

    margin: auto;
` as any;

export const PlayerBg = styled.img`
    position: relative;
    width: 50px;
    height: 50px;
` as any;

export const Badge = styled.div`
    background-color: ${(props: any) => props.bgColor};
    position: absolute;
    top: 75%;
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
		line-height: 1.1;
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