import './RenameModal.css'
import {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

const RenameModal = ({ currentTitle, newTitle, setNewTitle, renameMeasurement, isModalOpen, closeModal, error, isNight}) => {
    const [isClosing, setIsClosing] = useState(false)
    const [classForInput, setClassForInput] = useState("form-control")
    const [validationFirstRun, setValidationFirstRun] = useState(true)
    const handleCloseWithAnimation = (onCloseCallback) => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            setNewTitle("")
            closeModal()
            if (onCloseCallback) {
                onCloseCallback()
            }
        }, 300)
    }

    useEffect(() => {
        setClassForInput(`form-control ${error === " " || validationFirstRun ? "" : "is-invalid"}`)
        if (validationFirstRun) {
            setValidationFirstRun(false)
        }
        
    }, [error,newTitle])
    
    return ( 
        <div>
            <Modal show={isModalOpen} onHide={() => handleCloseWithAnimation()} aria-labelledby="contained-modal-title-vcenter" className={`rename-modal ${isNight ? "close-button-night" : "close-button-day"} ${isClosing ? 'modal-close' : ''}`} centered>
                <div className={`${isNight ? "modal-night" : ""}`}>
                    <Modal.Header closeButton>
                        <Modal.Title className={`modal-title ${isNight ? "modal-title-night" : "modal-title-day"}`} >Rename measurement of "{currentTitle}"</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label className={`${isNight ? "modal-input-title-night" : "modal-input-title-day"}`}>New measurement name</Form.Label>
                                <Form.Control
                                    className={`${isNight ? "box-input-night" : ""} ${classForInput}`} 
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => {
                                        setNewTitle(e.target.value)
                                    }}
                                    placeholder="write something nice..."
                                />      
                                <pre><p className="error-message">{error}</p></pre>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className={`${isNight ? "modal-foooter-night" : ""}`}>
                        <Button className={`${isNight ? "confirm-button-night" : "btn-success"}`} onClick={() =>  handleCloseWithAnimation(renameMeasurement)} disabled={error !== " "}>Confirm</Button>
                        <Button className={`${isNight ? "cancel-button-night" : "btn-danger"}`} onClick={() => handleCloseWithAnimation()}>Cancel</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div> 
    )
}

export default RenameModal             


