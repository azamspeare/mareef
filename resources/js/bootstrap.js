import axios from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Make Ziggy route helper globally available
window.route = ziggyRoute;
