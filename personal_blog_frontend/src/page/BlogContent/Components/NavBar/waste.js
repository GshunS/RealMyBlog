

// {/* <ul className="nav-bar__third-category">
//                                                 <li className="nav-bar__third-category-items">
//                                                     <div className="nav-bar__category_div">
//                                                         <div className="nav-bar__category_name">
//                                                             <img src={angleup} alt="arrow" />
//                                                             <span>{category.third_category}</span>

//                                                         </div>
//                                                         <div className="nav-bar__category_img">
//                                                             <img src={addfolder} alt="addfolder" />
//                                                             <img src={addfile} alt="addfile" />
//                                                         </div>

//                                                     </div>
//                                                 </li>
//                                             </ul> */}

<ul className={classNames("nav-bar__second-category", { "expanded": expandedCategories.hasOwnProperty(firstCategoryName) })}>
                                {expandedCategories.hasOwnProperty(firstCategoryName) && (

                                    Object.entries(firstCategoryValue["subCategories"]).map(([secondCategoryName, secondCategoryValue], secondIndex) => (
                                        <li className={classNames("nav-bar__second-category-items")}
                                            key={secondIndex}>
                                            <div className="nav-bar__category_div">
                                                <div
                                                    className="nav-bar__category_name"
                                                    onClick={() => getThirdCategory(firstCategoryName, secondCategoryName)}>
                                                    <img
                                                        src={angleup}
                                                        alt="arrow"
                                                        className={classNames(
                                                            { hideFileArrow: !secondCategoryValue.hasChildren },
                                                            { imgRotate: false }
                                                        )} />
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#74C0FC" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg> */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" />
                                                    </svg>
                                                    <span>{secondCategoryName}</span>

                                                </div>
                                                <div className="nav-bar__category_img">
                                                    <img src={addfolder} alt="addfolder" title='create a folder' />
                                                    <img src={addfile} alt="addfile" title='create a file' />
                                                </div>

                                            </div>
                                        </li>
                                    ))

                                )}
                                <div className={classNames({ 'nav-bar__category_article': expandedCategories.hasOwnProperty(firstCategoryName) })}>
                                    {expandedCategories.hasOwnProperty(firstCategoryName) && (

                                        Object.entries(allCategories[firstCategoryName]['articles']).map(([id, title]) => (

                                            <li className={classNames("nav-bar__second-category-items")}
                                                key={id}>
                                                <div className="nav-bar__category_div">
                                                    <div className="nav-bar__category_name">

                                                        <img
                                                            src={angleup}
                                                            alt="arrow"
                                                            className={classNames(
                                                                { hideFileArrow: true },
                                                                { imgRotate: false }
                                                            )} />
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                            <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                                                        </svg>
                                                        <span>{title}</span>

                                                    </div>
                                                </div>
                                            </li>
                                        ))

                                    )}
                                </div>
                            </ul>