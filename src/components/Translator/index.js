import { useTranslation } from 'react-i18next';
import { tr } from "../utils"

const Translator = ({ tkey }) => {

    const { t } = useTranslation();
     
    return tr(t, tkey);

}


export default Translator;