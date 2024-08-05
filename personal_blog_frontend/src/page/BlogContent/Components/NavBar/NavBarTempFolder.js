import classNames from 'classnames'
import './NavBarTempFolder.css'
import React, { useRef, useEffect } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
const NavBarTempFolder = (props) => {

    const currentAncestorNames = useSelector(state => state.blogContentNavbar.currentAncestorNames)
    const ancestorCategoryNames = props.ancestorCategoryNames
    const inputRef = useRef(null)

    function checkShowFolder() {
        // console.log(ancestorCategoryNames)
        // console.log(currentAncestorNames)
        // console.log('checking')
        if (ancestorCategoryNames.length !== currentAncestorNames.length) {
            return false
        }
        else {
            console.log('equal')
            return ancestorCategoryNames.every((value, index) => value === currentAncestorNames[index])
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputRef.current) {
            alert(`Input submitted: ${inputRef.current.value}`);
        }
    };
    const handleSVGClick = () => {
        if (inputRef.current) {
            inputRef.current.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    };
    return (
        <div
            className={classNames("nav-bar__category_div_temp", { 'showFolder': checkShowFolder() })}
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
                {/* if the level has been clicked, then the folder icon become a opened folder icon */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='nav-bar__folder-icon'><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg> */}

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>


                {/* level 4 category name */}
                <span><form onSubmit={handleSubmit}>
                    <input ref={inputRef} type="text" placeholder="Enter text" className='nav-bar__create-folder-input' />
                    <svg
                        onClick={handleSVGClick}
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