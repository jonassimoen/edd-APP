import styled from "@/styles/styled-components";
import backIcon from "../../assets/img/back.png";

export const MatchdaySelectorStyle = styled.div`
	text-align: center;
	font-weight: bold;
	padding: 5px;
	font-size:18px;

	display: flex;
	align-items: center;
	justify-content: space-between;
	color: black;
`;

export const ButtonStyle = styled.a`
	display: block;
	width: 50px;
	height: 50px;
	cursor: pointer;
	background: url('${backIcon}') center center / 20px 20px no-repeat rgb(255,255,255);
	border-radius: 50%;
	margin: 0 0 0 5px;
    &.disabled {
    	cursor: not-allowed;
	}

    ${({ type }) => type === "next" && `
        transform: rotate(180deg);
        margin: 0 5px 0 0;
    `}
`;