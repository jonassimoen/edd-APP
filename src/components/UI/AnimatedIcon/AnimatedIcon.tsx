/* eslint-disable react/no-unknown-property */
import { LiveIconStyle } from "./AnimatedIconStyle";

export const LiveIcon = () => {
	return (
		<LiveIconStyle>
			<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				<circle cx="50" cy="50" r="0" fill="none" stroke="#e90c0c" stroke-width="27">
					<animate attributeName="r" repeatCount="indefinite" dur="2s" values="4;10;4" begin="0s"></animate>
				</circle>
			</svg>
		</LiveIconStyle>
	);
};