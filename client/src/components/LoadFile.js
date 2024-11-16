import "./LoadFile.css"
import SweetAlert from "./SweetAlert"

const LoadFile = ({ onDataLoad, loadFileRef, isNight }) => {
    const onLoad = (event) => {   
        const file = event.target.files[0]
        if (!file || (!file.name.endsWith(".txt") && !file.name.endsWith(".json"))) {
            showAlert("You opened wrong file! Only .json or .txt are allowed.", "error", "Error!")
            return
        }
        
        const reader = new FileReader()
        reader.onload = function (e) {
            const fileContent = e.target.result
            let jsonData

            try {
                jsonData = JSON.parse(fileContent)
            } catch (error) {
                showAlert("Cannot read the file! You opened a nasty JSON.", "error", "Error!")
                return
            }

            let isMissingPositionData = false
            let isMissingBTSData = false

            jsonData.items.forEach((item, index) => {
                const hasPositionData = item.position?.latitude && item.position?.longitude
                const hasBTSData = item.cellTowers?.[0]?.cellId && item.cellTowers[0].locationAreaCode

                if (!hasPositionData) {
                    console.log(`Measurement point ${index + 1} is missing position data`)
                    isMissingPositionData = true
                }

                if (!hasBTSData) {
                    console.log(`Measurement point ${index + 1} is missing BTS data`)
                    isMissingBTSData = true
                }
            })
        
            if (isMissingPositionData && isMissingBTSData) {
                showAlert("Some positional and BTS data is missing, see console log.", "warning", "Some data is missing!")
            } else if (isMissingPositionData) {
                showAlert("Some positional data is missing, see console log.", "warning", "Some data is missing!")
            } else if (isMissingBTSData) {
                showAlert("Some BTS data is missing, see console log.", "warning", "Some data is missing!")
            }

            onDataLoad(jsonData, file.name.split(".").slice(0, -1).join("."))
        }
        reader.readAsText(file)
    }

    const onReset = () => {
        const input = document.getElementById("load-file")
        input.value = null
    }

    const showAlert = (text, icon, title) => {
        SweetAlert.mixin({
            customClass: {
                confirmButton: `btn ${isNight ? "confirmButton-night" : "confirmButton-day"}`,
            },
            buttonsStyling: false,
        }).fire({
            title: title,
            text: text,
            color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
            background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
            icon: icon
        })
    }

    return ( 
        <>
            <label htmlFor="load-file"><h4 className={`${isNight ? " night-modal-text" : ""}`} >Import from NCI</h4></label>
            <form className="load-file">
                <input
                    className={`${isNight ? "load-button-night" : "load-button-day"}`}
                    type="file"
                    id="load-file"
                    name="load-file"
                    accept=".txt, .json"
                    onChange={onLoad}
                    ref={loadFileRef}
                    onClick={onReset}
                />
            </form >
        </>            
    )
}

export default LoadFile



