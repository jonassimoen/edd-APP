import { Checkbox, Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

declare type EditModalProps<T> = {
    object: T
    // properties: {
    //     key: keyof T
    //     type: string
    //     label: string
    //     required?: boolean
    // }[]
    open: boolean
    action: string
    type: string
	width?: number
    onCreate: (object: any) => void
    onCancel: () => void
}

export const EditModal = <T,>(props: React.PropsWithChildren<EditModalProps<T>>) => {
	const { t } = useTranslation();
	const { object, open, action, type, width, onCreate, onCancel } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if(open && form) {
			form.setFieldsValue(object);
		}
	}, [object]);

	return (
		<Modal 
			open={open}
			width={width}
			title={`${t(`modal.${action}`)} ${type}`}
			okText={t(`${action}Btn`)}
			cancelText={t("cancelBtn")}
			onOk={() => {
				form
					.validateFields()
					.then((obj) => {
						form.resetFields();
						form.setFieldsValue(action === "edit" ? obj : {});
						onCreate(obj);
					})
					.catch((err) => {
						// todo: display notification
						console.log("Error while editing:", err);
					});
			}}
			onCancel={onCancel}
		>
			<Form
				colon={false}
				form={form}
				layout="vertical"
				name={`modal_form_${action}_${type}`}
				initialValues={object as object}

			>
				{props.children}

			</Form>
		</Modal>
	);
};