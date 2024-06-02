import { mediaQueries } from "@/styles/media-queries";
import styled from "@/styles/styled-components";

export const CheckoutFormStyle = styled.form`
	color: white;
	margin: 0 auto;
	max-width: 100vw;
	@media ${mediaQueries.tabletL} {
		max-width: 500px;
	}
`;