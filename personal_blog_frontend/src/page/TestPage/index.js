import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../store/modules/counterStore'
import { useEffect } from 'react'


const TestPage = () => {
    const { count } = useSelector(state => state.counter)

    const dispatch = useDispatch()

    return (
        <div className="TestPage">
            <button onClick={() => dispatch(decrement())}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch(increment())}>+</button>

        </div>
    );
}

export default TestPage