import React from 'react';
import type { DatePickerProps, SliderSingleProps } from 'antd';
import { ConfigProvider, Button, message, Steps, theme, DatePicker, Slider, Input } from 'antd';
import dayjs from 'dayjs';


interface TimeDivProps {
    datePicker: string;
    onChangeDatePicker: (date: dayjs.Dayjs, dateString: string | string[]) => void;
}

const Steps_1: React.FC<TimeDivProps> = ({ datePicker, onChangeDatePicker }) => {
    const dateFormat = 'DD-MM-YYYY';

    return (
        <>
            <DatePicker
                format={dateFormat}
                defaultValue={datePicker ? dayjs(datePicker, dateFormat) : undefined}
                onChange={onChangeDatePicker} />
        </>
    );
};

export default Steps_1;