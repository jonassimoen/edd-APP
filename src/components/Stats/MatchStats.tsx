import { useGetMatchQuery } from "@/services/matchesApi";
import { ClubBadgeBg, ClubDetails, ClubName } from "../Calendar/CalendarStyle";
import { MatchStatsStyle } from "./StatsStyle";
import config from "@/config";

declare type MatchStatsProps = {
    matchId: number
    homeScore: number
    awayScore: number
	assetsCdn: string
}

export const MatchStats = (props: MatchStatsProps) => {
	const { data } = useGetMatchQuery(props.matchId);
	return (
		<MatchStatsStyle>
			<ClubDetails className="team">
				<ClubBadgeBg src={`${props.assetsCdn}/badges/${data?.home.id}.png`} />
				<ClubName className="team-name" fullName={data?.home.name} short={data?.home.short} />
			</ClubDetails>
			<div className="score">
				<b>{`${props.homeScore} - ${props.awayScore}`}</b>
			</div>
			<ClubDetails className="team">
				<ClubBadgeBg src={`${props.assetsCdn}/badges/${data?.away.id}.png`} />
				<ClubName className="team-name" fullName={data?.away.name} short={data?.away.short} />
			</ClubDetails>
		</MatchStatsStyle>
	);

};