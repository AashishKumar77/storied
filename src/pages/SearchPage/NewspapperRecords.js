import React, {
	useState,
	useEffect,
	useMemo
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { tr } from "../../components/utils";
import Loader from "../../components/Loader";
import { numToLocaleString } from "./../../utils";
import {
	getNewspapperDefaultValue,
	mergeDeep,
	decodeDataToURL,
	getPageSize,
	encodeDataToURL,
	formDataTrim
} from "../../utils";
import Typography from "./../../components/Typography";
import "./index.css";
import Norecords from "./NoRecord";
import NewspaperForm from "./Newspaper/NewspaperForm";
import NewsPaperSearch from "./Newspaper/NewsPaperSearchPage/NewsPaperSearch"
import NewsPaperArchive from "./Newspaper/NewsPaperSearchPage/NewsPaperArchive"
import NewsPaperContent from "./Newspaper/NewsPaperSearchPage/NewsPaperContent"
import NewsPaperPagination from "./Newspaper/NewsPaperSearchPage/NewsPaperPagination"
import TailwindModal from "../../components/TailwindModal";
import { getCities, getCountries, getStates, getPublication } from "../../redux/actions/location";
import {
	getPublicationList
} from "../../redux/actions/publications";
import Button from "../../components/Button";
const getResuleNumbers = (totalRecords, currentPage, limitPerPage) => {
	if(totalRecords > 0 ){
		return <span>Results {numToLocaleString((currentPage-1)*limitPerPage+1)}-{numToLocaleString(totalRecords > (currentPage*limitPerPage)?currentPage*limitPerPage:totalRecords )} of {numToLocaleString(totalRecords)}</span>
	 } else {
		return <span>No Results</span>
	 } 
}
const getName = (values) => {
    let name = []
    if (values.fn) {
        name.push(values.fn)
    }
    if (values.ln) {
        name.push(values.ln) 
    }
    return name.join(' ');
}
const getDateFilter = (values) => {
	let ob = {}
	switch(values.nm) {
		case 'byyear':
            ob = values.ye 
            break;
        case 'before':
            ob = values.be 
            break;
        case 'after':
            ob = values.af 
            break;
        case 'between':
            ob = values.bt
            break;
        case 'exact':
            ob = values.ex 
            break;
	}
	return ob;
}
const NewspapperRecords = () => {
	const {totalRecords, isLoading, list} = useSelector(state => state.publication)
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const defaultValues = getNewspapperDefaultValue();
	const { t } = useTranslation();
	const [showModal, setShowModal] = React.useState(false);
	const [values, setValues] = useState(null);
	const [valuesNew, setValuesNew] = useState(null);
	const [title, setTitle] = useState(null);
	const newsPaperValues = useMemo(() => decodeDataToURL(location.search), [location.search]);
	const [currentPage, setCurrentPage] = useState(newsPaperValues?.pn || 1);
	const [limitPerPage, setLimitPerPage] = useState(
		getPageSize(newsPaperValues?.ps || 10)
	);
	const {
		countryRequest,
		stateRequest,
		countyLoading,
		stateLoading,
		cityRequest,
		cityLoadig,
		publicationRequest,
		publicationLoading
	} = useSelector((state) => state.location)
	const getData = async (search) => {
		if (search) {
			let emptyRowExist = false
			if( newsPaperValues.k ) {
				newsPaperValues.k.forEach((val, index) => {
					if (!(val.m && val.t)) {
						emptyRowExist = true
					}
				})
				!emptyRowExist && newsPaperValues.k.push({"m":"", "t":""})
			}
			setValues({
				...mergeDeep(defaultValues, newsPaperValues),
				ps: getPageSize(newsPaperValues.ps),
			});
		} else {
			history.push("/search/newspapers");
		}
	};
	const handleShowModal = (bool, _title, _values = values) => {
		bool && setValuesNew(_values);
		setTitle(_title)
		setShowModal(bool);
	};
	const handleShowModalNew = (bool, _title) => {
		handleShowModal(bool, _title, defaultValues);
	};

	const handleNewspapperSubmit = () => {
		setShowModal(false);
	}

	useEffect(() => {
		getData(location.search);
	}, [location.search]);
	useEffect(() => {
		!countryRequest && !countyLoading && dispatch(getCountries());
		!stateRequest && !stateLoading && dispatch(getStates(newsPaperValues.cu))
		!cityRequest && !cityLoadig && newsPaperValues.st && dispatch(getCities(newsPaperValues.st))
		!publicationRequest && !publicationLoading && newsPaperValues.ci && dispatch(getPublication(newsPaperValues.ci, newsPaperValues.st))
	}, [dispatch,
		newsPaperValues.cu,
		newsPaperValues.st,
		newsPaperValues.ci,
		countryRequest,
		stateRequest,
		countyLoading,
		stateLoading,
		cityRequest,
		cityLoadig,
		publicationRequest,
		publicationLoading])

	useEffect(() => {
		const _newsPaperValues = Object.assign({}, newsPaperValues)
		let kdArr = _newsPaperValues.k;
		let country = {};
		if (kdArr) {
			let result = {};
			kdArr.forEach(k => {
				result[k.m] = k.t
			});
			_newsPaperValues.k = result
		}
		if (_newsPaperValues.cu) {
			country.cu = _newsPaperValues.cu;
			delete _newsPaperValues.cu;
		}
		if (_newsPaperValues.ci) {
			country.ci = _newsPaperValues.ci;
			delete _newsPaperValues.ci;
		}
		if (_newsPaperValues.st) {
			country.st = _newsPaperValues.st;
			delete _newsPaperValues.st;
		}
		if (_newsPaperValues.pu) {
			country.pid = _newsPaperValues.pu;
			delete _newsPaperValues.pu;
		}
		_newsPaperValues.l = country
		if(_newsPaperValues.nm) {
			_newsPaperValues.dt = {
				dft: _newsPaperValues.nm,
				...getDateFilter(_newsPaperValues)
			}
		}
		delete _newsPaperValues.nm
		delete _newsPaperValues.bt
		delete _newsPaperValues.ye
		delete _newsPaperValues.bf
		delete _newsPaperValues.af
		delete _newsPaperValues.ex
		_newsPaperValues.ps = getPageSize(_newsPaperValues?.ps || 10);
		const urlQuery = encodeDataToURL({ ...formDataTrim(_newsPaperValues) });
		dispatch(getPublicationList(urlQuery, true));
	}, [dispatch, newsPaperValues])

	const getResult = (pageNumber, pageSize, newRequest = true) => {
		const formValues = { ...values }
		formValues.pn = pageNumber;
		formValues.ps = pageSize;
		const urlQuery = encodeDataToURL({ ...formDataTrim(formValues) });
		history.push(`?${urlQuery}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	return <div className="page-wrap universal-search-page">
		<div className="container mx-auto">
			<div className="pt-4 sm:pt-8 lg:flex sm:px-4 xl:px-0">
				<div className="w-full relative md:order-2 n-search-results-wrap lg:pl-7 lg:ml-auto">
					
					<div className="head mb-5 text-center">
						<h2 className="lg:mb-1 mb-4 break-words">
							<Typography
								size={24}
								text="secondary"
								weight="medium">
								All Results for {getName(newsPaperValues)}
							</Typography>
						</h2>
						<div className="edit-new-link-wrap text-center mb-4 lg:hidden">
							<div className="links w-full flex justify-center">
								<Button
									handleClick={(e) => {
										e.preventDefault();
										handleShowModal(true, tr(t, "search.ww1.list.esearch"));
									}}
									title={tr(t, "search.ww1.list.esearch")}
									type="default"
								/>
								<Button
									handleClick={(e) => {
										e.preventDefault();
										handleShowModalNew(true, tr(t, "search.ww1.list.nsearch"));
									}}
									title={tr(t, "search.ww1.list.nsearch")}
									type="default"
								/>
							</div>
						</div>
						{getResuleNumbers(totalRecords, currentPage, limitPerPage)}
					</div>
					<Norecords
						isLoading={isLoading}
						firstName={getName(newsPaperValues)}
						searchResult={list}
					/>
					{isLoading && (
						<div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
						<div className="absolute top-50 z-50 top-2/4 left-2/4">
							<Loader />
						</div>
						</div>
					)}
					<NewsPaperContent />
					<div className="newpapersnav relative pb-4">
						<NewsPaperPagination
							getResult={getResult}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							limitPerPage={limitPerPage}
							setLimitPerPage={setLimitPerPage}
							totalRecords={totalRecords}
							newsPaperValues={newsPaperValues}
						/>
						{<NewsPaperArchive />}
					</div>
				</div>
				<NewsPaperSearch handleModal={handleShowModal} />
				{/*Modal Tailwind Form*/}
				<TailwindModal
					title={title}
					showClose={true} 
					content={
						<NewspaperForm
							defaultValues={valuesNew}
							WWIIIClear={true}
							buttonTitle={tr(t, "search.ww1.form.btn.search")}
							handleNewspapperSubmit={handleNewspapperSubmit}
						/>
					}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			</div>
		</div>
	</div>

}
export default NewspapperRecords;