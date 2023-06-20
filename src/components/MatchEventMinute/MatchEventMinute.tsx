import { useTranslation } from "react-i18next"
import { MatchEventMinuteInfoStyle, MatchEventMinuteStyle } from "./MatchEventMinuteStyle"
import { PlusCircleFilled, QuestionCircleFilled } from "@ant-design/icons"
import { MatchEventType } from "@/types/MatchEventTypes"
import { useMemo } from "react"

declare type MatchEventMinuteProps = {
    events: MatchEvent[]
    minute: number
    homeId: number
}


export const MatchEventMinute = (props: MatchEventMinuteProps) => {
    const { t } = useTranslation();
    const eventToIcon = (e: string) => {
        switch (e) {
            case MatchEventType[MatchEventType.Goal]:
                return <PlusCircleFilled />
            default:
                return <QuestionCircleFilled />
        }
    }

    const sortedEvents = useMemo(() => props.events.sort((a: MatchEvent, b: MatchEvent) => a.minute - b.minute), [props.events]);
    const homeEvents = useMemo(() => sortedEvents.filter((ev: MatchEvent) => ev.player?.clubId === props.homeId), [sortedEvents]);
    const awayEvents = useMemo(() => sortedEvents.filter((ev: MatchEvent) => ev.player?.clubId !== props.homeId), [sortedEvents]);

    return (
        <MatchEventMinuteStyle>
            {
                homeEvents.length !== 0 &&
                (<MatchEventMinuteInfoStyle>
                    {homeEvents?.map((event: MatchEvent) => {
                        return (
                            <div key={`details-${event.id}`} className="details right">
                                <p>{event.player?.short}</p>
                                {(eventToIcon(event.type.toString() || ""))}
                            </div>
                        );
                    })}
                </MatchEventMinuteInfoStyle>)
            }

            {homeEvents.length === 0 && (<div className="empty"></div>)}

            <div className="timeline">
                <p>{props.minute}</p>
            </div>

            {
                awayEvents.length !== 0 &&
                (<MatchEventMinuteInfoStyle>
                    {awayEvents?.map((event: MatchEvent) => {
                        return (
                            <div key={`details-${event.id}`} className="details">
                                {(eventToIcon(event.type.toString() || ""))}
                                <p>{event.player?.short}</p>
                            </div>
                        );
                    })}
                </MatchEventMinuteInfoStyle>)
            }

            {awayEvents.length === 0 && (<div className="empty"></div>)}
        </MatchEventMinuteStyle>
    )
}