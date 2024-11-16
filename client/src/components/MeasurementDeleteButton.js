import "./MeasurementDeleteButton.css"
import Button from 'react-bootstrap/Button'

const MeasurementDeleteButton = ({ deleteMeasurement, isNight }) => {
    return (
        <>
            <Button className={`${isNight ? "delete-button-night" : "delete-button-day"}`} onClick={(e) => deleteMeasurement(e)}>Delete</Button>
        </>
    )
}

export default MeasurementDeleteButton