import "./MeasurementAddToDbButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementAddToDbButton = ({ addToDbMeasurement, isInDb, isNight}) => {
    return (
        <Button className={`${isInDb ? (isNight ? "button-disabled-night" : "button-disabled-day") : (isNight ? "add-button-night" : "add-button-day")}`
        } onClick={(e) => addToDbMeasurement(e)} disabled={isInDb}>{isInDb ? "In the DB" : "Add to the DB"}</Button>
    )
}

export default MeasurementAddToDbButton