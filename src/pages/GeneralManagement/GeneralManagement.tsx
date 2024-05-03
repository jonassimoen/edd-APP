import { Button } from "@/components/UI/Button/Button";
import { FormItem } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Select } from "@/components/UI/Select/Select";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useGetGeneralInfoQuery, usePostClubWinnerMutation } from "@/services/generalApi";
import { Form, List, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import { title } from "process";
import { useState } from "react";
import { useSelector } from "react-redux";

export const GeneralManagement = () => {
	const {data} = useGetGeneralInfoQuery() as any;
	const [open, setOpen] = useState<boolean>(false);
	const application = useSelector((state: StoreState) => state.application);
	const [form] = Form.useForm();
	const [setWinner] = usePostClubWinnerMutation();

	const onSubmitWinner = (event: any) => {
		form
			.validateFields()
			.then((obj) => {
				setWinner(obj)
					.unwrap()
					.then(() => openSuccessNotification({title: "Winnaar succesvol gewijzigd."}))
					.catch(() => openErrorNotification({title: "Something went wrong"}));
				setOpen(false);
			})
			.catch((err) => {
				// todo: display notification
				console.log("Error while creating:", err);
			});
	};

	return (
		<>
			<Row align='middle'>
				<Title level={2}>General management</Title>
				<Col md={18}>
					<table>
						<tbody>
							<tr>
								<td><b>Aantal gebruikers: </b></td> 
								<td>{data?.userCount || 0}</td>
							</tr>
							<tr>
								<td><b>Aantal teams: </b></td> 
								<td>{data?.teamCount || 0}</td>
							</tr>
							<tr>
								<td><b>Winnaar: </b></td> 
								<td>{data?.clubWinner?.name || "-"}</td>
							</tr>
						</tbody>
					</table>
				</Col>
				<Col md={6}>
					<Button
						type="primary"
						onClick={() => setOpen(!open)}
					>
						Update winnaar
					</Button>
				</Col>
			</Row>
			<Row align='middle'>
				<Title level={2}>User management</Title>
				<Col md={18}>
					<ul>
						{
							data?.users?.filter((u: any) => !u?.payed)
								.map((u: any) => <li key={u.email}>{u.email}</li>)
						}
					</ul>
				</Col>
			</Row>
			<Row align='middle'>
			</Row>
			<Modal 
				open={open}
				onOk={onSubmitWinner}
				onCancel={() => setOpen(false)}
			>
				<Form
					colon={false}
					form={form}
					layout="vertical"
					name={"modal_form_winner"}
					
				>
					<FormItem
						label={"Winnaar"}
						name={"clubWinner"}
					>
						<Select
							keyProperty="value"
							textProperty="label"
							// values={[{value: 1, label: "A"},{value: 2, label: "B"},{value: 3, label: "C"}]}
							values={application.clubs.map((c: Club) => ({value: c.id, label: c.name }))}
						/>
					</FormItem>
				</Form>
			</Modal>
		</>
	);
};