<template>
    <div class="container-fluid">
        <Menu />
        <nuxt />
    </div>
</template>

<script>
import Menu from '../components/general/Menu.vue';

export default {
    components: {
        Menu
    },
    head: {
        script: [
            {
                hid: 'stripe', 
                src: 'https://kit.fontawesome.com/035f9caf7c.js', 
                defer: true
            }
        ]
    }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }

    .container-fluid {
        font-size: 14px;
        background: #272b4a;
        color: #fff;
        min-height: 100vh;
        overflow-x: hidden;
    }

    .block {
        padding: 0 2em !important;
        margin-bottom: 2em;
    }
    .panel{
        border: none; 
        border-radius: 10px;
        background: #0f143c;
        font-family:'Montserrat', sans-serif;
        color:#b3e6ff;
        padding: 1em 0;
    }
    .borderedPanel{
        border: solid 1px #6666ff;
    }

    .title {
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
        padding: 1.2em 0 0.5em 0;
    }

    input, select, textarea, .b-form-datepicker {
        background-color:#282a57 !important;
        border:solid 0px white !important;
        font-size: 1em !important;
        color:#e6e6e6 !important;
        -moz-border-radius:5px;
        -webkit-border-radius:5px;
        border-radius:5px;
        padding: 0.5em 1em;
        width:100%;
        box-sizing:border-box;
    }
    .b-form-datepicker label, .b-icon{
        color: #e6e6e6;
    }
    .blockedField{
        color: #99ff99 !important;
    }
    label {
        font-size: 0.7em;
        font-weight: bold;
        letter-spacing: 3px;
        color: #b3bada;
        margin-bottom: 1em;
    }

    .actionBtn{        
        border: solid 0px #fff;
        border-radius:10px;
        display:inline-block;
        cursor:pointer;
        color:#ffffff;
        font-size:0.9em;
        font-weight: bold;
        padding: 0.8em 1.3em;
        text-decoration:none;
        margin: 1em 1.5em;
        letter-spacing: 1.3px;
    }
    .actionBtn i{
        font-size: 1.4em;
        margin-right: 0.2em;
    }
    .actionBtn:active {
        position:relative;
        top:1px;
    }

    .infoBtn {
        box-shadow: 0px 0px 5px 0px #00ccff;
        background-color:#15a8a8;        
        text-shadow:0px 1px 0px #00a6ff;
    }
    .infoBtn:hover {
        background-color:#05949e;
    }
    .closeBtn {
        box-shadow: 0px 0px 8px 0px #ba0057;
        background-color:#b8164f;
        text-shadow:0px 1px 0px #ba0057;
    }
    .closeBtn:hover {
        background-color:#91133f;
    }
    .saveBtn {
        box-shadow: 0px 0px 8px 0px #019e13;
        background-color:#129b16;
        text-shadow:0px 1px 0px #01a014;
    }
    .saveBtn:hover {
        background-color:#139128;
    }
    .warningBtn {
        box-shadow: 0px 0px 8px 0px #969e01;
        background-color:#9b9212;
        text-shadow:0px 1px 0px #a09b01;
    }
    .warningBtn:hover {
        background-color:#809113;
    }
</style>