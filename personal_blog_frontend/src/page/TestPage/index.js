import { useState, useEffect } from 'react';
import axios from "axios";
import './index.css';
import _ from 'lodash';

const TestPage = () => {
    const [constText, setConstText] = useState([]);

    useEffect(() => {
        const fetchLiveData = async () => {
            try {
                const response = await axios.get('https://192.168.1.199:7219/api/live/live/8604981/0');
                // console.log(response.data);

                // const adminTexts = response.data.data.admin.map(item => ({
                //     text: item.text,
                //     timeline: item.timeline
                // }));

                const roomTexts = response.data.data.room.map(item => ({
                    text: item.text,
                    timeline: item.timeline
                }));

                const combinedTexts = [...roomTexts];
                const sortedTexts = _.sortBy(combinedTexts, ['timeline']);
                const pureText = sortedTexts.map(item => (item.text));
                // console.log(pureText);
                setConstText(pureText);

            } catch (error) {
                console.error("Error fetching data:", error);
                setConstText([error.config.url]);
            }
        };
        // fetchLiveData();
        const timer = setInterval(() => {
            fetchLiveData();
        }, 500);

        return () => setInterval(timer);
    }, []);

    return (
        <div className="TestPage">
            <div className="TestPage__Content">
                <ul>
                    {constText.map((text, index) => (
                        <li key={index}>{text}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default TestPage;
