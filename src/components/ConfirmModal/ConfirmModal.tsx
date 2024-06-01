import { Button } from "../UI/Button/Button";
import { Col, Row } from "../UI/Grid/Grid";
import { ConfirmModalStyle } from "./ConfirmModalStyle";
import { useTranslation } from "react-i18next";

declare type ConfirmModalProps = {
    visible: boolean
    title: string
    text: string
    onCancel: any
    onConfirm: any
}

export const ConfirmModal = (props: ConfirmModalProps) => {
	const { visible, onCancel, onConfirm, text, title } = props;
	const { t } = useTranslation();

	return (
		<ConfirmModalStyle
			title={title}
			closable={false}
			open={visible}
			onCancel={onCancel}
			footer={[]}
		>
			<Row>
				<Col md={24} sm={24} xs={24}>
					{text}
				</Col>
			</Row>
			<Row>
				<Col md={24} sm={24} xs={24} className="actions">
					<Button onClick={(e: any) => { onConfirm(); }}>{t("general.confirmModalYesBtn")}</Button>
					<Button danger onClick={(e: any) => { onCancel(); }}>{t("general.confirmModalNoBtn")}</Button>
				</Col>
			</Row>

		</ConfirmModalStyle>
	);
};