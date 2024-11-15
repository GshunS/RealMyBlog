import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './index.css';
import _ from 'lodash';

const TestPage = () => {
    const [constText, setConstText] = useState([]);
    const [isFetching, setIsFetching] = useState(false); // New state to control the interval
    const [timer, setTimer] = useState(null); // To store the interval ID
    const [showAddr, setShowAddr] = useState(true);
    const inputRef = useRef(null);
    const localIp = process.env.REACT_APP_LOCAL_IP;

    useEffect(() => {
        const fetchLiveData = async () => {
            try {
                const response = await axios.get(`https://${localIp}:7219/api/live/live/8604981/0`);
                const roomTexts = response.data.data.room.map(item => ({
                    text: item.text,
                    timeline: item.timeline
                }));

                const combinedTexts = [...roomTexts];
                const sortedTexts = _.sortBy(combinedTexts, ['timeline']);
                const pureText = sortedTexts.map(item => (item.text));
                setConstText(pureText);

            } catch (error) {
                console.error("Error fetching data:", error);
                // setConstText([error.config.url]);
            }
        };

        if (isFetching && !timer) {
            const newTimer = setInterval(fetchLiveData, 1000);
            setTimer(newTimer); // Save the interval ID
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                setTimer(null); // Reset the timer when stopped
            }
        };
    }, [isFetching, timer, localIp]);

    // Function to start continuous request sending
    const startFetching = () => {
        setIsFetching(true);
    };

    // Function to stop continuous request sending
    const stopFetching = () => {
        setIsFetching(false);
    };

    const fetchStreamAddr = async () => {
        if (!showAddr) {
            setShowAddr(true);
            return;
        }
        try {
            const response = await axios.get(`https://${localIp}:7219/api/live/liveStream/8604981`);
            const streamUrl = response.data.data.durl[0].url
            inputRef.current.value = streamUrl;
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
            setShowAddr(false);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const textAreaClick = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(inputRef.current.value); // Copy to clipboard
            } else {
                // Fallback for browsers that don't support Clipboard API (not ideal for mobile)
                inputRef.current.select();
                document.execCommand('copy');
            }
            setShowAddr(true);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (showAddr) {
            inputRef.current.value = "";
            inputRef.current.style.height = 0;
        }
    }, [showAddr])

    return (
        <div className="TestPage">
            <div className="TestPage__Content">
                <ul>
                    {constText.map((text, index) => (
                        <li key={index}>{text}</li>
                    ))}
                </ul>
            </div>
            <div className="TestPage__Controls">
                <button onClick={startFetching} disabled={isFetching}>Start Fetching</button>
                <button onClick={stopFetching} disabled={!isFetching}>Stop Fetching</button>
                <button onClick={() => fetchStreamAddr()}> {showAddr ? "Show" : "Hide"} Stream Addr</button>
            </div>
            <div className="TestPage__Link" onClick={textAreaClick}>
                <textarea readOnly ref={inputRef} className='TestPage__Link__Input'></textarea>
            </div>
        </div>
    );
};

export default TestPage;
