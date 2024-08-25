import './ErrorPopUp.css'
import className from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'

const ErrorPopUp = () => {
    const dispatch = useDispatch()
    const { type, msg } = useSelector(state => state.blogContentErrorPopUp)

    useEffect(() => {
        const c = document.querySelector('.ErrorPopUp').classList
        let timer = null;
        
        if (msg !== "") {
            if (c.contains('ErrorPopUp__Move')) {
                c.remove('ErrorPopUp__Move')
            }
            c.add('ErrorPopUp__Move')
            timer = setTimeout(() => {
                c.remove('ErrorPopUp__Move')
                dispatch(editErrorMsg({type: '', msg: ''}))
            }, 3000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [dispatch, msg])
    return (
        <div className={className("ErrorPopUp")}>
            <div className="ErrorPopUp__Content">
                <span> {msg} </span>
            </div>
        </div>
    )
}

export default ErrorPopUp