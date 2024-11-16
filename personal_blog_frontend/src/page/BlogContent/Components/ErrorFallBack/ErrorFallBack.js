// ErrorFallback.jsx
import './ErrorFallBack.scss';
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="scene">
            <div className="planet">
                <div className="crater"></div>
                <div className="crater"></div>
                <div className="crater"></div>
                <div className="crater"></div>
                <div className="crater"></div>
                <div className="rover">
                    <div className="body"></div>
                    <div className="wheels"></div>
                    <div className="trace"></div>
                </div>
                <div className="flag">
                    error
                </div>
            </div>
            <div className="message">
                <p>
                    There is no life, try to find <span onClick={resetErrorBoundary}>something else</span>
                </p>
            </div>
        </div>
    );
};

export default ErrorFallback;
