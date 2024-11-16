import "./ListOfMeasurements.css"
import MeasurementRenameButton from "./MeasurementRenameButton"
import MeasurementAddToDbButton from "./MeasurementAddtoDbButton"
import MeasurementDeleteButton from "./MeasurementDeleteButton"
import RenameModal from "./RenameModal"
import { validNewTitle } from "./Regex"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import SweetAlert from "./SweetAlert"

const ListOfMeasurements = ({ allMeasurements, setAllMeasurements, allMeasurementsHead, setAllMeasurementsHead, selectedMeasurement, setSelectedMeasurement, setSelectedTitle, allMeasurementsHeadInDb, setAllMeasurementsHeadInDb, isNight }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentTitle, setCurrentTitle] = useState("")
    const [newTitle, setNewTitle] = useState("")
    const [error, setError] = useState(" ")

    const openModal = useCallback((title) => {
        setCurrentTitle(title)
        setIsModalOpen(true)
    }, [])

    const selectMeasurement = useCallback((title) => {
        if (selectedMeasurement === allMeasurements[title]) {
            setSelectedMeasurement([])
            setSelectedTitle("")
        }
        else {
            setSelectedMeasurement(allMeasurements[title])
            setSelectedTitle(title)
        }
    }, [allMeasurements, setSelectedMeasurement, selectedMeasurement])

    const handleRename = () => {
        const updatedMeasurementsHead = allMeasurementsHead.map((measurement) => {
            if (measurement.title === currentTitle)
                return { ...measurement, title: newTitle }
            return measurement
        })
        const { [currentTitle]: currentValue, ...rest } = allMeasurements
        const updatedMeasurements = {
            ...rest,
            [newTitle]: currentValue,
        }

        if (allMeasurementsHeadInDb.some(item => item.title === currentTitle)) {
            axios.get(`http://localhost/php/tracking_backend/?action=rename&currentTitle=${currentTitle}&newTitle=${newTitle}`).then((response) => {
                showAlert(response) 
            })
            const updatedMeasurementsHeadInDb = allMeasurementsHeadInDb.map(measurement => 
                measurement.title === currentTitle ? { ...measurement, title: newTitle } : measurement
            )
            setAllMeasurementsHeadInDb(updatedMeasurementsHeadInDb)
        }
        else {
            showAlert({
                data: {
                    status: 1,
                    message: `'${currentTitle}' successfully renamed.`
                }
            })
        }
        setAllMeasurementsHead(updatedMeasurementsHead)
        setAllMeasurements(updatedMeasurements)
        setSelectedTitle(newTitle)
        setIsModalOpen(false)
        setNewTitle("")
        if (error)
            setError(" ")
    }

    const handleAddToDb = (title) => {
        axios.post("http://localhost/php/tracking_backend/", {
            title: title,
            measurement: allMeasurements[title] 
        }).then((response) => {
            showAlert(response)
        })
        const time = allMeasurements[title][0].timestamp
        const newDataHeadInDb = { title, time }
        setAllMeasurementsHeadInDb((prevState) => [...prevState, newDataHeadInDb])
    }

    const checkName = () => {
        const restrictedWords = [
            "select", "from", "where", "insert", "update", "delete", "table", "join",
            "on", "group", "order", "by", "having", "create", "drop", "alter",
            "and", "or", "not", "null", "primary", "key", "foreign", "constraint",
            "measurement_tables"]
        setError(" ")

        if (!newTitle.trim()) {
            setError("The name cannot be empty.")
            return
        }
        if (newTitle.length === 1 && newTitle !== ' ') {
            setError("The name must be longer than one character.")
            return
        }
        if (newTitle.length > 64) {
            setError("The name must not be longer than 64 characters.")
            return
        }
        if (!isNaN(newTitle.charAt(0)) && newTitle.charAt(0) !== ' ') {
            setError("The first character must not be a number.")
            return
        }
        if (restrictedWords.some(word => word === newTitle.toLowerCase())) {
            setError("The name must not be a restricted word.")
            return
        }
        if (allMeasurements.hasOwnProperty(newTitle)) {
            setError("The name already exists.")
            return
        }
        if (validNewTitle.test(newTitle)) {
            setError(" ")
        }
        else {
            setError("Only (a-z), (A-Z), (0-9) and (_) are allowed.")
        }
    }

    const handleDelete = (title) => {
        const SAWithBootstrap = SweetAlert.mixin({
            customClass: {
                confirmButton: `btn ${isNight ? "confirm-delete-button-night" : "btn-success"}`,
                cancelButton: `btn ${isNight ? "cancel-delete-button-night" : "btn-danger"}`
            },
            buttonsStyling: true
        })
        SAWithBootstrap.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete "${title}"?`,
            color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
            background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No!"
        }).then((result) => {
            if (result.isConfirmed) {
                const { [title]: _, ...updatedMeasurements } = allMeasurements
                const updatedMeasurementsHead = allMeasurementsHead.filter((oneMeasurement) => {
                    return oneMeasurement.title !== title
                })

                if (selectedMeasurement === allMeasurements[title]) {
                    setSelectedMeasurement([])
                }
                setAllMeasurements(updatedMeasurements)
                setAllMeasurementsHead(updatedMeasurementsHead)

                if (allMeasurementsHeadInDb.some(item => item.title === title)) {
                    axios.delete(`http://localhost/php/tracking_backend/${title}`, {
                        title: title
                    }).then((response) => {
                        showAlert(response)
                        const updatedMeasurementsHeadinDB = allMeasurementsHeadInDb.filter((oneMeasurement) => {                             
                           return oneMeasurement.title !== title
                        })
                        setAllMeasurementsHeadInDb(updatedMeasurementsHeadinDB)
                    })
                }
                else {
                    showAlert({
                        data: {
                            status: 1,
                            message: `'${title}' successfully deleted.`
                        }
                    })
                }
            }
        })
    }

    const showAlert = (response) => {
        const miniInfo = SweetAlert.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
        })

        if (response.data.status)
            miniInfo.fire({
                position: "top-end",
                color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
                background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
                icon: "success",
                title: `${response.data.message}`,
                showConfirmButton: false,
            })
        else
            SweetAlert.fire({
                title: "Error!",
                color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
                background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
                text: `${response.data.message}`,
                icon: 'error',
            })
    }

    useEffect(() => {
        if (isModalOpen) {
            checkName()
        }
    }, [newTitle])

    return (
        <section>
            <div className="all-measurements">
                {
                    allMeasurementsHead.map((oneMeasurementHead) => {
                        const { title, time } = oneMeasurementHead
                        const isInDb = allMeasurementsHeadInDb.some(item => item.title === title)
                        return (
                            <div key={title} className={`one-measurement ${isNight ? "one-measurement-night" : "one-measurement-day"} ${selectedMeasurement === allMeasurements[title] ? (isNight ? "selected-measurement-night": "selected-measurement-day") : ""}`} onClick={() => selectMeasurement(title)}> 
                                <h3 className={`title ${isNight ? "night-text" : "day-text"}`}>{title}</h3>
                                <p className={`${isNight ? "night-text" : "day-text"}`}>{new Date(time).toLocaleString()}</p>
                                <MeasurementRenameButton        openModal={(e) => {
                                    e.stopPropagation()
                                    openModal(title)
                                }}
                                isNight={isNight}   
                                />
                                <div className="add-delete-buttons">
                                <MeasurementAddToDbButton
                                addToDbMeasurement={(e) => {
                                    e.stopPropagation()
                                    handleAddToDb(title)
                                }}
                                    title={title}
                                    isInDb={isInDb}
                                    isNight={isNight}
                                />
                                <MeasurementDeleteButton deleteMeasurement={(e) => {
                                    e.stopPropagation()
                                    handleDelete(title)
                                }}
                                    title={title}
                                    isNight={isNight}
                                />
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            {
                isModalOpen && (
                    <RenameModal
                        currentTitle={currentTitle}
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                        renameMeasurement={handleRename}
                        isModalOpen={isModalOpen}
                        closeModal={() => {
                            setIsModalOpen(false)
                            setError(" ")
                        }}
                        error={error}
                        isNight={isNight}
                    />
                )}
        </section>
    )
}

export default ListOfMeasurements
