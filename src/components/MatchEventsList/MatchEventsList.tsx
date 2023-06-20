import { useEffect, useState } from "react";
import { GameInfoStyle, MatchEventsListStyle } from "./MatchEventsListStyle";
import { MatchEventMinute } from "../MatchEventMinute/MatchEventMinute";
import { useGetMatchEventsQuery } from "@/services/matchesApi";

declare type MatchEventsListProps = {
    events?: MatchEvent[]
    match: Match
    gameInfo?: boolean
}

declare type MatchEventsListState = {
    eventsByMinute: object;
}

const groupBy = (events: MatchEvent[]) => {
    events
    return events.reduce((r, a) => {
        r[a.minute] = r[a.minute] || [];
        r[a.minute].push(a);
        return r;
    }, Object.create(null))
}

export const MatchEventsList = (props: MatchEventsListProps) => {
    const [state, setState] = useState<MatchEventsListState>({
        eventsByMinute: {}
    });

    useEffect(() => {
        if (props.events) {
            setState({ ...state, eventsByMinute: groupBy(props.events) });
        }
    }, [props.events]);

    return (
        <>
            { props.gameInfo && 
                <GameInfoStyle>
                    <p className="clubs">{props.match?.home?.name} - {props.match?.away?.name}</p>
                    <p className="gameinfo">{new Date(props.match?.date || "").toLocaleString("nl-BE", { dateStyle: 'full', timeStyle: 'short' })}</p>
                </GameInfoStyle>
            }
            <MatchEventsListStyle>
                {
                    Object.entries(state.eventsByMinute).map((value: [string, MatchEvent[]]) => {
                        return (
                            <MatchEventMinute
                                key={`match-${props.match.id}-eventsminute-${+value[0]}`}
                                events={value[1]}
                                minute={+value[0]}
                                homeId={props.match.home?.id || 0}
                            />
                        );
                    })
                }
            </MatchEventsListStyle>
        </>
    );
}