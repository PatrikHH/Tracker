/**
 * Represents a delete button component. 
 * 
 * @component
 * @param {Object} props - The component props.
 * @param props.deleteMeasurement - Deletes measurement.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} A delete button.
 */

import "./MeasurementDeleteButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementDeleteButton = ({ deleteMeasurement, isNight }) => {
    return (
        <Button className={`${isNight ? "delete-button-night" : "delete-button-day"}`} onClick={(e) => deleteMeasurement(e)}>Delete</Button>
    )
}

export default MeasurementDeleteButton