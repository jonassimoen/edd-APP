import { Checkbox, Form, Input, InputNumber, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

declare type CreateModalProps<T> = {
    object: T
    // properties: {
    //     key: keyof T
    //     type: string
    //     label: string
    //     required?: boolean
    // }[]
    open: boolean;
    title: string
    onCreate: (object: T) => void
    onCancel: () => void
}

export const CreateModal = <T,>(props: React.PropsWithChildren<CreateModalProps<T>>) => {
	const { t } = useTranslation();
	const { object, open, title, onCreate, onCancel } = props;
	const [form] = Form.useForm();

	return (
		<Modal
			open={props.open}
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
						console.log("fout", err);
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