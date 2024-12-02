import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRocket, 
    faBook, 
    faTelevision,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Home = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('projects');

    const sections = [
        {
            id: 'projects',
            name: '项目导航',
            icon: faRocket,
            items: [
                { 
                    id: 'blog', 
                    name: '个人博客', 
                    icon: faBook, 
                    desc: '记录学习与生活' 
                },
                { 
                    id: 'live', 
                    name: 'BiliBili直播工具', 
                    icon: faTelevision, 
                    desc: 'flv.js播放器以及在线弹幕' 
                }
            ]
        },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setActiveSection(sectionId);
    };

    return (
        <div className="home-layout">
            <div className={`home-nav ${isNavOpen ? 'open' : 'closed'}`}>
                <div className="home-nav-header">
                    <h2>导航目录</h2>
                    <button 
                        className="home-nav-toggle"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                        <FontAwesomeIcon icon={isNavOpen ? faChevronLeft : faChevronRight} />
                    </button>
                </div>
                <div className="home-nav-content">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            className={`home-nav-item ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => scrollToSection(section.id)}
                        >
                            <span className="home-nav-item-icon">
                                <FontAwesomeIcon icon={section.icon} />
                            </span>
                            <span className="home-nav-item-text">{section.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="home-container">
                {sections.map(section => (
                    <div key={section.id} id={section.id} className="home-section">
                        <h2 className="home-section-title">
                            <span className="home-section-icon">
                                <FontAwesomeIcon icon={section.icon} />
                            </span>
                            {section.name}
                        </h2>
                        <div className="home-grid">
                            {section.items.map(item => (
                                <Link key={item.id} to={`/${item.id}`} className="home-card">
                                    <div className="home-card-icon">
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <div className="home-card-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home; 