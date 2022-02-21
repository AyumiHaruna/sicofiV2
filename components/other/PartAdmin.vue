<template>
    <div>
        <div class="row partAdmin block">
            <div class="col-12 panel">
                <div class="row">
                    <div class="col-12 bordered">
                        <div class="row">
                            <div class="col-12 text-right">
                                <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir año" alt="Añadir año" @click="openPartForm()">
                                    <i class="fa-solid fa-clipboard-list"></i>
                                    CREAR PARTIDA
                                </button>
                            </div>

                            <div class="col-6">
                                <div class="row">
                                    <div class="col-12 sectionTitle">
                                        PARTIDAS ACTIVAS
                                        <i class="fa-solid fa-sun"></i>
                                    </div>
                                    <div class="col-12">
                                        <table class="secondLvl">
                                            <tr>
                                                <th># PARTIDA</th>
                                                <th>NOMBRE PARTIDA</th>
                                                <th>MODIFICAR</th>
                                            </tr>    
                                            <tr v-for="(part, index) in partList" :key="part.id" :class="(part.active)? '' : 'hidObj' ">
                                                <td>{{part.partNumber}}</td>
                                                <td>{{part.partName}}</td>
                                                <td @click="openPartForm(index)"><i class="fa-solid fa-sun"></i></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="row">
                                    <div class="col-12 sectionTitle">
                                        PARTIDAS INACTIVAS
                                        <i class="fa-solid fa-moon"></i>
                                    </div>
                                    <div class="col-12">
                                        <table class="secondLvl">
                                            <tr>
                                                <th># PARTIDA</th>
                                                <th>NOMBRE PARTIDA</th>
                                                <th>MODIFICAR</th>
                                            </tr>    
                                            <tr v-for="(part, index) in partList" :key="part.id" :class="(!part.active)? '' : 'hidObj' ">
                                                <td>{{part.partNumber}}</td>
                                                <td>{{part.partName}}</td>
                                                <td @click="openPartForm(index)"><i class="fa-solid fa-moon"></i></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </div>

        <div class="row smoke" v-if="showPartForm">
            <div class="col-8 offset-2">
                <div class="row partAdminForm panel">
                    <div class="col-12 bordered">
                        <div class="row">
                            <div class="col-3">
                                <input type="text" name="partNumber" v-model="objForm.partNumber">
                                <label for="partNumber"># PARTIDA</label>
                            </div>
                            <div class="col-6">
                                <input type="text" name="partName" v-model="objForm.partName">
                                <label for="partName">NOMBRE DE PARTIDA</label>
                            </div>
                            <div class="col-3 text-center">
                                <input type="checkbox" name="active" v-model="objForm.active">
                                <label for="active">ACTIVA</label>
                            </div>
                            <div class="col-12 text-right">
                                <button class="actionBtn closeBtn" @click.prevent="showPartForm = false">
                                    <i class="fa-solid fa-xmark"></i>
                                    CANCELAR
                                </button>

                                <button class="actionBtn saveBtn" @click.prevent="validateForm()">
                                    <i class="far fa-save"></i>
                                    GUARDAR PARTIDA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PartAdmin',
    data() {
        return {
            partList: [],
            objForm: {
                id: '',
                partNumber: '',
                partName: '',
                active: true
            },
            showPartForm: false
        }
    },
    mounted() {
        this.getAllParts();
    },
    methods: {
        async getAllParts(){
            const res = await fetch( `${process.env.apiUrl}/parts/list_all` );
            const resData = await res.json();

            // if is a success data
            if(resData.status === 200) {
                this.partList = resData.results;
            } else {    //show error message
                this.$parent.$refs.toast.makeToast('error', `No se pudo cargar la lista de años activos, intenta nuevamente`);
            }   
        },
        async savePart(){
            let url = '';
            if( this.objForm.id == ''){
                url = `${process.env.apiUrl}/partList/create`
            } else {
                url = `${process.env.apiUrl}/partList/update`
            }

            const res = await fetch( url ,  
            {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(this.objForm)
            });

            const resData = await res.json();

            // if is a success data
            if(resData.action == 'ok') {
                this.$parent.$refs.toast.makeToast('success', `Partida guardada exitosamente`);
                this.getAllParts();
                this.showPartForm = false;
            } else if(resData.action == 'exist') {    //show error message
                this.$parent.$refs.toast.makeToast('error', `La partida capturada ya existe`);
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un error al guardar la partida, intenta nuevamente`);
            } 

        },
        openPartForm( index = null ) {
            if(index != null){               
                this.objForm= {
                    id: this.partList[index]['id'],
                    partNumber: this.partList[index]['partNumber'],
                    partName: this.partList[index]['partName'],
                    active: this.partList[index]['active']
                }
            } else {
                this.objForm= {
                    id: '',
                    partNumber: '',
                    partName: '',
                    active: true
                }
            }

            this.showPartForm = true;
        },
        validateForm(){
            //test partNumber
            if( this.objForm.partNumber == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "numero de partida"`); return  }
            //test partName
            if( this.objForm.partName == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "nombre de la partida"`); return  }

            this.savePart();
        },
    }
}
</script>

<style>
.partAdmin .hidObj{
    display: none;
}
.partAdmin .secondLvl th:nth-child(1){
    width: 15%;
}
.partAdmin .secondLvl th:nth-child(3){
    width: 15%;
}
.partAdmin .secondLvl td:nth-child(2){
    text-align: left !important;
    padding: 0.5em 1em;
}
.partAdmin .secondLvl i{
    cursor: pointer;
    font-size: 1.5em;
}
.partAdmin .secondLvl .fa-sun{
    color: orange;
}
.partAdmin .secondLvl .fa-moon{
    color: #f7a5ff;
}

.partAdminForm {
    margin-top: 15em;
}
</style>