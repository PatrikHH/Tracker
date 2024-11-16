/**
 * Represents centering map component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {double} props.latitude - Latitude of the first point of measurement.
 * @param {double} props.longitude - Longitude of the first point of measurement.
 */

import { useEffect } from "react"
import { useMap } from 'react-leaflet'

const CenterMapOnCoordinates = ({latitude, longitude}) => {
    const map = useMap()

    useEffect(() => {
        if (latitude && longitude) {
            map.setView([latitude, longitude], map.getZoom(), { animate: true })
        }
    }, [latitude, longitude, map])

    return null
}

export default CenterMapOnCoordinates