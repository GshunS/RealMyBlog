import React, { useState } from "react";
import "./notfound.css";

const WikiTableOfContents = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const sections = [
    { title: "👓 前言", subItems: [] },
    {
      title: "🖐️ 准备篇",
      subItems: [
        "Stable Diffusion Webui的部署",
        "AI绘画模型概述及使用",
        "SD-WebUI插件安装及汉化配置",
      ],
    },
    { title: "⭐ 绘图篇", subItems: [] },
    { title: "✨ 进阶篇", subItems: [] },
    {
      title: "🐇 应用篇",
      subItems: ["模型推荐", "插件推荐", "扩展应用"],
    },
    { title: "🚀 技巧篇", subItems: [] },
    { title: "🧠 理论篇", subItems: [] },
    { title: "📃 未归档", subItems: [] },
    { title: "📚 资料推荐", subItems: [] },
  ];

  return (
    <div className="wiki-toc">
      <h2>Wiki table of contents</h2>
      <ul className="toc-list">
        {sections.map((section, index) => (
          <li key={index} className="toc-item">
            <div
              className="toc-title"
              onClick={() => toggleSection(index)}
            >
              <span>{section.title}</span>
              {section.subItems.length > 0 && (
                <button className="toggle-button">
                  {openSections[index] ? "▲" : "▼"}
                </button>
              )}
            </div>
            {openSections[index] && section.subItems.length > 0 && (
              <ul className="sub-list">
                {section.subItems.map((item, subIndex) => (
                  <li key={subIndex} className="sub-item">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WikiTableOfContents;
