<template>
  <form>
      <div class="row">
          <div class="col-8 block">
              <div class="row panel">
                  <div class="col-12 title">
                      Datos del proyecto
                  </div>

                  <div class="col-3">
                        <input type="text" name="projectNumber" v-model="formObj.projectNumber" 
                            maxlength="10"  @input="$emit('input', $event.target.formObj)" required
                        >
                        <label for="projectNumber">NÚMERO DE PROYECTO</label>
                  </div>
                  <div class="col-9">
                        <input type="text" name="projectName" v-model="formObj.projectName" @input="$emit('input', $event.target.formObj)">
                        <label for="projectName">NOMBRE DEL PROYECTO</label>
                  </div>

                  <div class="col-2">
                        <b-form-select name="degree" v-model="formObj.degree" @change="$emit('change', $event.target.formObj)">
                            <b-form-select-option value="">Elige un título</b-form-select-option>
                            <b-form-select-option value="Lic">Lic.</b-form-select-option>
                            <b-form-select-option value="Ing">Ing.</b-form-select-option>
                            <b-form-select-option value="Mtra">Mtra.</b-form-select-option>
                            <b-form-select-option value="Mtro">Mtro.</b-form-select-option>
                            <b-form-select-option value="Dra">Dra.</b-form-select-option>
                            <b-form-select-option value="Dr">Dr.</b-form-select-option>
                        </b-form-select>
                        <label for="degree">TÍTULO DEL ENCARGADO</label>
                  </div>
                  <div class="col-10">
                        <input type="text" name="manager" v-model="formObj.manager" maxlength="100" @input="$emit('input', $event.target.formObj)">
                        <label for="manager">NOMBRE DEL ENCARGADO DE PROYECTO</label>    
                  </div>

                  <div class="col-4">
                        <b-form-select name="type" v-model="formObj.type" @input="$emit('change', $event.target.formObj)">
                            <b-form-select-option value="">Elige un tipo de proyecto</b-form-select-option>
                            <b-form-select-option value="pro">Proyecto</b-form-select-option>
                            <b-form-select-option value="gb">Gasto Básico</b-form-select-option>
                            <b-form-select-option value="nom">Nómina</b-form-select-option>
                        </b-form-select>
                        <label for="type">TIPO DE PROYECTO</label>    
                  </div>
                  <div class="col-8 text-right">
                        <button class="btn btn-info"> 
                            <i class="far fa-save"></i>
                            Guardar Proyecto
                        </button>
                  </div>
              </div>
          </div>

          <div class="col-4 block">
              <div class="row panel">
                    <div class="col-12 title"> Totales </div>
                   
                    <div class="col-7">Total autorizado:</div>
                    <div class="col-5">${{value.totalAuth}}</div>
                    <div class="col-7">Total autorizado coordinación:</div>
                    <div class="col-5">${{value.coordAuth}}</div>
                    <div class="col-7">Total autorizado instituto:</div>
                    <div class="col-5">${{value.instAuth}}</div>
                    <div class="col-7">Capítulo 1000:</div>
                    <div class="col-5">${{value.cap1}}</div>
                    <div class="col-7">Capítulo 2000:</div>
                    <div class="col-5">${{value.cap2}}</div>
                    <div class="col-7">Capítulo 3000:</div>
                    <div class="col-5">${{value.cap3}}</div>
                    <div class="col-7">Capítulo 4000:</div>
                    <div class="col-5">${{value.cap4}}</div>
                    <div class="col-7">Capítulo 5000:</div>
                    <div class="col-5">${{value.cap5}}</div>
              </div>
          </div>
      </div>
  </form>
</template>

<script>
export default {
    name: 'ProjectForm',
    props: [
        // nombre: String,
        // myObj: Object
        'value'
    ],
    data() {
        return {
            formObj: {
                type: '',
                projectNumber: '',
                projectName: '',
                degree: '',
                manager: '',
                year: '',
                totalAuth: 0,
                coordAuth: 0,
                instAuth: 0,
                cap1: 0,
                cap2: 0,
                cap3: 0,
                cap4: 0,
                cap5: 0,
                accounts: []
            },
        }
    },
    mounted() {
        this.formObj = this.value;
    },
    computed: {
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

    .block {
        padding: 0 2em;
    }
    .panel{
        border: none; 
        border-radius: 10px;
        background: #0f143c;
        font-family:'Montserrat', sans-serif;
    }
    .title {
        font-size: 1.2em;
        font-weight: bold;
        text-align: center;
        padding: 1.2em 0 0.5em 0;
    }
    /* .projectForm input.text,
    .projectForm textarea.standard,
    .projectForm select,
    .projectForm input.date {  */
    input, select {
        background-color:#282a57;
        border:solid 0px white;
        font-size: 1em;
        color:#f3f6f4;
        -moz-border-radius:5px;
        -webkit-border-radius:5px;
        border-radius:5px;
        padding: 0.5em 1em;
        width:100%;
        box-sizing:border-box;
    }
    label {
        font-size: 0.8em;
        letter-spacing: 3px;
        color: #b3bada;
    }

    
    button {
        box-shadow: 0px 0px 10px 0px #589eb0;
        background-color:#16b8b8;
        border-radius:10px;
        display:inline-block;
        cursor:pointer;
        color:#ffffff;
        font-family:Arial;
        font-size:17px;
        padding: 0.5em;
        text-decoration:none;
        text-shadow:0px 1px 0px #00a6ff;
    }
    button:hover {
        background-color:#05949e;
    }
    button:active {
        position:relative;
        top:1px;
    }

        
</style>