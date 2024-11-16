/**
 * Represents main component.
 * 
 * @component
 * @variable (array) allMeasurements - All measurements present in the application.
 * @variable (array) allMeasurementsHead - Names and starts of all measurements present in the application.
 * @variable (array) allMeasurementsHeadInDb - Names and starts of all measurements stored in database present in the application.
 * @variable (array) selectedMeasurement - Selected measurement to display data on map.
 * @variable (string) selectedTitle - Name of the selected measuremnt.
 * @variable (boolean) isNight - Switcher for night view.
 * @variable (ref) loadFileRef - Reference for "Import from NCI" button in Menu.js
 * @returns {React.ReactElement} A whole app.
 */

import "./App.css"
import { useState, useEffect, useCallback, useRef } from "react"
import Menu from "./components/Menu"
import DayNightButton from "./components/DayNightButton"
import LoadFile from "./components/LoadFile"
import ListOfMeasurements from "./components/ListOfMeasurements"
import MapShow from "./components/MapShow"
import { validNewTitle } from "./components/Regex"
import axios from "axios"
import SweetAlert from "./components/SweetAlert"

function App() {
  const [allMeasurements, setAllMeasurements] = useState([])
  const [allMeasurementsHead, setAllMeasurementsHead] = useState([])
  const [allMeasurementsHeadInDb, setAllMeasurementsHeadInDb] = useState([])
  const [selectedMeasurement, setSelectedMeasurement] = useState([])
  const [selectedTitle, setSelectedTitle] = useState("")
  const [isNight, setIsNight] = useState(false)
  const loadFileRef = useRef(null)

/**
* @handleDataLoad - Stores the uploaded data.
* @param {array} data - Imported data.
* @param {string} titleMeasurement - Name of the uploaded file. 
*/
  const handleDataLoad = useCallback((data, titleMeasurement) => {
    var time = null
    const title = titleValidation(titleMeasurement)
    const allItemsData = data.items.map((item, index) => {
      if (index === 0)
        time = item.timestamp
      const { timestamp } = item
      const { latitude, longitude } = item.position
      const { radioType, mobileCountryCode, mobileNetworkCode, locationAreaCode, cellId, signalStrength } = item.cellTowers[0]
      return {
        timestamp,
        latitude,
        longitude,
        radioType,
        mobileCountryCode,
        mobileNetworkCode,
        locationAreaCode,
        cellId,
        signalStrength
      }
    })
    const newData = { [title]: allItemsData }
    const newDataHead = { title, time }
    setAllMeasurements((prevState) => ({
      ...prevState,
      ...newData
    }))
    setAllMeasurementsHead((prevState) => [
      ...prevState,
      newDataHead
    ])
  }, [allMeasurements])

  /**
  * @getMeasurements - Loads all data from the database.
  */
  const getMeasurements = () => {
    axios.get("http://localhost/php/tracking_backend/?action=getAll").then((response) => {
      if (response.status === 200 && Object.keys(response.data).length > 0) {    
        setAllMeasurements(response.data) 
        const allDataHead = []
        Object.entries(response.data).forEach(([name, measurements]) => {
          const firstItem = measurements[0]
          if (firstItem) {
            allDataHead.push({
              title: name,
              time: firstItem.timestamp
            })
          }
        })
        setAllMeasurementsHead(allDataHead)
        setAllMeasurementsHeadInDb(allDataHead)
      }
    })
      .catch((error) => {
        const SAWithBootstrap = SweetAlert.mixin({
          customClass: {
            confirmButton: `btn ${isNight ? "confirm-button-night" : "confirm-button-day"}`
          },
          buttonsStyling: true
        });
        SAWithBootstrap.fire({
          title: "error!",
          color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
          background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
          text: `There is an ugly error, bro: ${error}`,
          icon: 'error'
        })
      })
  }

  /**
  * @titleValidation - Validates the name of the measurement.
  * @param {string} title - Name of the uploaded file. 
  */
  const titleValidation = (title) => {
    if (!validNewTitle.test(title)) {
      const SAWithBootstrap = SweetAlert.mixin({
        customClass: {
          confirmButton: `btn ${isNight ? "confirm-button-night" : "confirm-button-day"}`
        },
        buttonsStyling: true
      })
      SAWithBootstrap.fire({
        title: "Your measurement is renamed!",
        color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
        background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
        text: `The measurement "${title}" has invalid name, therefore it has to be renamed to "Measurement".`,
        icon: "info"
      })
      title = "Measurement"
    }
    let newTitle = title
    let countDuplicate = 1
    while (allMeasurements.hasOwnProperty(newTitle)) {
      newTitle = `${title}_copy${countDuplicate}`
      countDuplicate++
    }
    return newTitle
  }

  /**
  * @triggerLoadFileInput - Launches the file upload dialog.
  */
  const triggerLoadFileInput = () => {
    loadFileRef.current.click()
  }

  useEffect(() => {
    getMeasurements()
  }, [])

  useEffect(() => {
    document.documentElement.className = isNight ? "html-night" : "html-day"
  }, [isNight])

  return (
    <div className={`background-app ${isNight ? "night" : ""}`}>
      <Menu className="neco"
        onImport={triggerLoadFileInput}
        isNight={isNight}
      />
      <div className={`container-app ${isNight ? "night" : ""}`}>
        <DayNightButton
          isNight={isNight}
          setIsNight={setIsNight} />
      <LoadFile
        onDataLoad={handleDataLoad}
        loadFileRef={loadFileRef}
        isNight={isNight}
      />
      <MapShow
        selectedMeasurement={selectedMeasurement}
        setSelectedMeasurement={setSelectedMeasurement}
        selectedTitle={selectedTitle}
        setSelectedTitle={setSelectedTitle}
        isNight={isNight}
      />
      <ListOfMeasurements
        allMeasurements={allMeasurements}
        setAllMeasurements={setAllMeasurements}
        allMeasurementsHead={allMeasurementsHead}
        setAllMeasurementsHead={setAllMeasurementsHead}
        selectedMeasurement={selectedMeasurement}
        setSelectedMeasurement={setSelectedMeasurement}
        setSelectedTitle={setSelectedTitle}
        allMeasurementsHeadInDb={allMeasurementsHeadInDb}
        setAllMeasurementsHeadInDb={setAllMeasurementsHeadInDb}
        isNight={isNight}
      />
      </div>
    </div>
  )
}

export default App