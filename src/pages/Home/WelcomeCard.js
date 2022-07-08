import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";
import GroupBookIcon from "./../../assets/images/groupbook-icon.svg";
import { tr } from "../../components/utils";

const WelcomeCard = () => {

  const history = useHistory()

  const { t } = useTranslation();

  const handleAddStory = () => {
       history.push("/stories/add/0")
  }

    return (
        <div className="middle-cards w-full">
            <div className="bg-white card welcome-card px-4 pt-4 pb-3">
                <div className="card-content-wrap py-3 px-6">
                    <div className="card-content">
                        <div className="vector flex w-full justify-center mb-4">
                            <img src={GroupBookIcon} alt="welcome to Storied" />
                        </div>
                        <div className="welcome-info text-center mb-6 w-full max-w-lg px-4 flex flex-col mx-auto">
                            <h3 className="mb-1.5">
                                <Typography size={20} text="secondary" weight="bold">Welcome to Storied!</Typography>
                            </h3>
                            <p className="info-sp-block">
                              <Typography size={14} text="secondary">
                                 {tr(t,"home.WelcomeCard.welcomeNote")}
                              </Typography>
                            </p>
                        </div>
                        <div className="button-wrap flex w-full justify-center">
                            <Button
                                handleClick={handleAddStory}
                                size="large"
                                title="Tell a story" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default WelcomeCard