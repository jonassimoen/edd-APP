import { useTranslation } from "react-i18next"
import { ContainerStyle, TableStyle } from "../PlayerList/PlayerListStyle"
import React from "react"

type TransfersListProps = {
    data: any
    size: number
    isLoading?: boolean
    showHeader?: boolean
    showWeek?: boolean
    tax?: number | undefined
}

export const TransfersList = (props: TransfersListProps) => {
    const { t } = useTranslation();

    const {data,size, isLoading, showHeader, showWeek} = props;
    const columns = [
        {
            title: '#',
            key: 'number',
            dataIndex: 'number',
            width: '20%',
            render: (txt: string, rec: any, idx: number) => {
                return <b>{idx + 1}</b>;
            },
        },
        {
            title: t('team.transferOut'),
            key: 'outPlayer',
            dataIndex: 'outPlayer',
            width: showWeek ? '30%' : '40%',
            render: (txt: string, rec: any, idx: number) => {
                const playerName = (rec.outPlayer && `${rec.outPlayer.short}`) || '';
                return (
                    <React.Fragment>
                        <span style={{display: 'block', fontSize: '12px'}}>
                            {playerName}
                        </span>
                    </React.Fragment>
                );
            },
        },
        {
            title: t('team.transferIn'),
            key: 'inPlayer',
            dataIndex: 'inPlayer',
            width: showWeek ? '30%' : '40%',
            render: (txt: string, rec: any, idx: number) => {
                const playerName = (rec.inPlayer && `${rec.inPlayer.short}`) || '';
                return (
                    <React.Fragment>
                        <span style={{ fontSize: '12px'}}>
                            {playerName}
                        </span>
                    </React.Fragment>
                );
            },
        },
    ];

    if(showWeek) {
        columns.push({
            key: 'weeId',
            title: t('general.footballWeek'),
            width: '20%',
            dataIndex: 'weekId',
            render: (text: string, team: any) => {
                return <b>{text}</b>;
            }
        })
    };

    return (
        <ContainerStyle>
            <TableStyle
                columns={columns}
                dataSource={data}
                showHeader={showHeader}
                locale={{emptyText: t('transferPage.noTransfersTableMessage')}}
                loading={isLoading}
                pagination={data.length > size ? { pageSize: size } : false}
                rowKey={(rec: any, idx: number) => `record-${idx+1}`}
                rowClassName={(rec: object, idx: number) => idx%2 ? 'ant-table-row--odd' : 'ant-table-row--even'}
            />
        </ContainerStyle>
    );
}