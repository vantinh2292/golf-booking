'use client'
import React, { useMemo, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './page.module.css'
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { Database } from '../../../firebase';
import { PropaneSharp } from '@mui/icons-material';
import { propagateServerField } from 'next/dist/server/lib/render-server';
import Page_ViewTableScore from './page_viewTableScore';
import My_divider from './my_divider';
import { Spacer } from "@nextui-org/react";
interface Props {
    show: boolean,
    course_name: string,
    setShowConfirm: (value: boolean) => void,
}

function ViewAllScoreCard(props: Props) {
    const dbRef = ref(Database);
    const [listGolfSetupCourse, setListGolfSetupCourse] = useState<IGolfSetupCourse[]>([])
    useEffect(
        () => {
            if (props.course_name.length > 0 && props.show) {
                get(child(dbRef, "TSN/Score/GolfSetup/" + props.course_name + '/Course')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        generate_list_order_course(newData)
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
        , []
    );
    const generate_list_order_course = (data: IListGolfSetupCourse | null) => {
        let temp_list: IGolfSetupCourse[] = []
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
                temp_list.push({
                    NameCourse: property,
                    NumberTeeBox: data[property].NumberTeeBox,
                    HDC: data[property].HDC,
                    PAR: data[property].PAR,
                    Tee1: data[property].Tee1,
                    Tee2: data[property].Tee2,
                    Tee3: data[property].Tee3,
                    Tee4: data[property].Tee4,
                    Tee5: data[property].Tee5,
                    Tee6: data[property].Tee6
                })
            }
        }
        setListGolfSetupCourse(temp_list)
    }
    const fnScoreCard_View = () => {
        return (
            <>
                {listGolfSetupCourse.map((element, index) => {
                    return (
                        <>
                            <div style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>{element.NameCourse}</div>
                            <Page_ViewTableScore courseInformation={element} key={index} />
                            <Spacer y={1} />
                            <My_divider />
                            <My_divider />
                            <Spacer y={1} />
                        </>

                    )
                })}
            </>

        )
    }
    return (
        <Modal
            data-bs-theme="dark"
            show={props.show}
            // backdrop="static"
            // keyboard={false}
            centered
            size="lg"
            onHide={() => props.setShowConfirm(false)}
        >

            <Modal.Header closeButton>
                <Modal.Title style={{ color: '#adb5bd', fontSize: 17, fontWeight: 'bold' }}>{props.course_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: 24, color: 'azure', backgroundColor: 'darkgray' }}>
                {fnScoreCard_View()}
            </Modal.Body>
        </Modal >
    );
}

export default ViewAllScoreCard;