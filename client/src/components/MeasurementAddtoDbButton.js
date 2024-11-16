/**
 * Represents an add to database button component. 
 * 
 * @component
 * @param {Object} props - The component props.
 * @param props.addToDbMeasurement - Adds measurement to the database.
 * @param {boolean} props.isInDb - A record of whether the measurement is in the database.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} An add to database button.
 */

import "./MeasurementAddToDbButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementAddToDbButton = ({ addToDbMeasurement, isInDb, isNight}) => {
    return (
        <Button className={`${isInDb ? (isNight ? "button-disabled-night" : "button-disabled-day") : (isNight ? "add-button-night" : "add-button-day")}`
        } onClick={(e) => addToDbMeasurement(e)} disabled={isInDb}>{isInDb ? "In the DB" : "Add to the DB"}</Button>
    )
}

export default MeasurementAddToDbButton