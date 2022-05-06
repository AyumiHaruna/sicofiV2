<template>
    <div class="row compCaps">
        <div class="col-12">
            <div class="row">
                <div class="col-6 pageTitle">
                    Comparativo de Capítulos
                </div>

                <div class="col-4 offset-2">
                    <!-- <ProjectFilter></ProjectFilter> -->
                </div>                
            </div>

            <div class="row block">
                <div class="col-12 panel">

                    <div class="row">
                        <div class="col-12 bordered">
                            <div class="row justify-content-center">
                                <div class="col-2 text-center">
                                    <input type="checkbox" name="cap1" v-model="controlCap[0]">
                                    <label for="cap1">CAP 1000</label>
                                </div>
                                <div class="col-2 text-center">
                                    <input type="checkbox" name="cap2" v-model="controlCap[1]">
                                    <label for="cap2">CAP 2000</label>
                                </div>
                                <div class="col-2 text-center">
                                    <input type="checkbox" name="cap3" v-model="controlCap[2]">
                                    <label for="cap3">CAP 3000</label>
                                </div>
                                <div class="col-2 text-center">
                                    <input type="checkbox" name="cap4" v-model="controlCap[3]">
                                    <label for="cap4">CAP 4000</label>
                                </div>
                                <div class="col-2 text-center">
                                    <input type="checkbox" name="cap5" v-model="controlCap[4]">
                                    <label for="cap5">CAP 5000</label>
                                </div>                                    
                                <div class="col-6 text-center">
                                    <input type="checkbox" name="coordinacion" v-model="controlAcc[0]">
                                    <label for="coordinacion">CUENTA DE LA COORDINACIÓN</label>
                                </div>
                                <div class="col-6 text-center">
                                    <input type="checkbox" name="instituto" v-model="controlAcc[1]">
                                    <label for="instituto">CUENTA DEL INSTITUTO</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 text-center warning">
                            Los reintegros al instituto son un recurso no disponible
                        </div>
                    </div>

                    <VueGoodTable
                        :columns="columns"
                        :rows="filteredTable"
                        styleClass="vgt-table bordered"
                        :pagination-options="{
                        enabled: true,
                        mode: 'pages',
                        perPage: 30,
                        perPageDropdown: [30, 50],
                        dropdownAllowAll: true,
                        setCurrentPage: 1,
                        jumpFirstOrLast : true,
                        firstLabel : 'Primer.',
                        lastLabel : 'Última.',
                        nextLabel: 'sig.',
                        prevLabel: 'pre.',
                        rowsPerPageLabel: 'RESULTADOS POR PÁGINA',
                        ofLabel: 'DE',
                        pageLabel: 'PAG.', // for 'pages' mode
                        }"
                        :search-options="{
                        enabled: true,
                        placeholder: 'Buscar en esta tabla',
                        }"
                        v-if="filteredTable.length > 0"
                    />

                </div>
            </div>


            <Toast ref="toast"></Toast>        
            <LogTest ref="logTest" /> 

        </div>
    </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

import ProjectFilter from '@/components/general/ProjectFilter.vue';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'ComparativoCapitulos',
    components: { VueGoodTable, ProjectFilter, Toast, LogTest   },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            projectData: [],
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
            projectTypes: {
                pro: 'Proyecto',
                gb: 'Gasto Básico',
                nom: 'Nómina'
            },
            selectedProject: '',

            controlCap: [true, true, true, true, true],
            controlAcc: [true, true],

            columns: [
                { label:'#', field:'projectNumber' }, 
                { label:'PROYECTO', field:'projectName' }, 
                { label:'CUENTA', field:this.accFn }, 
                { label:'AUTORIZADO', field: this.autFn }, 
                { label:'MINISTRADO', field: this.minFn },
                { label:'REINTEGROS', field: this.reiFn }, 
                { label:'EJERCIDO', field: this.outFn }, 
                { label:'RECURSO DISPONIBLE', field: this.difFn }, 
            ]
        }
    },
    mounted() {
        // get working year and number
        if(process.client){
            this.dataObject.year = localStorage.getItem('year');
            this.dataObject.id = localStorage.getItem('id');
            this.dataObject.fullAccess = localStorage.getItem('fullAccess');
            if(this.dataObject.fullAccess == 0){
                this.dataObject.projectList = localStorage.getItem('projectList');
            }
        }

        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 3 );

        this.getAllProjects();
    },
    methods: {
        async getAllProjects() {            
            const res = await fetch(`${process.env.apiUrl}/projects/comp_caps`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });

            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.projectData = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
        
        accFn(rowObj){  return this.$store.state.accountType[ rowObj.accountType - 1 ];  },
        autFn(rowObj){  
            let account = 0
            for (let i = 0; i < 5; i++) {
                if( this.controlCap[i] ){
                    account += parseFloat(rowObj.tAutorized[i]);
                }
            }
            return `$${this.moneyFormat(account)}`;
        },
        minFn(rowObj){  
            let account = 0;
            for (let i = 0; i < 5; i++) {
                if( this.controlCap[i] ){
                    account += parseFloat(rowObj.tMinistered[i]);
                }
            }
            return `$${this.moneyFormat(account)}`;
        },
        reiFn(rowObj){  
            let account = 0;
            for (let i = 0; i < 5; i++) {
                if( this.controlCap[i] ){
                    account += parseFloat(rowObj.tReincome[i]);
                }
            }
            return `$${this.moneyFormat(account)}`;
        },
        outFn(rowObj){  
            let account = 0;
            for (let i = 0; i < 5; i++) {
                if( this.controlCap[i] ){
                    account += parseFloat(rowObj.tOutcome[i]);
                }
            }
            return `$${this.moneyFormat(account)}`;
        },
        difFn(rowObj){
            let account = 0;
            for (let i = 0; i < 5; i++) {
                if( this.controlCap[i] ){
                    account += parseFloat(rowObj.tMinistered[i]);
                    account += parseFloat(rowObj.tReincome[i]);
                    account -= parseFloat(rowObj.tOutcome[i]);
                }
            }
            return `$${this.moneyFormat(account)}`;
        }
    },
    computed: {
        filteredTable: function() {
            let newArray = [];

            this.projectData.forEach(elm => {
                // console.log(elm);    
                if( this.controlAcc[0] && elm.accountType == 1 ){
                    newArray.push(elm);
                }
                if( this.controlAcc[1] && elm.accountType == 2 ){
                    newArray.push(elm);
                }
            });

            return newArray;
        }
    }
}
</script>

<style>
    .compCaps .bordered{
        margin-bottom: 1em;
    }
    .compCaps .warning{
        border: solid 1px orange;
        border-radius: 5px;
        color: orange;
        font-size: 1.5em;
        padding: 0.5em;
        margin-bottom: 1em;
    }
    .compCaps .vgt-table th:nth-child(1){
       width: 8% !important;
    }
    .compCaps .vgt-table th:nth-child(2){
       width: 25% !important;
    }
</style>