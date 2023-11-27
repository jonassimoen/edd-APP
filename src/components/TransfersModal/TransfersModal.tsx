import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayerModalStyle } from "../PlayerModal/PlayerModalStyle";
import Icon from "@ant-design/icons";
import { DeleteButtonSvg } from "@/styles/custom-icons";
import { Row } from "../UI/Grid/Grid";
import { TableStyle } from "../PlayerStatsList/PlayerStatsListStyle";

const ExitIcon = (props: any) => <Icon component={DeleteButtonSvg} {...props} />;

declare type TransfersModalProps = {
    visible: boolean
    onCancel: any
    transfers?: any[]
}

declare type TransfersModalState = {

}

export const TransfersModal = (props: TransfersModalProps) => {
    const [state, setState] = useState<TransfersModalState>();
    const { t } = useTranslation();
    const { transfers } = props;

    const title = <div className={'custom-title-container'}>
        <ExitIcon onClick={props.onCancel} />
    </div>

    const columns = [
        {
            key: 'id',
            width: '10%',
            title: '#',
            dataIndex: 'id',
            render: (txt: string, record: any, index: number) => {
                return <b>{index + 1}</b>;
            }
        },
        {
            key: 'outId',
            width: '45%',
            title: t('team.transferOut'),
            dataIndex: 'outId',
            render: (txt: string, record: any) => {
                return <b>{record.outPlayer && record.outPlayer.name}</b>;
            }
        },
        {
            key: 'outId',
            width: '45%',
            title: t('team.transferIn'),
            dataIndex: 'inId',
            render: (txt: string, record: any) => {
                return <b>{record.inPlayer && record.inPlayer.name}</b>;
            }
        },
    ]

    return (
        <PlayerModalStyle
            title={title}
            closable={false}
            open={props.visible}
            onCancel={props.onCancel}
            footer={[]}
        >
            <Row>
                <TableStyle
                    columns={columns}
                    dataSource={transfers}
                    showHeader={true}
                    locale={{ emptyText: 'Geen transfers doorgevoerd.' }}
                    loading={false}
                    pagination={false}
                    rowKey={(record: any) => `record-${record.id + 1}`}
                    rowClassName={(record: object, index: number) => index % 2 ? 'ant-table-row--odd' : 'ant-table-row--even'}
                />
            </Row>
        </PlayerModalStyle>
    )
}