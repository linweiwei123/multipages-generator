import * as service from './service'

var store =  {
    state: {
        message: 'hello',
        heros: [],
    },
    setHerosAction() {
        return service.getHeros()
            .then( resp => {
                this.state.heros = resp.data;
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