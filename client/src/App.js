import "./App.css"
import { useState, useEffect, useCallback, useRef } from "react"
import MenuModal from "./components/MenuModal"
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

  const triggerLoadFileInput = () => {
    loadFileRef.current.click()
  }

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

  const titleValidation = useCallback((title) => {
    if (!validNewTitle.test(title)) {
      SweetAlert.fire({
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
  }, [allMeasurements])

  useEffect(() => {
    getMeasurements()
  }, [])

  useEffect(() => {
    document.documentElement.className = isNight ? "html-night" : "html-day"
  }, [isNight])

  return (
    <div className={`background-app ${isNight ? "night" : ""}`}>
      <MenuModal className="neco" onImport={triggerLoadFileInput} isNight={isNight} />
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