import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useActivateBoosterMutation } from "@/services/teamsApi";
import { BoosterConfirmModalStyle } from "./BoosterConfirmModalStyle";
import { useTranslation } from "react-i18next";
import parseHTML from "html-react-parser";
import { useMemo, useState } from "react";
import { Select } from "../UI/Select/Select";
import { Button } from "../UI/Button/Button";

declare type BoosterConfirmModalProps = {
	open?: boolean
	teamId: number
	type: string
	possiblePlayers: Player[]
	onCancel: () => void
}

export const BoosterConfirmModal = (props: BoosterConfirmModalProps) => {
	const {t} = useTranslation();
	const [activateBooster] = useActivateBoosterMutation();
	const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
	const [err, setErr] = useState<string|null>(null);

	const isPlayerBooster = useMemo(() => ["hiddenGem","goalRush"].includes(props.type), [props.type]);

	const pushBooster = () => {
		if(!isPlayerBooster || (selectedPlayerId != null)) {
			activateBooster({teamId: props.teamId, type: props.type, playerId: selectedPlayerId})
				.unwrap()
				.then(data => {
					openSuccessNotification({title: `${t("general.teamBooster")} "${t(`boosters.${props.type}`)}" ${t("general.activated")}!`});
					props.onCancel();
					setSelectedPlayerId(null);
				})
				.catch(err => openErrorNotification({title: err.data.message}));
		}
		if(isPlayerBooster && selectedPlayerId == null) {
			setErr(t("boosters.noPlayerSelected"));
		}
	};

	return (
		<BoosterConfirmModalStyle
			title={t("boosters.activate") + " " + t(`boosters.${props.type}`)}
			open={props.open}
			onCancel={props.onCancel}
			footer={[
				<Button key='cancel' onClick={props.onCancel}>{t("general.cancel")}</Button>,
				<Button type='primary' key='confirm' onClick={pushBooster}>{t("general.confirm")}</Button>
			]}
		>
			<span>{parseHTML(t("boosters.confirmMsg"))}</span>
			
			{  isPlayerBooster ?
				<div
				>
					<Select
						className="player-booster"
						placeholder={t("boosters.affectedPlayer")}
						values={props.possiblePlayers}
						keyProperty={"id"}
						textProperty={"name"}
						value={selectedPlayerId}
						onChange={(value: number) => {
							setSelectedPlayerId(value);
							setErr(null);
						}}				
					/>
					{ err ? <p className="error">{err}</p> : null }
				</div>
				: null
			}

			
		</BoosterConfirmModalStyle>
	);
};