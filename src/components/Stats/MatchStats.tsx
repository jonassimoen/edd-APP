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
	// <StatsStyle>
	//     <Row className="stat-row">
	//         <Col lg={11} md={11} sm={11} xs={11}>
	//         {/* <Col> */}
	//             <ClubDetails left>
	//                 <ClubName className="team-name" fullName={data?.home.name} short={data?.home.short} />
	//                 <ClubBadgeBg src={`${config.API_URL}/static/badges/${data?.home.externalId}.png`} />
	//             </ClubDetails>
	//         </Col>
	//         <Col lg={2} md={2} sm={2} xs={2}>
	//             <b className="score started">{ `${props.homeScore} - ${props.awayScore}` }</b>
	//         </Col>
	//         <Col lg={11} md={11} sm={11} xs={11}>
	//             <ClubDetails>
	//                 <ClubBadgeBg src={`${config.API_URL}/static/badges/${data?.away.externalId}.png`} />
	//                 <ClubName className="team-name" fullName={data?.away.name} short={data?.away.short} />
	//             </ClubDetails>
	//         </Col>
	//     </Row>
	// </StatsStyle>
		<MatchStatsStyle>
			<ClubDetails className="team" left>
				<ClubName className="team-name" fullName={data?.home.name} short={data?.home.short} />
				<ClubBadgeBg src={`${props.assetsCdn}/badges/${data?.home.id}.png`} />
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