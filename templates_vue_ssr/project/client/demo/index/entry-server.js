import { createApp } from "./app/app";
import { createStore } from "./app/store";

export default context => {
    const store = createStore();
    const { app, App } = createApp(store);

    console.log('请求开始', new Date().getTime())
    return App.asyncData(store)
        .then( resp => {
            console.log('请求返回', new Date().getTime())
            context.state = store.state;
            return app;
        })
}