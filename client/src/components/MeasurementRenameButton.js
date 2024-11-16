/**
 * Represents a rename button component. 
 * 
 * @component
 * @param {Object} props - The component props.
 * @param props.openModal - Opens modal window for renaming measurement.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} A rename button.
 */

import "./MeasurementRenameButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementRenameButton = ({ openModal, isNight}) => {
    return (
        <Button className={`${isNight ? "rename-button-night" : "rename-button-day"}`} onClick={openModal}>Rename</Button>
    )
}

export default MeasurementRenameButton