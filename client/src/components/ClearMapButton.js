/**
 * Represents remove all markers from the map component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param props.clearMap - Clears markers from the map.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} A clear map button.
 */

import Button from 'react-bootstrap/Button'
import "./ClearMapButton.css"
const ClearMapButton = ({ clearMap, isNight }) => {
    return (
        <Button className={`${isNight ? "clear-button-night" : "clear-button-day"}`} onClick={() => clearMap()}>Clear map</Button>
    )
}

export default ClearMapButton