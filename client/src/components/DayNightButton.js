import "./DayNightButton.css"

const DayNightButton = ({isNight, setIsNight}) => {
    const handleChange = () => {
        setIsNight(!isNight)
    }
    return (
        <div className="container-sun-moon">
            <div className="switch">
                <label htmlFor="toggle">
                    <input 
                        id="toggle"
                        className="toggle-switch"
                        type="checkbox"
                        checked={isNight}
                        onChange={handleChange}
                    />
                    <div className="sun-moon">
                        <div className="dots"></div>
                    </div>
                    <div className="background">
                        <div className="stars1"></div>
                        <div className="stars2"></div>
                    </div>
                    <div className="fill"></div>
                </label>
            </div>             
        </div>        
    )
}

export default DayNightButton