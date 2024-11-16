/**
 * Represents a menu component. 
 * 
 * @component
 * @param {Object} props - The component props.
 * @param props.onImport  - Launches the file upload dialog.
 * @param {boolean} props.isNight - Switcher for night view.
 * @returns {React.ReactElement} A menu on the top of the page.
 */

import "./Menu.css"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import SweetAlert from "./SweetAlert"
import { BsBinoculars } from "react-icons/bs"

const Menu = ({ onImport, isNight }) => {

/**
* @showModal - Displays a medal window with information about the application.
*/    
const showModal = () => {
    const SAWithBootstrap = SweetAlert.mixin({
        customClass: {
            confirmButton: `btn ${isNight ? "confirm-button-night" : "confirm-button-day"}`,
        },
        buttonsStyling: true
    })
    SAWithBootstrap.fire({
        title: 'Tracker App',
        color: `${isNight ? "var(--white-text)" : "var(--black)"}`,
        background: `${isNight ? "var(--light-night)" : "rgb(255, 255, 255)"}`,
        html: `<div style="text-align: left;">
        <pre style="white-space: pre-wrap; font-family: inherit;">This app displays measured data with the Network Cell Info (NCI) mobile app. After importing the .json file,the display is done by selecting the measurement tab. The measurements can be stored in a database.
Abbreviations used:<ul>
<li>LAC - Location Area Code</li>
<li>MCC - Mobile Country Code</li>
<li>MNC - Mobile Network Code</li></pre></div>`,
        footer: `<a href="https://patrik-hubka.8u.cz/">Author's portfolio</a>`
    })
}
    return (
    <section id="home">
        <Navbar className={`menu-modal ${isNight ? "night-modal" : ""}`} expand="lg" >                                   
            <Navbar.Brand href="#home">
                    <h3 className={`${isNight ? " night-modal-text" : "day-modal-text"}`} ><BsBinoculars className={`d-inline-block align-bottom binoculars {${isNight ? " night-modal-text" : ""}`} />{' '}Tracker app
                    </h3>                    
            </Navbar.Brand>      
                <Navbar.Toggle className={`${isNight ? "navbar-dark" : ""}`}
                    aria-controls="basic-navbar-nav"
                />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={onImport} ><div className={`${isNight ? "night-modal-text" : "day-modal-text"}`}>Import from NCI</div></Nav.Link>
                    <Nav.Link onClick={showModal} ><div className={`${isNight ? "night-modal-text" : "day-modal-text"}`}>About Tracker</div></Nav.Link>
                </Nav>
            </Navbar.Collapse>        
        </Navbar>
    </section>
    )
}

 export default Menu
