import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const Block = styled.div`	
	margin-top: 0;
	margin-bottom: 0;
	color: #666;

	@media ${mediaQueries.mobileL} {
		padding-top: 15px;
		padding-bottom: 15px;
		
		&.no-margin {
			margin: 0px;
		}
	}
	
	@media ${mediaQueries.mobileS} {
		padding-top: 0px;
		padding-bottom: 0px;
	}
	
	@media (max-width: 425px) {
		margin-left: 5px;
		margin-right: 5px;
	}
`;