<template>
    <div class="block card">
        <div>{{mdata}}</div>
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
        height: 6rem;
        border-bottom: 1px solid #dddddd;
    }



</style>