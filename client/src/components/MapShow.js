import "./MapShow.css"
import CenterMapOnCoordinates from "./CenterMapOnCoordinates"
import LayerTransition from "./LayerTransition"
import ClearMapButton from "./ClearMapButton"
import { useState, useEffect } from "react"
import { MapContainer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const MapShow = ({ selectedMeasurement, setSelectedMeasurement, selectedTitle, setSelectedTitle, isNight }) => {
    const defaultCoordinates = { latitude: 49.2223267, longitude: 16.5849728 }
    const [coordinates, setCoordinates] = useState(defaultCoordinates)

    const clearMap = () => {
        setCoordinates(defaultCoordinates)
        setSelectedMeasurement([])
        setSelectedTitle("")
    }

    function applyZoomHoverStyles() {
        const signs = document.querySelector('.leaflet-bar a')
        const zoomInButton = document.querySelector('.leaflet-control-zoom-in')
        const zoomOutButton = document.querySelector('.leaflet-control-zoom-out')
        var color = ""
        var colorButton = ""
        var colorHover = ""
            
        if (isNight) {
            color = "var(--white-text)"
            colorButton = "var(--dark-green)"
            colorHover = "var(--light-green)"
        }
        else {     
            color = "var(--black)"
            colorButton = "var(--yellow)"
            colorHover = "var(--red)"
        }
        
        if (zoomInButton && zoomOutButton && signs) {
            [zoomInButton, zoomOutButton, signs].forEach(button => {      
                button.style.color = color  
                button.style.backgroundColor = colorButton
                button.style.transition = "var(--switch-time)"
                
            })
            const addHoverStyles = (button) => {
                button.style.backgroundColor = colorHover
            
            }
            const removeHoverStyles = (button) => {
                button.style.backgroundColor = colorButton          
            }

            zoomInButton.addEventListener("mouseenter", () => addHoverStyles(zoomInButton))
            zoomInButton.addEventListener("mouseleave", () => removeHoverStyles(zoomInButton))
            zoomOutButton.addEventListener("mouseenter", () => addHoverStyles(zoomOutButton))
            zoomOutButton.addEventListener("mouseleave", () => removeHoverStyles(zoomOutButton))
        }
    }
    
    useEffect(() => { 
        applyZoomHoverStyles()
    }, [isNight])

    useEffect(() => {
        for (let measurement of selectedMeasurement) {
            if (measurement.latitude && measurement.longitude) {
                const latitude = measurement.latitude
                const longitude = measurement.longitude
                setCoordinates({ latitude, longitude })
                break
            }
        }
    }, [selectedMeasurement])


    return (
        <div className="map-container">
            <div className={`legend ${isNight ? "legend-night" : "legend-day"} ${selectedTitle === "" ? "hide-tooltip" : ""}`}>
                {selectedTitle}
            </div>
            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={17}
                scrollWheelZoom={false}
                style={{ height: "50vh", width: "100%" }}
            >
                <LayerTransition isNight={isNight} />
                <CenterMapOnCoordinates latitude={coordinates.latitude} longitude={coordinates.longitude} />

                {selectedMeasurement && selectedMeasurement.map((measurement, index) => (
                    <Marker key={index} position={[measurement.latitude, measurement.longitude]}>
                        <Tooltip>
                            time: {new Date(measurement.timestamp).toLocaleString()}
                            <br />
                            cell Id: {measurement.cellId}
                            <br />
                            LAC: {measurement.locationAreaCode}
                            <br />
                            MCC: {measurement.mobileCountryCode}
                            <br />
                            MNC: {measurement.mobileNetworkCode}
                            <br />
                            radio type: {measurement.radioType}
                            <br />
                            signal level: {measurement.signalStrength} dBm
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
            <ClearMapButton clearMap={clearMap} isNight={isNight} />
        </div>
    )
}

export default MapShow