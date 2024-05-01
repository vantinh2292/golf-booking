import React from 'react';

interface TimeDivProps {
    time: string;
    status: string;
    index: number;
    selectTime: (time: string) => void;
}

const TimeDiv: React.FC<TimeDivProps> = ({ time, index, status, selectTime }) => {
    return (
        <div
            onClick={() => {
                selectTime(time)
            }}
            key={index}
            style={{
                width: 100,
                height: 70,
                borderRadius: 5,
                border: '2px solid black',
                margin: 5,
                display: 'grid',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: status == 'Empty' ? '' : status == '4' ? 'rgb(237 105 105)' : '#00ced1'

            }}
        >
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {time}
            </div>
            <div>
                {status}
            </div>
        </div>
    );
};

export default TimeDiv;