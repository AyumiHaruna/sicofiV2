<template>
    <div class="row egrProy">
        <div class="col-12">

            <div class="row">
                <div class="col-8 pageTitle">
                    Reporte de Egresos por proyecto
                </div>
            </div>

            <div class="row block">
                <div class="col-12 panel">

                    <VueGoodTable
                        :columns="columns"
                        :rows="outData"
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
                        v-if="outData.length > 0"
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

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'Repote_egr_x_proy',
    components: { VueGoodTable, Toast, LogTest   },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
            outData: [],

            columns: [
                { label:'PROYECTO', field:'projectNumber' }, 
                { label:'NOMBRE DEL PROYECTO', field:'projectName' }, 
                { label:'CUENTA', field:this.accFn },
                { label:'CAP 1000', field:this.cap1Fn }, 
                { label:'CAP 2000', field:this.cap2Fn }, 
                { label:'CAP 3000', field:this.cap3Fn }, 
                { label:'CAP 4000', field:this.cap4Fn }, 
                { label:'CAP 5000', field:this.cap5Fn }, 
                { label:'EJERCIDO', field:this.totalFn }, 
                { label:'COMPROBADO', field:this.checkedFn }, 
                { label:'X COMPROBAR', field:this.xCheckFn }, 
            ],
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

        this.getOutcomesXProy();
    },
    methods: {
        async getOutcomesXProy() {            
            const res = await fetch(`${process.env.apiUrl}/outcomes/get_all_outXProy`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });

            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.outData = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },

        accFn(rowObj){  return this.$store.state.accountType[ rowObj.accountType - 1 ];  },
        cap1Fn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.cap1)}` ); },
        cap2Fn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.cap2)}` ); },
        cap3Fn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.cap3)}` ); },
        cap4Fn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.cap4)}` ); },
        cap5Fn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.cap5)}` ); },
        totalFn(rowObj){  return( `$${this.moneyFormat(rowObj.amounts.total)}` ); },
        checkedFn(rowObj){  return( `$${this.moneyFormat(rowObj.checked)}` ); },
        xCheckFn(rowObj){  return( `$${this.moneyFormat( parseFloat(rowObj.amounts.total) - parseFloat(rowObj.checked) )}` ); },
    }
}
</script>

<style>
    .egrProy .vgt-table th:nth-child(1){
       width: 5% !important;
    }
    .egrProy .vgt-table th:nth-child(2){
       width: 18% !important;
    }
</style>