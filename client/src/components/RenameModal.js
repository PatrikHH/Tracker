/**
 * Represents a modal window for renaming measurement component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentTitle  - Current name of the measurement.
 * @param {string} props.newTitle - New name of the measurement.
 * @param props.setNewTitle - Sets new name of the measurent.
 * @param props.renameMeasuremen - Function for renaming measurement.
 * @param {boolean} props.isModalOpen - Switcher for opening modal window.
 * @param props.closeModal - Closes modal window and deletes nameing error.
 * @param {string} props.error - Error during renaming of the measurement.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} A modal window for renaming measurement.
 * 
 * @variable (boolean) isClosing - Modal window is closing.
 * @variable (string) classForInput - Styles the input for renaming the measurement.
 * @variable (boolean) validationFirstRun - Prevents validation of the new measurement name when opening the modal window.
 */

import './RenameModal.css'
import {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

const RenameModal = ({ currentTitle, newTitle, setNewTitle, renameMeasurement, isModalOpen, closeModal, error, isNight}) => {
    const [isClosing, setIsClosing] = useState(false)
    const [classForInput, setClassForInput] = useState("form-control")
    const [validationFirstRun, setValidationFirstRun] = useState(true)

    /**
    * @handleCloseWithAnimation - Animates modal window closing and deletes nameing error.
    * @param onCloseCallback - Content is "renameMeasurement" (renames the measurement)
    */
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


