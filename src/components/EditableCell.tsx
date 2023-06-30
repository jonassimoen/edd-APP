import { Checkbox, Form, Input, InputNumber } from "antd";

declare type EditableCellProps = {
    editing: boolean,
    record: any,
    children: React.ReactNode,
    inputType: "number" | "text" | "boolean";
    inputRequiredMessage: string,
    dataIndex: string;
}

export const EditableCell = (props: EditableCellProps) => {
	const { editing, record, children, inputType, inputRequiredMessage,dataIndex, ...restProps } = props;
	const inputNode = inputType === "number" ? <InputNumber /> : (inputType === "boolean" ? <Checkbox /> : <Input />);

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{margin:"0"}}
					rules={[
						{
							required: true,
							message: inputRequiredMessage,
						}
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};