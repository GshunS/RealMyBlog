import './FolderFileCreationWindow.css'
// import './temp.css'
// import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { useDispatch } from 'react-redux'

const FolderFileCreationWindow = () => {
    // const dispatch = useDispatch()

    const testClick = () => {
        // dispatch(editErrorMsg('clicked'))
    }
    return (
        <div className="FFCreationWindow">
            <div className="FFCreationWindow__Main" onClick={testClick}>
                <div className="FFCreationWindow__Header">
                    <span> Add Category Under</span>
                    <span> x </span>
                </div>
                <div className="FFCreationWindow__Path">123/12312/12312</div>
                <form id='FFCreationWindow__Form'>
                    <div className="FFCreationWindow__Content">
                        <select name="FFCreationWindow_Add" id="FFCreationWindow_Operation">
                            <option value="file">file</option>
                            <option value="folder">folder</option>
                        </select>
                        <input placeholder='filename'></input>
                    </div>
                </form>
                <div className="FFCreationWindow__Button">
                    <div className='FFCreationWindow__Button__Submit'>Submit</div>
                </div>

            </div>
        </div>
    )
}

export default FolderFileCreationWindow