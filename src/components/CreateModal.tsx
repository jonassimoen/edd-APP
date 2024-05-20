import { Checkbox, Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

declare type CreateModalProps<T> = {
    object: T
    open: boolean
    title: string
	width?: number
    onCreate: (object: T) => void
    onCancel: () => void
}

export const CreateModal = <T,>(props: React.PropsWithChildren<CreateModalProps<T>>) => {
	const { t } = useTranslation();
	const { object, open, title, width, onCreate, onCancel } = props;
	const [form] = Form.useForm();

	return (
		<Modal
			open={open}
			width={width}
			title={`${t("createTitle")} ${title}`}
			okText={t("createBtn")}
			cancelText={t("cancelBtn")}
			onOk={() => {
				form
					.validateFields()
					.then((obj) => {
						form.resetFields();
						form.setFieldsValue({});
						onCreate(obj);
					})
					.catch((err) => {
						// todo: display notification
						console.log("Error while creating:", err);
					});
			}}
			onCancel={onCancel}


		>
			<Form
				colon={false}
				form={form}
				layout="vertical"
				name={`modal_form_create_${title}`}
                
			>
				{props.children}

			</Form>
		</Modal>
	);
};