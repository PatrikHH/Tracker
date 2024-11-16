import "./MeasurementRenameButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementRenameButton = ({ openModal, isNight}) => {
    return (
        <>
            <Button className={`${isNight ? "rename-button-night" : "rename-button-day"}`} onClick={openModal}>Rename</Button>
        </>
    )
}

export default MeasurementRenameButton