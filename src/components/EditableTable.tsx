import { Form, Table, TableProps } from "antd";
import { EditableCell } from "./EditableCell";
import { useState } from "react";

declare type ColumnType<T> = T & {
  editable?: boolean,
  dataIndex?: string,
  dataType?: "number" | "text" | "boolean",
  title?: string,
  width?: string,
  render?: (value: any, record: T, index: number) => React.ReactNode
}

declare type EditableTableProps = {
  columns?: ColumnType<object>[],
  rowKey?: string,
  dataSource?: object[],
  // isEditingFn: (record: any, number: number) => boolean,
}

export const EditableTable = (props: EditableTableProps) => {
	const [form] = Form.useForm();
	const [data, setData] = useState<any>();
	const [editingKey, setEditingKey] = useState("");
	const isEditing = (record: any) => record.key === editingKey;

	const edit = (record: any & { key: React.Key }) => {
		form.setFieldsValue({ ...record });
		setEditingKey(record.key);
	};
	const cancel = () => {
		setEditingKey("");
	};
	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields());

			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setData(newData);
				setEditingKey("");
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const columns = props.columns?.concat([{
		dataIndex: "operation",
		render: (_: any, record: any) => {
			return isEditing(record) ? (
				<span>Save</span>
			) :
				(
					<span onClick={() => edit(record)}>Edit</span>
				);
		}
	}]);
	const mergedColumns = columns?.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: object) => ({
				record,
				inputType: col.dataType,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});
	return (
		<Form form={form} component={false}>
			<Table
				size="small"
				rowClassName={"editable-table-row"}
				components={{
					body: {
						cell: EditableCell,
					}
				}}
				bordered
				dataSource={props.dataSource}
				rowKey={props.rowKey}
				columns={mergedColumns}
			/>
		</Form>
	);
};