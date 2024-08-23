import './ErrorPopUp.css'
import className from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'

const ErrorPopUp = () => {
    const dispatch = useDispatch()
    const { errorMsg } = useSelector(state => state.blogContentErrorPopUp)

    useEffect(() => {
        const c = document.querySelector('.ErrorPopUp').classList
        let timer = null;
        if (errorMsg !== "" && !c.contains('ErrorPopUp__Move')) {
            c.add('ErrorPopUp__Move')
            timer = setTimeout(() => {
                c.remove('ErrorPopUp__Move')
                dispatch(editErrorMsg(""))  
            }, 3000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [dispatch, errorMsg])
    return (
        <div className={className("ErrorPopUp")}>
            <div className="ErrorPopUp__Content">
                <span> {errorMsg} </span>
            </div>
        </div>
    )
}

export default ErrorPopUp