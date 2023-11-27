import styled from "@/styles/styled-components";
import { PlayerStyle } from "../PlayerList/PlayerListStyle";
import { mediaQueries } from "@/styles/media-queries";
import { theme } from "@/styles/theme";

export const SubstitutesStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 975px;
    padding-top: 2%;
    padding-bottom: 2%;
    row-gap: 2rem;
	background: url('${(props: any) => props.bgImage}') center;

	@media ${mediaQueries.tablet} {
		max-width: 960px;
	}
    .substitutes {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: center;

        &-player {
            margin: 10px;
        }
    }

    .title {
        color: ${theme.primaryColor};
        text-transform: uppercase;
        font-weight: bold;
    }
` as any;