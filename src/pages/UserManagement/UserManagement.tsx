import { useGetUsersListQuery, useLazyGetAuditQuery } from "@/services/generalApi";
import { Row, Col, Collapse, Table } from "antd";
import { UserManagementStyle } from "./UserManagementStyle";
import { Button } from "@/components/UI/Button/Button";
import Title from "antd/lib/typography/Title";
import ReactJson from "react-json-view";

export const UserManagement = () => {
	const {data, isLoading} = useGetUsersListQuery();
	const [getAudit, {data: auditDetails}] = useLazyGetAuditQuery();

	const items = [
		{
			key: "userlist",
			label: "Lijst van gebruikers",
			children: (
				<Row align='middle' className="pay-visible">
					<Col md={18}>
						<ul>
							{
								data?.users?.map((u: any) => 
									<li key={u.email} className={`${u.payed?"payed":"non-payed"}`}>{u.firstName} {u.lastName} ({u.email})</li>
								)
							}
						</ul>
					</Col>
				</Row>
			)
		},
		{
			key: "boosterlist",
			label: "Lijst van huidige boosters voor deze speeldag",
			children: (
				<Row align='middle'>
					<Col md={18}>
						<ul>
							{
								data?.activeBoosters?.map((u: any) => 
									<li key={u.user} className={`${u.payed?"payed":"non-payed"}`}><b>{u.user}</b>: {u.boosters?.join(" - ")}</li>
								)
							}
						</ul>
					</Col>
				</Row>
			)
		},
		{
			key: "audit",
			label: "Laatste 50 operaties door gebruikers",
			children: (
				<Table
					loading={isLoading}
					dataSource={data?.audits}
					rowKey={"id"}
					size="small"
					rowClassName={"ant-table-row"}
					pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
					columns={[
						{
							title: "AID",
							dataIndex: "id",
						},
						{
							title: "Gebruiker",
							dataIndex: ["user","email"],
							filters: data?.users.map((val: User) => ({text: val.email, value: val.email})),
							onFilter: (value, record) => record.user.email.indexOf(value as string) === 0
						},
						{
							title: "Actie",
							dataIndex: "action",
						},
						{
							title: "Tijd",
							dataIndex: "timestamp",
						},
						{
							title: "",
							dataIndex: "id",
							render: (value) => (
								<Button
									onClick={() => getAudit(value)}
								>
									Bekijk
								</Button>
							)
						}
					]}
				/>
			)
		},
		{
			key: "audit-details",
			label: "Audit Data",
			children: (
				<Row align='middle'>
					<Col md={18}>
						<Title level={4}>{auditDetails?.action}</Title>
						<ReactJson src={JSON.parse(auditDetails?.params||"{}")} name={null}/>
					</Col>
				</Row>
			)
		}
	];

	return (
		<UserManagementStyle>
			<Collapse items={items} />
		</UserManagementStyle>
	);
};