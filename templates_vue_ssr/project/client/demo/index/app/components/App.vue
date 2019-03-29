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
    import * as service from '../service';

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
                //console.log('computed heros', this.$root.$data.state.heros);
                return this.$root.$data.state.heros;
            }
        },
        mounted(){
            console.log('这是日志');
            let _this = this;
            let loading = false;
            window.addEventListener('scroll', function (e) {
                let SH = document.documentElement.scrollHeight;
                let CH = document.documentElement.clientHeight;
                let SY = window.scrollY;
                if(SH - CH - SY <= 20 && !_this.isAllLoaded && !loading){
                    loading = true;
                    service.clientGetHeros({last_pos: _this.last_pos})
                        .then(resp => {
                            let newHeros = _this.heros.concat(resp.data.data.column_list);
                            _this.$root.addHerosAction(newHeros);
                            if(resp.data.data.column_list.length < 20){
                                _this.isAllLoaded = true;
                            }
                            _this.last_pos = resp.data.data.last_pos;
                            loading = false;
                        })
                }
            })
        },
        methods: {

        }
    }
</script>

<style>

</style>