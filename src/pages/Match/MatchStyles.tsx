import { sizes } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const MatchStyles = styled.div`
	.left, .right {
		@media (max-width: ${sizes.tabletL}) {
				width: 100%;
		}
	}
`;