import { config } from '../configProvider';
import { notification } from '../NotificationProvider';
import { Dimensions } from 'react-native';
import { localStorage } from '../localStorageProvider';
import { Lang_chg } from '../Language_provider';
import { consolepro } from '../Messageconsolevalidationprovider/Consoleprovider'
import { msgProvider, msgTitle, msgText } from '../Messageconsolevalidationprovider/messageProvider';
import { validation } from '../Messageconsolevalidationprovider/Validation_provider';
import { Currentltlg } from '../Curentlatlong';
import Cameragallery from '../Mediaprovider/Cameragallery';
import { mediaprovider } from '../Mediaprovider/Mediaprovider'
import { SocialLogin } from '../Apicallingprovider/SocialLoginProvider';
import { apifuntion } from '../Apicallingprovider/apiProvider';
import { Colors, Font } from '../Colorsfont';
import { localimag } from '../Localimageprovider/Localimage';
import Mapprovider from '../Mapprovider';
import Otpprovider from '../Otpprovider';
import { pushnotification } from '../Pushnotificationredirection';
const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);

export { config, Otpprovider,pushnotification, localimag, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg, notification }

