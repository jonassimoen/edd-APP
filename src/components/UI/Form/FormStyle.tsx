import { Form } from "antd";
import styled from "styled-components";

export const FormStyle = styled(Form)`
    .ant-form label {
        line-height: 20px;
    }

    .ant-table-tbody>tr>td {
        padding: 5px !important;
    }

    input.ant-input-number-input {
        padding: 0px;
    }
`;

export const FormItemStyle = styled(Form.Item)`
    .ant-input {
        margin: 0px !important;
    }
`;