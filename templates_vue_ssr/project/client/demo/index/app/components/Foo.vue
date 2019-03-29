<template>
    <div class="block card">
        <div class="card__img">
            <img :src="mdata.app_img" alt="">
        </div>
        <div class="card__text">
            <div class="card__title">{{mdata.title}}</div>
            <div content="card__subtitle">{{mdata.author_title}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Foo",
        props: ['mdata']
    }
</script>

<style scoped>
    .block{
        background-color: #fff;
    }

    .card{
        position: relative;
        padding: 1rem 1.5rem;
        height: 12rem;
        border-bottom: 1px solid #dddddd;
    }

    .card>*{
        display: inline-block;
    }

    .card:after{
        content: "";
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
    }

    .card__text{
        display: block;
        margin-left: 14rem;
        height: 100%;
        width: auto;
    }

    .card__title{
        font-size: 18px;/*px*/
    }

    .card__img{
        position: relative;
        height: 12rem;
        width: 12rem;
        float: left;
        overflow: hidden;
        border-radius: 0.5rem;
    }

    .card__img img{
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

</style>