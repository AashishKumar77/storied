import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./personal-header.css";

// Components
import Icon from "../../components/Icon";
import Tabs from "./tabs";
import Typography from "../../components/Typography";
import Translator from "../../components/Translator";
import IconMenu from "../../components/IconMenu"
import Loader from "../../components/Loader";
import Uploader from "./uploader";
import HeroImage from "./heroImage";

//services
import { titleCase } from "../../components/utils/titlecase";
import {
    encodeDataToURL,
    formDataTrim,
    newHeaderInitialValues,
} from "./../../utils";
import { showBirthandDeath } from "shared-logics";
import { removeHiddenHeader } from "./services";
import { stickyHeaderMenu } from "./menus";

const NewHeader = ({
    personalInfo,
    relation,
    handleViewTree,
    handleHeaderMenu,
    Family,
    spousesAndChildren,
    lifeEvents,
    isPersonClue,
    personClue,
    handleGetPersonsClue,
    clearPersonClue,
    ...props
}) => {
    const { initialValues } = newHeaderInitialValues();
    initialValues.fm.t = personalInfo.givenName.givenName;
    initialValues.ln.t = personalInfo.surname.surname;
    initialValues.g = personalInfo.gender.gender;

    const familySearchFunction = (initialValue, lifeEvent, Families, spousesAndChildrens) => {
        if (lifeEvent) {
            for (const [value] of lifeEvent.entries()) {
                initialValue.ls.push({
                    le: value.Type,
                    l: {
                        l: value.Location ?.Place,
                        s: '1'
                    },
                    y: {
                        s: '8',
                        y: value.Date ?.Date
                    }
                })
            }
        }
        if (Families && Families[0] ?.Parents) {
            for (const parents of Families[0].Parents) {
                initialValue.rs.push({
                    f: parents.firstName ?.GivenName,
                    l: parents.lastName ?.Surname,
                    r: parents.gender ?.Gender == 'Male' ? 'Father' : 'Mother'
                })
            }
        }
        if (Families && Families[0] ?.children) {
            for (const children of Families[0].children.slice(0, 5)) {
                initialValue.rs.push({
                    f: children.firstName ?.GivenName,
                    l: children.lastName ?.Surname,
                    r: 'Sibling'
                })
            }
        }
        if (spousesAndChildrens) {
            for (const spouse of spousesAndChildrens ?.slice(0, 5)) {
                initialValue.rs.push({
                    f: spouse.firstName ?.GivenName,
                    l: spouse.lastName ?.Surname,
                    r: 'Spouse'
                })
                for (const children of spouse.children ?.slice(0, 5)) {
                    initialValue.rs.push({
                        f: children.firstName ?.GivenName,
                        l: children.lastName ?.Surname,
                        r: 'Child'
                    })
                }
            }
        }
        let formValue = { ...initialValue };
        const urlQuery = encodeDataToURL({ ...formDataTrim(formValue) });
        history.push(`/search/all-historical-records/result?${urlQuery}`);
    }
    let birthDate = personalInfo.birthDate.rawDate;
    let birthYear = personalInfo.birthDate.year;
    let birthLocation = personalInfo.birthLocation == null ? "" : personalInfo.birthLocation;
    let deathDate = personalInfo.deathDate.rawDate;
    let deathYear = personalInfo.deathDate.year;
    let deathLocation = personalInfo.deathLocation == null ? "" : personalInfo.deathLocation;
    let isLiving = personalInfo.isLiving;
    let birthInfo, deathInfo;

    //For birth date
    switch (true) {
        case (birthDate !== "" && birthLocation !== ""):
            birthInfo = birthDate + " ∙ " + birthLocation;
            break;
        case (birthDate !== ""):
            birthInfo = birthDate;
            break;
        case (birthLocation !== ""):
            birthInfo = birthLocation;
            break;
        default:
            birthInfo = "Unknown";
            break;
    }
    //For death date
    switch (true) {
        case (deathDate !== "" && deathLocation !== ""):
            deathInfo = deathDate + " ∙ " + deathLocation;
            break;
        case (deathDate !== ""):
            deathInfo = deathDate;
            break;
        case (deathLocation !== ""):
            deathInfo = deathLocation;
            break;
        case (isLiving === true):
            deathInfo = "Living";
            break;
        default:
            deathInfo = "Unknown";
            break;
    }
    let imgSrc = personalInfo.profileImageUrl;
    let heroImageSrc = personalInfo.backgroundImageUrl;

    const [scroll, setScroll] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSearch, setIsSearch] = useState(true);
    const history = useHistory();


    useEffect(() => {
        document.querySelector(".main-wrapper").parentNode.classList.add('person-main-wrapper');
        document.querySelector(".person-detail-page").classList.add('person-detail-top');
        if (heroImageSrc) {
            document.querySelector(".person-detail-top").classList.add('person-hero-image');
        }
        window.addEventListener("scroll", () => {
            var headerHeightOne = document.getElementById('person-page')
            var windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth;
            const personPage = headerHeightOne && headerHeightOne.getBoundingClientRect();
            const personPageHeight = personPage && personPage.height;
            function HeaderFunction() {
                if (windowWidth > 767) {
                    if (heroImageSrc != '') {
                        if ((windowHeight + 450) < personPageHeight) {
                            removeSt184();
                            removeSt235();
                            setScroll(window.scrollY > 386);
                            if (window.scrollY > 386) {
                                document.querySelector(".person-detail-page").classList.add('sticky-top-386');
                            } else {
                                removeSt386();
                            }
                        }
                    } else {
                        if ((windowHeight + 280) < personPageHeight) {
                            removeSt386();
                            removeSt235();
                            setScroll(window.scrollY > 184);
                            if (window.scrollY > 184) {
                                document.querySelector(".person-detail-page").classList.add('sticky-top-184');
                            } else {
                                removeSt184();
                            }
                        }
                    }
                } else {
                    if ((windowHeight + 280) < personPageHeight) {
                        removeSt184();
                        removeSt386();
                        setScroll(window.scrollY > 235);
                        if (window.scrollY > 235) {
                            document.querySelector(".person-detail-page").classList.add('sticky-top-235');
                        } else {
                            removeSt235();
                        }
                    }

                }
            }
            if (window.scrollY == 0) {
                setScroll(false);
                removeSt184();
                removeSt386();
                removeSt235();
            }
            HeaderFunction();
            window.addEventListener("resize", () => {
                HeaderFunction();
            });

            function removeSt235() {
                if (document.getElementsByClassName('sticky-top-235').length > 0) {
                    document.querySelector(".person-detail-page").classList.remove('sticky-top-235');
                }
            }
            function removeSt386() {
                if (document.getElementsByClassName('sticky-top-386').length > 0) {
                    document.querySelector(".person-detail-page").classList.remove('sticky-top-386');
                }
            }
            function removeSt184() {
                if (document.getElementsByClassName('sticky-top-184').length > 0) {
                    document.querySelector(".person-detail-page").classList.remove('sticky-top-184');
                }
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener("resize", () => {
            const ismobile = window.innerWidth < 768;
            if (ismobile !== isMobile) setIsMobile(ismobile);
        }, false);
    }, [isMobile]);

    useEffect(() => {
        if (personalInfo && lifeEvents && Family && spousesAndChildren) {
            setIsSearch(false)
        }
    }, [personalInfo, lifeEvents, Family, spousesAndChildren]);

    useEffect(() => {
        if (personClue) {
            history.push(`/search/all-historical-records/result${personClue}`);
        }
        return () => {
            clearPersonClue()
        }
    }, [personClue])
    const handlePersonRecord = () => {
        history.push(`/search/person-records/${personalInfo.id}`);
    }

    const goToPreviousPage = () => {
        window.history.go(-1);
        removeHiddenHeader();
    }

    const ProfileWrapperComponent = () => (
        <div className="profile-card-wrapper">
            <div className="profile-card-wrapper-inner">
                <div className="profile-card">
                    <div
                        className="profile-img"
                    >
                        <div className="add-photo typo-font-medium">
                            <Uploader imgSrc={imgSrc} {...props} from="person" />
                        </div>
                    </div>
                    <div className="profile-details typo-font-regular">
                        <h1 className="typo-font-bold">
                            <Typography
                                fontFamily="primaryFont"
                                size={32}
                                weight="medium"
                                variant="h1"
                                className="typo-font-bold"
                            >
                                {`${titleCase(personalInfo.givenName.givenName)} ${titleCase(personalInfo.surname.surname)}`}
                            </Typography>
                        </h1>
                        <div className="xs-dob-detail md:hidden">
                            <span className="ttl">{showBirthandDeath(birthYear, deathYear, isLiving)}</span>
                        </div>
                        <div className="dob-detail hidden md:block">
                            <Translator tkey="person.header.b" />
                            <Typography text="secondary" weight="regular">
                                {` ${titleCase(birthInfo)}`}
                            </Typography>
                        </div>
                        <div className="dod-detail hidden md:block">
                            <Typography text="secondary" weight="regular">
                                <Translator tkey="person.header.d" />
                                {` ${titleCase(deathInfo)}`}
                            </Typography>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
    const RightNavComponent = () => (
        <div className="right-nav">
            <button disabled={isSearch} className="icon-menu" style={{ display: 'none' }} onClick={() => familySearchFunction(initialValues, lifeEvents, Family, spousesAndChildren)}>
                <Icon
                    background
                    color="secondary"
                    id='"icon-" + crypt'
                    size="medium"
                    type="search"
                />
            </button>
            <button disabled={isPersonClue} className="icon-menu" onClick={() => handleGetPersonsClue()}>
                <Icon
                    background
                    color="secondary"
                    id='"icon-" + crypt'
                    size="medium"
                    type="search"
                />
            </button>
            <button className="icon-menu" onClick={() => handlePersonRecord()}>
                <Icon
                    background
                    color="danger"
                    id='"icon-" + crypt'
                    size="medium"
                    type="search"
                />
            </button>
            <button className="icon-menu">
                <Icon
                    background
                    color="secondary"
                    handleClick={handleViewTree}
                    id='"icon-" + crypt'
                    size="medium"
                    type="tree"
                />
            </button>
            <button className="icon-menu more-menu relative">
                <IconMenu
                    type="menuHorizontal"
                    background
                    popperPlacement="bottom-end"
                    rootClass="rootHorizontalPaper"
                    menu={stickyHeaderMenu}
                    handleMenu={handleHeaderMenu}
                />
            </button>
        </div>
    );
    return (
        <>
            {isPersonClue && <Loader />}
            <header className={`personal-header ${scroll ? "sticky" : "unsticky"}`}>
                <div className="mtop-header z-20">
                    <div className="back-placeholder">
                        <div className="icon-menu">
                            <Icon
                                background
                                color="secondary"
                                id='"icon-" + crypt'
                                size="medium"
                                type="arrowLeft"
                                handleClick={() => goToPreviousPage()}
                            />
                        </div>
                    </div>

                    <div className={scroll ? 'userinfo-placeholder' : 'userinfo-placeholder hidden'}>
                        <h2 className="typo-font-medium">
                            {`${titleCase(personalInfo.givenName.givenName)} ${titleCase(personalInfo.surname.surname)}`}
                        </h2>
                        <div className="xs-dob-detail">
                            <span className="ttl"> {showBirthandDeath(birthYear, deathYear, isLiving)}</span>
                        </div>
                    </div>
                    {isMobile && <RightNavComponent />}
                </div>
                <div className="pr-container">
                    <figure className={heroImageSrc ? "hero-placeholder up-hero-image" : "hero-placeholder"}>{/* <img src={heroImage} alt="Hero Image" /> */}
                        <HeroImage imgSrc={heroImageSrc} heroImageRef={props.heroImageRef} {...props} /></figure>

                    {!scroll && <ProfileWrapperComponent />}

                    <nav className="profile-menu relative">
                        {scroll && <ProfileWrapperComponent />}
                        <div className="left-nav">
                            <Tabs tab={props.tab} handleTab={props.handleTab} />
                        </div>

                        {!isMobile && <RightNavComponent />}
                    </nav>

                </div>
            </header>
        </>

    );
};

export default NewHeader;