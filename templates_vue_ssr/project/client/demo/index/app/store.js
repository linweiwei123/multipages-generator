import * as service from './service'

var store =  {
    state: {
        message: 'hello',
        heros: [],
    },
    setHerosAction() {
        return service.getHeros()
            .then( resp => {
                // resp需要对上data
                //console.log('=====返回的heros', resp.data.data.column_list);
                this.state.heros = resp.data.data.column_list;
            })
    },
    addHerosAction(newValue){
        this.state.heros = newValue;
    },
    clearHerosAction(){
        this.state.heros = [];
    }
}


export function createStore() {
    return store;
}