import Typography from "./../../components/Typography";
const MiddleCards=()=>{
    return <>     
        <div className="middle-cards w-full">
        <div className="bg-white card welcome-card">
        <div className="card-content-wrap py-3 px-6">
                <div className="head">
                    <h3><Typography
                        size={14}
                        text="secondary"
                        weight="medium">
                        Welcome
                    </Typography></h3>
                </div>
                <div className="card-content"></div>
            </div>
        </div>
        </div>    
    </>
}
export default MiddleCards;