import axios from 'axios';

export function getHeros(params){
    return  Promise.resolve({
        data: ['雷神', '美队', '黑寡妇', '钢铁侠']
    })
}
