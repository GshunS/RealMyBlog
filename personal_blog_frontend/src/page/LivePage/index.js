import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './index.css';
import _ from 'lodash';
import flvjs from 'flv.js';
import Hls from 'hls.js';

const LivePage = () => {
    const [messages, setMessages] = useState([]);
    const [displayMessages, setDisplayMessages] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [timer, setTimer] = useState(null);
    const [showAddr, setShowAddr] = useState(true);
    const [toast, setToast] = useState(null);
    const [isLoadingAddr, setIsLoadingAddr] = useState(false);
    const [medalLevelFilter, setMedalLevelFilter] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const inputRef = useRef(null);
    const contentRef = useRef(null);
    const abortControllerRef = useRef(null);
    const toastTimeoutRef = useRef(null);
    const localIp = process.env.REACT_APP_LOCAL_IP;
    const [streamUrl, setStreamUrl] = useState('');
    const [playerError, setPlayerError] = useState(null);
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchLiveData = async (signal) => {
            try {
                const response = await axios.get(`https://${localIp}:7219/api/live/live/8604981/0`, {
                    signal: signal || undefined,
                });
                const newMessages = response.data.data;
                setMessages(prev => {
                    const combined = [...prev, ...newMessages];
                    const uniqueMessages = combined.filter((message, index, self) =>
                        index === self.findIndex((m) => m.timeline === message.timeline)
                    );
                    return uniqueMessages.slice(-1000);
                });
            } catch (error) {
                if (axios.isCancel(error) || error.name === "CanceledError") {
                    console.log("Request canceled");
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        if (isFetching && !timer) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            const newTimer = setInterval(() => {
                if (abortControllerRef.current) {
                    fetchLiveData(abortControllerRef.current.signal);
                } else {
                    fetchLiveData();
                }
            }, 1000);
            setTimer(newTimer);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [isFetching, timer, localIp]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = content;
            setAutoScroll(scrollHeight - (scrollTop + clientHeight) < 100);
        };

        content.addEventListener('scroll', handleScroll);
        return () => content.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const filtered = messages.filter(message => {
            if (!message.medal_level) return medalLevelFilter === 0;
            return message.medal_level >= medalLevelFilter;
        });
        setDisplayMessages(filtered);
    }, [messages, medalLevelFilter]);

    // 新消息时自动滚动到底部
    useEffect(() => {
        if (contentRef.current && isFetching && autoScroll) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [displayMessages, isFetching, autoScroll]);

    // Function to start continuous request sending
    const startFetching = () => {
        setIsFetching(true);
        setAutoScroll(true);
    };

    // Function to stop continuous request sending
    const stopFetching = () => {
        setIsFetching(false);
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    useEffect(() => {
        if (!videoRef.current || !streamUrl) return;
        
        // 销毁旧的播放器实例
        if (player) {
            player.destroy();
            setPlayer(null);
        }

        const initPlayer = async () => {
            try {
                if (isMobile) {
                    // 移动端使用HLS
                    const response = await axios.get(
                        `https://${localIp}:7219/api/live/liveStream/8604981?format=hls`
                    );
                    const hlsUrl = response.data.data.url;

                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(hlsUrl);
                        hls.attachMedia(videoRef.current);
                        setPlayer(hls);
                    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                        // iOS Safari 原生支持 HLS
                        videoRef.current.src = hlsUrl;
                    } else {
                        setPlayerError('您的浏览器不支持视频播放');
                    }
                } else {
                    // PC端使用FLV
                    if (!flvjs.isSupported()) {
                        setPlayerError('您的浏览器不支持 FLV 播放');
                        return;
                    }

                    const response = await axios.get(
                        `https://${localIp}:7219/api/live/liveStream/8604981?format=flv`
                    );
                    const flvUrl = response.data.data.url;

                    const flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: flvUrl,
                        isLive: true,
                        hasAudio: true,
                        hasVideo: true,
                        cors: true,
                        enableStashBuffer: false,
                        stashInitialSize: 128,
                        enableWorker: true
                    });

                    flvPlayer.attachMediaElement(videoRef.current);
                    flvPlayer.load();
                    await flvPlayer.play();
                    setPlayer(flvPlayer);
                }

                setPlayerError(null);
            } catch (error) {
                console.error('Player initialization error:', error);
                setPlayerError('播放器初始化失败');
            }
        };

        initPlayer();

        return () => {
            if (player) {
                player.destroy();
                setPlayer(null);
            }
        };
    }, [streamUrl, isMobile]);

    const fetchStreamAddr = async () => {
        if (!showAddr) {
            setShowAddr(true);
            inputRef.current.value = '';
            inputRef.current.classList.remove('visible');
            inputRef.current.classList.remove('collapsed');
            setStreamUrl('');
            return;
        }
        setIsLoadingAddr(true);
        try {
            const response = await axios.get(`https://${localIp}:7219/api/live/liveStream/8604981`);
            const streamUrl = response.data.data.url;
            inputRef.current.value = streamUrl;
            setStreamUrl(streamUrl);
            requestAnimationFrame(() => {
                inputRef.current.classList.add('visible');
                inputRef.current.classList.add('collapsed');
            });
            setShowAddr(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast('获取地址失败');
        } finally {
            setIsLoadingAddr(false);
        }
    }

    const toggleUrlDisplay = (e) => {
        e.preventDefault(); // 防止默认行为
        if (inputRef.current.classList.contains('collapsed')) {
            inputRef.current.classList.remove('collapsed');
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        } else {
            inputRef.current.classList.add('collapsed');
            inputRef.current.style.height = '36px';
        }
    }

    const showToast = (message) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast(message);
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
            toastTimeoutRef.current = null;
        }, 1500);
    };

    const textAreaClick = async (e) => {
        // 如果没有值或者是展开状态，不执行复制
        if (!inputRef.current.value || !inputRef.current.classList.contains('collapsed')) {
            return;
        }

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(inputRef.current.value);
                showToast('已复制到剪贴板');
            } else {
                inputRef.current.select();
                document.execCommand('copy');
                showToast('已复制到剪贴板');
            }
        } catch (err) {
            console.error(err);
            showToast('复制失败');
        }
    }

    useEffect(() => {
        if (showAddr) {
            inputRef.current.value = "";
            inputRef.current.classList.remove('visible');
        }
    }, [showAddr])

    // 清理组件卸载时的所有副作用
    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    return (
        <>
        <div className="live-page">
            <div className="live-player">
                <div data-vjs-player>
                    <video
                        ref={videoRef}
                        className="flv-player"
                        controls
                        autoPlay
                        playsInline
                        webkit-playsinline="true"
                        x5-video-player-type="h5"
                    />
                </div>
                {playerError && (
                    <div className="player-error">
                        <span>{playerError}</span>
                        <button onClick={() => {
                            setPlayerError(null);
                            if (streamUrl) {
                                setStreamUrl('');
                                setTimeout(() => setStreamUrl(streamUrl), 100);
                            }
                        }}>
                            重试
                        </button>
                    </div>
                )}
            </div>
            <div className="live-room">
                <div className="live-room__filter">
                    <div className="filter-slider-container">
                        <div className="filter-slider-header">
                            <span>粉丝牌等级过滤</span>
                            <span className="filter-level">
                                {medalLevelFilter === 0 ? '显示全部' : `≥ ${medalLevelFilter} 级`}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            className="filter-slider"
                            min="0" 
                            max="40" 
                            value={medalLevelFilter}
                            onChange={(e) => setMedalLevelFilter(Number(e.target.value))}
                        />
                    </div>
                    {!autoScroll && isFetching && (
                        <button 
                            className="scroll-bottom-btn"
                            onClick={() => {
                                contentRef.current.scrollTop = contentRef.current.scrollHeight;
                                setAutoScroll(true);
                            }}
                        >
                            回到底部
                        </button>
                    )}
                </div>
                <div className="live-room__content" ref={contentRef}>
                    {displayMessages.map((message, index) => (
                        <div 
                            key={`${message.timeline}-${index}`} 
                            className="message-item"
                            style={{
                                animation: `scrollIn 8s linear forwards`,
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {message.medal_name && (
                                <span className="user-medal">
                                    <span className="medal-name">{message.medal_name}</span>
                                    <span className="medal-level">{message.medal_level}</span>
                                </span>
                            )}
                            <span className="user-name">{message.nickname}</span>
                            <span className="message-text">{message.text}</span>
                        </div>
                    ))}
                </div>
                <div className="live-room__controls">
                    <button 
                        className={`control-btn ${isFetching ? 'active' : ''}`}
                        onClick={isFetching ? stopFetching : startFetching}
                    >
                        {isFetching ? '停止获取' : '开始获取'}
                    </button>
                    <button 
                        className={`control-btn ${isLoadingAddr ? 'loading' : ''}`}
                        onClick={fetchStreamAddr}
                        disabled={isLoadingAddr}
                    >
                        {isLoadingAddr ? "获取中..." : (showAddr ? "显示直播地址" : "隐藏直播地址")}
                    </button>
                </div>
                <div className="live-room__stream-url">
                    <textarea 
                        readOnly 
                        ref={inputRef} 
                        className='stream-url-input'
                        placeholder="点击复制直播地址"
                        onDoubleClick={toggleUrlDisplay}
                        onClick={textAreaClick}
                    ></textarea>
                </div>
            </div>
        </div>
        <div className="toast-container">
            {toast && (
                <div className="copy-toast">
                    {toast}
                </div>
            )}
        </div>
        </>
    );
};

export default LivePage;

