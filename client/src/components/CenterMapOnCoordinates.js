
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