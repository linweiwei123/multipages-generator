<template>
    <div class="blockBar">
        <div v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="banner in banners">
                    <div class="banner">
                        <img :src="banner" alt="">
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Bar",
        components: {

        },
        data(){
            return {
                banners: [ 'http://pic-ybb.seeyouyima.com/qa_activity/tools/5bbd554437977_541_300.jpg', 'http://pic-ybb.seeyouyima.com/qa_activity/tools/5c24482b69f5a_360_360.png' ],
                swiperOption: {
                    pagination: {
                        el: '.swiper-pagination'
                    },
                    // some swiper options...
                }
            }
        }
    }
</script>

<style scoped>
    .blockBar{
        background-color: yellow;
    }

    .banner{
        width: 100%;
        height: 200px;
        position: relative;
    }
    .banner img{
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>