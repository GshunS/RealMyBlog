import { useCallback, useEffect } from 'react'
import './FolderFileCreationWindow.css'
// import './temp.css'
// import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editAddType } from '../../../../store/modules/blogContentFolderFileCreationWindow'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import _ from 'lodash'

const FolderFileCreationWindow = () => {
    const dispatch = useDispatch()
    const { addType } = useSelector(state => state.blogContentFFCreationWindow)
    const { currentAncestorNames } = useSelector(state => state.blogContentNavbar)

    const modalRef = useRef(null);
    const formRef = useRef(null);


    const closeModal = useCallback(() => {
        const FFwindow = document.querySelector('.FFCreationWindow')
        FFwindow.style.display = 'none'
        dispatch(editAddType(''))
    }, [dispatch])

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
            FFwindow.style.display = 'flex'
        }
    }, [addType])

    const createFF = _.debounce(() => {
        const formData = new FormData(formRef.current);
        const data = {
            type: formData.get("FFCreationWindow_Add").trim(),
            filename: formData.get("Input_Content").trim(),
        };
        if (data.type !== 'file' && data.type !== 'folder') {
            dispatch(editErrorMsg('invalid type'))
        }

        if (data.filename === null || (data.filename.length === 0)) {
            dispatch(editErrorMsg(`invalid ${data.type} name`))
        }
        console.log(currentAncestorNames);
        console.log(data);
    }, 300)

    const handleFormSubmit = (event) => {
        if (event) event.preventDefault();
        createFF()
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