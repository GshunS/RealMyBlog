import { useCallback, useEffect } from 'react'
import './FolderFileCreationWindow.css'
// import './temp.css'
// import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editAddType } from '../../../../store/modules/blogContentFolderFileCreationWindow'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { fetchData } from '../../../../utils/apiService'
import {
    editFolderCreated
} from '../../../../store/modules/blogContentNavBarStore'
import _ from 'lodash'

const FolderFileCreationWindow = () => {
    const dispatch = useDispatch()
    const { addType } = useSelector(state => state.blogContentFFCreationWindow)
    const { currentAncestorNames } = useSelector(state => state.blogContentNavbar)

    const modalRef = useRef(null);
    const formRef = useRef(null);


    const closeModal = useCallback(() => {
        if (addType !== '') {
            const FFwindow = document.querySelector('.FFCreationWindow')
            FFwindow.style.display = 'none'
            document.querySelector('.FFCreationWindow_Input').value = ''
            dispatch(editAddType(''))
        }
    }, [dispatch, addType])

    // close if user clicks outside of the area
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal()
            }
        }

        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [closeModal]);

    useEffect(() => {
        if (addType !== '') {
            const FFwindow = document.querySelector('.FFCreationWindow')
            console.log(FFwindow)
            if (FFwindow.style.display === '' || FFwindow.style.display === 'none') {
                FFwindow.style.display = 'flex'
            }
        }
    }, [addType])


    const createFolder = async (data) => {
        // append the new category to the current ancestor names
        let updatedAncestorNames = [...currentAncestorNames]
        updatedAncestorNames.push(data.content)
        const categories = ['first_category', 'second_category', 'third_category', 'fourth_category']
        let Data = {}
        categories.forEach((category, index) => {
            if (updatedAncestorNames[index]) {
                Data[category] = updatedAncestorNames[index].trim()
            } else {
                Data[category] = null
            }
        })

        // send the data to the backend
        let url = 'https://localhost:7219/api/categories'
        await fetchData(
            url, 'POST', Data,
            (data) => {
                closeModal()
                dispatch(editErrorMsg({ type: 'INFO', msg: `Success` }))
                dispatch(editFolderCreated(true))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
                console.log(error)
            }
        )
    }
    const validateData = _.debounce(() => {
        const formData = new FormData(formRef.current);
        const data = {
            type: formData.get("FFCreationWindow_Add").trim(),
            content: formData.get("Input_Content").trim(),
        };
        if (data.type !== 'file' && data.type !== 'folder') {
            dispatch(editErrorMsg({ type: 'WARNING', msg: 'invalid type' }))
            return
        }

        if (data.content === null || (data.content.length === 0)) {
            dispatch(editErrorMsg({ type: 'WARNING', msg: `invalid ${data.type} name` }))
            return
        }

        if (data.type === 'folder') {
            createFolder(data)
        } else {
            console.log('create file')
        }
    }, 300)


    const handleFormSubmit = (event) => {
        if (event) event.preventDefault();
        validateData()
    }


    return (
        <div className="FFCreationWindow">
            <div className="FFCreationWindow__Main" ref={modalRef}>
                <div className="FFCreationWindow__Header">
                    <span> Add Category Under</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        onClick={closeModal}>
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </div>
                <div className="FFCreationWindow__Path">{'/' + currentAncestorNames.join('/')}</div>
                <form id='FFCreationWindow__Form' onSubmit={handleFormSubmit} ref={formRef} autoComplete="off">
                    <div className="FFCreationWindow__Content">
                        <select
                            name="FFCreationWindow_Add"
                            id="FFCreationWindow_Operation"
                            value={addType}
                            onChange={(e) => dispatch(editAddType(e.target.value))}>
                            <option value="file">file</option>
                            <option value="folder">folder</option>
                        </select>
                        <input
                            className='FFCreationWindow_Input'
                            name='Input_Content'
                            placeholder={`${addType} name`}
                        >
                        </input>
                    </div>
                </form>
                <div className="FFCreationWindow__Button">
                    <div
                        className='FFCreationWindow__Button__Submit'
                        onClick={handleFormSubmit}>
                        Submit
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FolderFileCreationWindow