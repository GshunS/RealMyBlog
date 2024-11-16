// ErrorFallback.jsx
import './ErrorFallBack.scss';
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div class="scene">
            <div class="planet">
                <div class="crater"></div>
                <div class="crater"></div>
                <div class="crater"></div>
                <div class="crater"></div>
                <div class="crater"></div>
                <div class="rover">
                    <div class="body"></div>
                    <div class="wheels"></div>
                    <div class="trace"></div>
                </div>
                <div class="flag">
                    error
                </div>
            </div>
            <div class="message">
                <p>
                    There is no life, try to find <span onClick={resetErrorBoundary}>something else</span>
                </p>
            </div>
        </div>
    );
};

export default ErrorFallback;
