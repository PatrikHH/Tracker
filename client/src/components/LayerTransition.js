/**
 * Represents a switch between day and night map component. 
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isNight - Switcher for night view.
 * 
 * @variable (Object) map - Leaflet map instances.
 * @variable (Object) nightLayer - A night layer of the map.
 * @variable (Object) dayLayer - A day layer of the map.
 * @variable (boolean) mapFirstRun - prevents the map from flashing when the map is first rendered.
 */

import { useState, useEffect } from "react"
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const LayerTransition = ({ isNight }) => {
    const map = useMap()
    const [nightLayer, setNightLayer] = useState(null)
    const [dayLayer, setDayLayer] = useState(null)
    const [mapFirstRun, setMapFirstRun] = useState(true)

    useEffect(() => {
        const nightLayerInstance = L.tileLayer(
            "https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=oMR88HIZLWXss5dktbAOSq1PfXDSkXrfWLOpX9vXrnlNv7U3Eo3zLUU8OGIGgBld",
        ).addTo(map)
        const dayLayerInstance = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ).addTo(map)

        setNightLayer(nightLayerInstance)
        setDayLayer(dayLayerInstance)

        return () => {
            nightLayerInstance.remove()
            dayLayerInstance.remove()
        }
    }, [map])

    useEffect(() => {
        if (nightLayer && dayLayer) {
            if (mapFirstRun) {
                nightLayer.setOpacity(isNight ? 1 : 0)
                dayLayer.setOpacity(isNight ? 0 : 1)
                setMapFirstRun(false)
            } else {
                const transitionDuration = 400
                const steps = 100
                const delay = transitionDuration / steps

                for (let i = 0; i <= steps; i++) {
                    const opacity = i / steps
                    setTimeout(() => {
                        nightLayer.setOpacity(isNight ? opacity : 1 - opacity)
                        dayLayer.setOpacity(isNight ? 1 - opacity : opacity)
                    }, i * delay)
                }
            }
        }
    }, [isNight, nightLayer, dayLayer])
    
    return null
}

export default LayerTransition