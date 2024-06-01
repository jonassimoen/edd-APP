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
    padding-bottom: 2%;
    row-gap: 1rem;
    margin: 0 auto;
	// background: url('${(props: any) => props.bgImage}') center;

	@media ${mediaQueries.tabletL} {
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
        background: ${theme.primaryColor};
        width: 80%;
        border-radius: 0.25rem;
        border: 1px solid rgba(255 255 255 / 0.15);
        @media ${mediaQueries.tabletL} {
            width: 60%;
        }
        padding: 0.5rem;
        text-align: center;
        margin: 0 auto;
        color: ${theme.secondaryColor};
        text-transform: uppercase;
        font-weight: bold;
    }
` as any;