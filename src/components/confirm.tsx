import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './page.module.css'
interface Props {
    show: boolean,
    title: string,
    content: string,
    setShowConfirm: (value: boolean) => void,
    callCommand: () => void
}

function Confirm(props: Props) {
    return (
        <Modal
            data-bs-theme="dark"
            show={props.show}
            backdrop="static"
            keyboard={false}
            centered
            onHide={() => props.setShowConfirm(false)}
        >

            <Modal.Header closeButton>
                <Modal.Title style={{ color: '#adb5bd', fontSize: 17, fontWeight: 'bold' }}>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: 24, color: 'azure' }}>
                {props.content}
            </Modal.Body>
            <Modal.Footer>
                <Button style={{ width: 100 }} variant="outline-warning" onClick={() => props.setShowConfirm(false)}>
                    NO
                </Button>
                <Button
                    style={{ width: 100 }}
                    onClick={
                        () => {
                            props.callCommand()
                            props.setShowConfirm(false)
                        }
                    }
                    variant="outline-success">YES</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default Confirm;