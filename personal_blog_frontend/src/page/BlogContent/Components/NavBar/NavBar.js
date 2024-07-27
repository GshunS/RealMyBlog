import './NavBar.css'
import angleup from '../../../../assets/images/angle-up-solid.svg'
import addfolder from '../../../../assets/images/folder-plus-solid.svg'
import addfile from '../../../../assets/images/file-circle-plus-solid.svg'

const NavBar = () => {
    return (
        <div className="nav-bar">
            <div className="nav-bar__name">
                <span>Blog Navigation</span>
            </div>

            <div className="nav-bar__categories">
                <ul className="nav-bar__first-category">
                    <li className="nav-bar__first-category-items">
                        <div className="nav-bar__category_div">
                            <div className="nav-bar__category_name">
                                <img src={angleup} alt="arrow" />
                                <span>School</span>

                            </div>
                            <div className="nav-bar__category_img">
                                <img src={addfolder} alt="addfolder" />
                                <img src={addfile} alt="addfile" />
                            </div>

                        </div>


                        <ul className="nav-bar__second-category">
                            <li className="nav-bar__second-category-items">
                                <div className="nav-bar__category_div">
                                    <div className="nav-bar__category_name">
                                        <img src={angleup} alt="arrow" />
                                        <span>Auckland</span>

                                    </div>
                                    <div className="nav-bar__category_img">
                                        <img src={addfolder} alt="addfolder" />
                                        <img src={addfile} alt="addfile" />
                                    </div>

                                </div>

                                <ul className="nav-bar__third-category">
                                    <li className="nav-bar__third-category-items">
                                        <div className="nav-bar__category_div">
                                            <div className="nav-bar__category_name">
                                                <img src={angleup} alt="arrow" />
                                                <span>Life</span>

                                            </div>
                                            <div className="nav-bar__category_img">
                                                <img src={addfolder} alt="addfolder" />
                                                <img src={addfile} alt="addfile" />
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar