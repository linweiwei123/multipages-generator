import axios from 'axios';
import {isBrowser} from "../../../common/js/commonUtils";

export function getHeros(params){
    // return axios.get('http://127.0.0.1:8080/heros');
    // return axios.get('https://api.github.com/users/linweiwei123/repos');
    let host = isBrowser() ? "" : "http://test-ybbview.seeyouyima.com";
    return axios.get(host + '/gravidity-api/v2/knowledge_column_list_v2', { params });
}

export function clientGetHeros(params){
    // return axios.get('http://127.0.0.1:8080/heros');
    // return axios.get('https://api.github.com/users/linweiwei123/repos');
    return axios.get('/gravidity-api/v2/knowledge_column_list_v2', { params });
}
