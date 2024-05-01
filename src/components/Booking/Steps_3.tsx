import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
import type { DatePickerProps, SliderSingleProps, CheckboxProps, GetProp } from 'antd';
import { ConfigProvider, Button, message, Steps, theme, DatePicker, Slider, Input, Checkbox } from 'antd';
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
type CheckboxValueType = GetProp<typeof Checkbox.Group, 'value'>[number];
const CheckboxGroup = Checkbox.Group;

import { Spacer } from "@nextui-org/react";
import My_divider from '../../app/Booking/TeeTime/my_divider';
import { Database } from '../../../firebase';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';

interface TimeDivProps {
    datePicker: string;
    selectedTime: string;
    listBookingData: IListBookingData[];
    next: () => void;
}

const Steps_3: React.FC<TimeDivProps> = ({ datePicker, selectedTime, listBookingData, next }) => {
    const [nameInformation, setNameInformation] = useState<string>('')
    const [emailInformation, setEmailInformation] = useState<string>('')
    const [telInformation, setTelInformation] = useState<string>('')
    const [currentIndexOrder, setCurrentIndexOrder] = useState<number>(0)
    const [serviceCaddie, setServiceCaddie] = useState<boolean>(false)
    const [serviceClubRental, setServiceClubRental] = useState<boolean>(false)

    const onChangeServiceCaddie: CheckboxProps['onChange'] = (e) => {
        setServiceCaddie(!serviceCaddie)
    };
    const onChangeServiceClubRental: CheckboxProps['onChange'] = (e) => {
        setServiceClubRental(!serviceClubRental)
    };

    const [startNumberPlayer, setStartNumberPlayer] = useState<number>(0)
    const [numberPlayer, setNumberPlayer] = useState<number>(1)
    const [namePlayer1, setNamePlayer1] = useState<string>('')
    const [namePlayer2, setNamePlayer2] = useState<string>('')
    const [namePlayer3, setNamePlayer3] = useState<string>('')
    const [namePlayer4, setNamePlayer4] = useState<string>('')
    const handleChangeNameInformation = (event: ChangeEvent<HTMLInputElement>) => {
        setNameInformation(event.target.value);
    }
    const handleChangeEmailInformation = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailInformation(event.target.value);
    }
    const handleChangeTelInformation = (event: ChangeEvent<HTMLInputElement>) => {
        setTelInformation(event.target.value);
    }
    useEffect(() => {
        listBookingData.forEach(element => {
            if (element.selectTime === selectedTime) {
                setStartNumberPlayer(element.numberPlayer)
                setNumberPlayer(element.numberPlayer)
                setNamePlayer1(element.namePlayer1.name)
                setNamePlayer2(element.namePlayer2.name)
                setNamePlayer3(element.namePlayer3.name)
                setNamePlayer4(element.namePlayer4.name)
                if (element.ContactInfo.length > 0) {
                    setCurrentIndexOrder(element.ContactInfo.length)
                }
            }
        });
    }, [selectedTime, listBookingData]);
    ///////////////////////////////////SLIDE///////////////////////////////////////
    const marks: SliderSingleProps['marks'] = {
        1: '1 Player(s)',
        2: '2 Player(s)',
        3: '3 Player(s)',
        4: {
            style: {
                width: '100%'
            },
            label: '4 Player(s)'
        },
    };
    let widthInside = 300
    const AddBooking = () => {
        if (nameInformation.length == 0 || telInformation.length == 0) {
            toast.warning('Name and telephone information are required');
            return;
        }

        if (startNumberPlayer == numberPlayer) {
            toast.warning('Select the number of players to Booking');
            return;
        }

        // Check if the number of namePlayer entries from startNumberPlayer to numberPlayer is correct
        const namePlayers = [namePlayer1, namePlayer2, namePlayer3, namePlayer4];
        const validNamePlayers = namePlayers.slice(startNumberPlayer, numberPlayer);
        if (validNamePlayers.some(name => !name)) {
            toast.warning('Please provide all player names');
            return;
        }

        if (datePicker.length > 0 && selectedTime.length > 0) {
            const setRef = ref(Database, "Booking/Data/" + datePicker + '/' + selectedTime);
            get(setRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (snapshot.hasChild('ContactInfo')) {
                        // Create a copy of ContactInfo
                        let updatedContactInfo = [...newData.ContactInfo];

                        // Push new data to the copy
                        updatedContactInfo.push({
                            // Replace with actual data
                            nameInformation,
                            emailInformation,
                            telInformation,
                            serviceCaddie,
                            serviceClubRental,
                        });

                        // Create a copy of the existing namePlayer data
                        let updatedNamePlayers = {
                            namePlayer1: newData.namePlayer1,
                            namePlayer2: newData.namePlayer2,
                            namePlayer3: newData.namePlayer3,
                            namePlayer4: newData.namePlayer4,
                        };
                        // Update the namePlayer data for the new players
                        if (startNumberPlayer <= 0) {
                            updatedNamePlayers.namePlayer1 = { name: namePlayer1, indexOrder: currentIndexOrder };
                        }
                        if (startNumberPlayer <= 1) {
                            updatedNamePlayers.namePlayer2 = { name: namePlayer2, indexOrder: currentIndexOrder };
                        }
                        if (startNumberPlayer <= 2) {
                            updatedNamePlayers.namePlayer3 = { name: namePlayer3, indexOrder: currentIndexOrder };
                        }
                        if (startNumberPlayer <= 3) {
                            updatedNamePlayers.namePlayer4 = { name: namePlayer4, indexOrder: currentIndexOrder };
                        }


                        set(setRef,
                            {
                                ...newData,
                                ContactInfo: updatedContactInfo,
                                numberPlayer: numberPlayer,
                                selectTime: selectedTime,
                                ...updatedNamePlayers
                            })
                    } else {
                        set(setRef,
                            {
                                ContactInfo: [{
                                    nameInformation, emailInformation, telInformation, serviceCaddie, serviceClubRental
                                }],
                                numberPlayer: numberPlayer,
                                selectTime: selectedTime,
                                namePlayer1: { name: namePlayer1, indexOrder: currentIndexOrder },
                                namePlayer2: { name: namePlayer2, indexOrder: currentIndexOrder },
                                namePlayer3: { name: namePlayer3, indexOrder: currentIndexOrder },
                                namePlayer4: { name: namePlayer4, indexOrder: currentIndexOrder },
                            })
                    }
                    next()
                } else {
                    const setRef = ref(Database, "Booking/Data/" + datePicker + '/' + selectedTime);
                    set(setRef,
                        {
                            ContactInfo: [{
                                nameInformation, emailInformation, telInformation, serviceCaddie, serviceClubRental
                            }],
                            numberPlayer: numberPlayer,
                            selectTime: selectedTime,
                            namePlayer1: { name: namePlayer1, indexOrder: currentIndexOrder },
                            namePlayer2: { name: namePlayer2, indexOrder: currentIndexOrder },
                            namePlayer3: { name: namePlayer3, indexOrder: currentIndexOrder },
                            namePlayer4: { name: namePlayer4, indexOrder: currentIndexOrder },
                        })
                }
            })
            toast.success('Create New Course Success');
        }
    }
    return (
        <>
            <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700 inline-block auto"
                style={{ height: 'calc(100%-0px)' }}>
                <div>
                    <div style={{
                        width: 500, textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>
                        Contact Information:
                    </div>
                    <Spacer y={1} />
                    <div style={{ width: '100%', textAlign: 'left' }}>Name: (*)</div>
                    <Input
                        style={{ textAlign: 'center', color: 'black' }}
                        type="text"
                        placeholder=""
                        value={nameInformation}
                        onChange={handleChangeNameInformation}
                    />

                    <Spacer y={1} />
                    <div style={{ width: '100%', textAlign: 'left' }}>Telephone: (*)</div>
                    <Input
                        style={{ textAlign: 'center', color: 'black' }}
                        type="text"
                        placeholder=""
                        value={telInformation}
                        onChange={handleChangeTelInformation}
                    />

                    <Spacer y={1} />
                    <div style={{ width: '100%', textAlign: 'left' }}>Email:</div>
                    <Input
                        style={{ textAlign: 'center', color: 'black' }}
                        type="text"
                        placeholder=""
                        value={emailInformation}
                        onChange={handleChangeEmailInformation}
                    />

                    <Spacer y={1} />
                    <div style={{ width: '100%', textAlign: 'left' }}>Other Services:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Checkbox onChange={onChangeServiceCaddie} value={serviceCaddie}>Caddie</Checkbox>
                        <Checkbox onChange={onChangeServiceClubRental} value={serviceClubRental}>Club Rental</Checkbox>
                    </div>
                </div>

                <div>
                    <div style={{
                        width: 500, textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>
                        Booking Information:
                    </div>
                    <div style={{ width: '85%', margin: 'auto' }}>
                        <Slider
                            max={4}
                            min={1}
                            marks={marks}
                            included={true}
                            value={numberPlayer}
                            onChange={(value) => { setNumberPlayer(value) }}
                        />
                    </div>

                    {
                        numberPlayer >= 1 && (
                            <>
                                <Spacer y={1} />
                                <div></div>
                                <Input
                                    style={{ textAlign: 'center', color: 'red', textShadow: '1px 1px 1px #7b0000' }}
                                    type="text"
                                    placeholder="Player 1 (*)"
                                    disabled={startNumberPlayer > 1}
                                    value={startNumberPlayer >= 1 ? 'Registered' : namePlayer1}
                                    onChange={(value) => { setNamePlayer1(value.target.value) }}
                                />
                            </>
                        )
                    }
                    {
                        numberPlayer >= 2 && (
                            <>
                                <Spacer y={1} />
                                <Input
                                    style={{ textAlign: 'center', color: 'red', textShadow: '1px 1px 1px #7b0000' }}
                                    type="text"
                                    placeholder="Player 2 (*)"
                                    disabled={startNumberPlayer >= 2}
                                    value={startNumberPlayer >= 2 ? 'Registered' : namePlayer2}
                                    onChange={(value) => { setNamePlayer2(value.target.value) }}
                                />
                            </>
                        )
                    }
                    {
                        numberPlayer >= 3 && (
                            <>
                                <Spacer y={1} />
                                <Input
                                    style={{ textAlign: 'center', color: 'red', textShadow: '1px 1px 1px #7b0000' }}
                                    type="text"
                                    placeholder="Player 3 (*)"
                                    disabled={startNumberPlayer >= 3}
                                    value={startNumberPlayer >= 3 ? 'Registered' : namePlayer3}
                                    onChange={(value) => { setNamePlayer3(value.target.value) }}
                                />
                            </>
                        )
                    }
                    {
                        numberPlayer >= 4 && (
                            <>
                                <Spacer y={1} />
                                <Input
                                    style={{ textAlign: 'center', color: 'red', textShadow: '1px 1px 1px #7b0000' }}
                                    type="text"
                                    placeholder="Player 4 (*)"
                                    disabled={startNumberPlayer >= 4}
                                    value={startNumberPlayer >= 4 ? 'Registered' : namePlayer4}
                                    onChange={(value) => { setNamePlayer4(value.target.value) }}
                                />
                            </>
                        )
                    }
                </div>
                <Spacer y={1} />
                <My_divider />
                <Spacer y={1} />

                <Button type="primary" danger onClick={() => AddBooking()}
                    style={{ width: '100%' }}>
                    Booking Now
                </Button>
            </div >

        </>
    )
};

export default Steps_3;