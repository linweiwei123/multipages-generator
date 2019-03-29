<template>
    <div id="app">
        <h1>Vue SSR </h1>
        <bar></bar>
        <foo v-for="(hero, index) in heros" :key="index" :mdata="hero"></foo>
    </div>
</template>

<script>
    import Bar from './Bar';
    import Foo from './Foo';

    export default {
        name: "App",
        data(){
          return {
              last_pos: 20,
              isAllLoaded: false
          }
        },
        asyncData(store){
            return store.setHerosAction();
        },
        components: {
            Bar,
            Foo
        },
        computed: {
            heros(){
                return this.$root.$data.state.heros;
            }
        },
        mounted(){
            console.log('这是日志', window);
        },
        methods: {

        }
    }
</script>

<style>
    h1{
        text-align: center;
    }
</style>