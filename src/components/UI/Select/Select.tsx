import { theme } from "@/styles/theme"
import { OptionStyle, SelectStyle } from "./SelectStyle";
import { SelectProps } from "antd";

const dropDownStyle = {
    backgroundColor: '#FFF', //theme.primaryContrast,
    borderRadius: '0px',
    border: '1px solid #d9d9d9',
    overflow: 'hidden',
    boxShadow: 'none',
};
const dropDownListItemStyle = {
    backgroundColor: '#FFF'
};

export declare type MySelectProps = SelectProps & {
	values: any[];
	keyProperty: string;
	textProperty: string;
	$block?: boolean;
};

export const Select = (props: MySelectProps) => {
    const { values, keyProperty, textProperty, onChange, ...rest } = props;
    return (
        <SelectStyle
            {...rest}
            dropdownStyle={dropDownStyle}
            onChange={onChange as any}
            options={values?.map((value: any) => (
                {value: value[keyProperty], label: value[textProperty]}
                // <OptionStyle
                //     key={value[keyProperty]}
                //     value={value[keyProperty]}
                //     style={dropDownListItemStyle}>
                //     {value[textProperty]}
                // </OptionStyle>
            ))}>

        </SelectStyle>
    )
};