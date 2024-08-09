import classNames from 'classnames'
import './NavBarTempFolder.css'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
const NavBarTempFolder = () => {

    const inputRef = useRef(null)
    const currentAncestorNames = useSelector(state => state.blogContentNavbar.currentAncestorNames)

    const CategoryCreation = async(event) => {
        // process the form submission
        event.preventDefault();
        if (inputRef.current) {
            // append the new category to the current ancestor names
            let updatedAncestorNames = [...currentAncestorNames]
            updatedAncestorNames.push(inputRef.current.value)
            const categories = ['first_category', 'second_category', 'third_category', 'fourth_category']
            let Data = {}
            categories.forEach((category, index) => {
                if (updatedAncestorNames[index]){
                    Data[category] = updatedAncestorNames[index]
                }else{
                    Data[category] = null
                }
            })
            
            // send the data to the backend
            let url = ''
            await axios.post(url, Data)
        }
    };
    /**
     * Handles the click event for category creation.
     */
    const handleCategoryCreationClick = () => {
        if (inputRef.current) {
            inputRef.current.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    };
    return (
        <div
            className={classNames("nav-bar__category_div_temp", { 'showFolder': false })}
        >
            <div
                className="nav-bar__category_name"
            >

                {/* show the arrow or not */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className={
                        classNames(
                            { hideFileArrow: true },
                            { imgRotate: false }
                        )
                    }>
                    <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


                {/* the folder icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>


                {/* level 4 category name */}
                <span><form onSubmit={CategoryCreation}>
                    <input ref={inputRef} type="text" placeholder="Enter text" className='nav-bar__create-folder-input' />
                    <svg
                        onClick={handleCategoryCreationClick}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-send"
                    >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </form></span>

            </div>

        </div>
    )
}

export default NavBarTempFolder