import Button from 'react-bootstrap/Button'
import "./ClearMapButton.css"
const ClearMapButton = ({ clearMap, isNight }) => {
    return (
        <>
            <Button className={`${isNight ? "clear-button-night" : "clear-button-day"}`} onClick={() => clearMap()}>Clear map</Button>
        </>
    )
}

export default ClearMapButton