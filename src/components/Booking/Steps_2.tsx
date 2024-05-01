import React, { useEffect } from 'react';
import type { DatePickerProps, SliderSingleProps } from 'antd';
import { ConfigProvider, Button, message, Steps, theme, DatePicker, Slider, Input } from 'antd';
import dayjs from 'dayjs';
import TimeDiv from './TimeDiv';
import DownloadExcel from '@/components/Booking/DownloadExcel/page';

interface TimeDivProps {
    listBookingData: IListBookingData[];
    selectTime: (time: string) => void;
}

const Steps_2: React.FC<TimeDivProps> = ({ listBookingData, selectTime }) => {
    const generateTimes = () => {
        const times = [];
        let time = dayjs().hour(5).minute(0);

        while (time.hour() < 22 || (time.hour() === 22 && time.minute() === 0)) {
            times.push(time.format('HH:mm'));
            time = time.add(12, 'minute');
        }

        return times;
    };
    const times = generateTimes();

    const reportData = {
        title: 'TEE TIME BOOKING',
        data: times.map((time, index) => {
            let numberOfPlayers = '0';
            let player1 = '';
            let player2 = '';
            let player3 = '';
            let player4 = '';
            let contactPerson = '';
            let telPerson = '';
            let emailPerson = '';
            let otherSerivce = '';

            listBookingData.forEach(element => {
                if (element.selectTime === time) {
                    numberOfPlayers = element.numberPlayer.toString();
                    player1 = element.namePlayer1.name;
                    player2 = element.namePlayer2.name;
                    player3 = element.namePlayer3.name;
                    player4 = element.namePlayer4.name;
                    contactPerson = element.ContactInfo ? element.ContactInfo.map(info => info.nameInformation).join('\n') : '';
                    telPerson = element.ContactInfo ? element.ContactInfo.map(info => info.telInformation).join('\n') : '';
                    emailPerson = element.ContactInfo ? element.ContactInfo.map(info => info.emailInformation).join('\n') : '';
                    otherSerivce = element.ContactInfo ? element.ContactInfo.map(info => (info.serviceCaddie ? 'Caddie' : '') + ((info.serviceCaddie && info.serviceClubRental) ? ' - ' : '') + (info.serviceClubRental ? 'Club Rental' : '')).join('\n') : '';
                }
            });
            return { index, time, numberOfPlayers, player1, player2, player3, player4, contactPerson, telPerson, emailPerson, otherSerivce };
        }),
        headers: ['index', 'time', 'numberOfPlayers', 'player1', 'player2', 'player3', 'player4', 'contactPerson', 'telPerson', 'emailPerson', 'otherSerivce'],
        titleHeaders: ['No', 'TEE OF TIME', 'NUMBER OF PLAYERS', 'PLAYER 1', 'PLAYER 2', 'PLAYER 3', 'PLAYER 4', 'CONTACT PERSON', 'TEL', 'EMAIL', 'OTHER SERVICE'],
        columnWidth: [6, 15, 15, 15, 15, 15, 15, 25, 15, 15, 20]
    };
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            <DownloadExcel reportData={reportData} />
            {times.map((time, index) => {
                if (listBookingData) {
                    let status = 'Empty';
                    listBookingData.forEach(element => {
                        if (element.selectTime === time) {
                            status = element.numberPlayer.toString();
                        }
                    });
                    return <TimeDiv key={index} time={time} index={index} status={status} selectTime={selectTime} />

                } else {
                    return <TimeDiv key={index} time={time} index={index} status='Empty' selectTime={selectTime} />
                }
            })}
        </div>
    );
};

export default Steps_2;