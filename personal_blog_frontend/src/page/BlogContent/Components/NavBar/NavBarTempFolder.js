// import classNames from 'classnames'
// import './NavBarTempFolder.css'
// import React, { useRef } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { fetchData } from '../../../../utils/apiService'
// import { clearTempElements } from '../../../../utils/folderArticleHelper'
// import { editFolderCreated } from '../../../../store/modules/blogContentNavBarStore'
// import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
// import {produce} from 'immer'
// import _ from 'lodash'
// // (Deprecated)
// const NavBarTempFolder = () => {

//     const inputRef = useRef(null)
//     const currentAncestorNames = useSelector(state => state.blogContentNavbar.currentAncestorNames)
//     const dispatch = useDispatch()

//     const handleCategoryCreation = (event) => {
//         event.preventDefault(); // Prevent the form from submitting
//         // CategoryCreation(event); // Call the debounced function
//     };

   

//     const CategoryCreation = _.debounce(async (event) => {
//         // process the form submission
//         if (inputRef.current) {
//             // append the new category to the current ancestor names
//             let updatedAncestorNames = [...currentAncestorNames]
//             updatedAncestorNames.push(inputRef.current.value)
//             const categories = ['first_category', 'second_category', 'third_category', 'fourth_category']
//             let Data = {}
//             categories.forEach((category, index) => {
//                 if (updatedAncestorNames[index]) {
//                     Data[category] = updatedAncestorNames[index].trim()
//                 } else {
//                     Data[category] = null
//                 }
//             })

//             // send the data to the backend
//             let url = 'https://localhost:7219/api/categories'
//             await fetchData(
//                 url, 'POST', Data,
//                 (data) => {
//                     clearTempElements('.showFolder')
//                     // refresh the data
//                     dispatch(editFolderCreated(true))
//                 },
//                 (error) => {
//                     clearTempElements('.showFolder')
//                     dispatch(editErrorMsg({type: 'ERROR', msg: error}))
//                     console.log(error)
//                 }
//                 )
//         }
//     }, 300);
//     /**
//      * Handles the click event for category creation.
//      */
//     const handleCategoryCreationClick = () => {
//         if (inputRef.current) {
//             inputRef.current.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
//         }
//     };
//     return (
//         <div
//             className={classNames("nav-bar__category_div_temp", { 'showFolder': false })}
//         >
//             <div
//                 className="nav-bar__category_name_temp"
//             >

//                 {/* show the arrow or not */}
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 448 512"
//                     className={
//                         classNames(
//                             { hideFileArrow: true },
//                             { imgRotate: false }
//                         )
//                     }>
//                     <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" /></svg>


//                 {/* the folder icon */}
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='nav-bar__folder-icon'><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>


//                 <form onSubmit={handleCategoryCreation}>
//                     <div className="nav-bar__formdiv">
//                         <input ref={inputRef} type="text" placeholder="here !!!" className='nav-bar__create-folder-input' />
//                     </div>
//                 </form>


//             </div>

//             <div className={classNames("nav-bar__category_img_temp")}>
//                 {/* {create a file} */}
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 448 512"
//                     onClick={handleCategoryCreationClick}
//                 >
//                     <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
//                 </svg>
//             </div>

//         </div>
//     )
// }

// export default NavBarTempFolder