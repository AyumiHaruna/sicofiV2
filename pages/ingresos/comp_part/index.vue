<template>
    <div class="row compPart">
        <div class="col-12">
            <div class="row">
                <div class="col-6 pageTitle">
                    Comparativo de Partidas
                </div>

                <div class="col-4 offset-2">
                    <!-- <ProjectFilter></ProjectFilter> -->
                </div>
            </div>

            <div class="row block">
                <div class="col-12 panel">

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
    name: 'ComparativoPartidas',
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

            // selectedProject: '',

            // controlCap: [true, true, true, true, true],
            // controlAcc: [true, true],

            columns: [
                { label:'# PROY', field:'projectNumber' },
                { label:'NOMBRE DE PROYECTO', field:'projectName' },
                { label:'CUENTA', field:this.accFn },
                { label:'# PART', field:'partNumber' },
                { label:'NOMBRE DE PARTIDA', field:'partName' },
                { label:'MES', field:this.monthFn },
                { label:'AUTORIZADO', field:this.autFn },
                { label:'EJERCIDO', field:this.cheFn },
                { label:'X COMPROBAR', field:this.difFn },
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

        this.getAllParts();
    },
    methods: {
        async getAllParts() {
            const res = await fetch(`${process.env.apiUrl}/incomes/comp_part`, {
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
        monthFn(rowObj){ return this.$store.state.monthList[ rowObj.month - 1]; },
        autFn(rowObj){  return `$${this.moneyFormat( rowObj.authorized )}`; },
        cheFn(rowObj){  return `$${this.moneyFormat( rowObj.checked )}`; },
        difFn(rowObj){ return `$${this.moneyFormat( parseFloat(rowObj.authorized) - parseFloat(rowObj.checked) )}` }
    },
    computed: {
        filteredTable: function() {
            let newArray = [];  // save amounts (auth, checked)
            let contArray = [];     // save created sf entry list

            this.projectData.forEach(proj => {
                proj.proParts.forEach(part => {
                    for (let i=1; i<=12; i++) {
                        if( part[`month${i}`] > 0 ){
                            if( contArray.includes(`${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${i}`) ){
                                // element position
                                let index = contArray.indexOf( `${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${i}` );
                                // update ammount
                                newArray[ index ].authorized =  parseFloat(newArray[ index ].authorized) + parseFloat(part[`month${i}`]);
                            } else {
                                // create ammount
                                contArray.push( `${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${i}` )
                                newArray.push({
                                    'projectNumber': proj.projectNumber,
                                    'projectName': proj.projectName,
                                    'accountType': proj.accountType,
                                    'partNumber': part.partNumber,
                                    'partName': part.partName ,
                                    'month': i,
                                    'authorized': part[`month${i}`],
                                    'checked': 0
                                })
                            }
                        }
                    }
                });

                proj.checkParts.forEach(part => {
                    //get month
                    let month = (part.sfId).substring(5,6);
                    if( contArray.includes(`${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${month}`) ){
                        // update ammount
                        let index = contArray.indexOf(`${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${month}`);
                        newArray[ index ].checked =  parseFloat(newArray[ index ].checked) + parseFloat(part.total);
                    } else {
                        // create ammount
                        contArray.push( `${proj.projectNumber}/${proj.accountType}/${part.partNumber}/${month}` );
                        newArray.push({
                            'projectNumber': proj.projectNumber,
                            'projectName': proj.projectName,
                            'accountType': proj.accountType,
                            'partNumber': part.partNumber,
                            'partName': part.partName ,
                            'month': month,
                            'authorized': 0,
                            'checked': part.total
                        })
                    }
                });
            });
            // console.log(contArray);
            // console.log(newArray);

            // this.projectData.forEach(elm => {
            //     console.log(elm);
            //     if( this.controlAcc[0] && elm.accountType == 1 ){
            //         newArray.push(elm);
            //     }
            //     if( this.controlAcc[1] && elm.accountType == 2 ){
            //         newArray.push(elm);
            //     }
            // });

            return newArray;
        }
    }
}
</script>

<style>
    .compPart .bordered{
        margin-bottom: 1em;
    }
    .compPart .warning{
        border: solid 1px orange;
        border-radius: 5px;
        color: orange;
        font-size: 1.5em;
        padding: 0.5em;
        margin-bottom: 1em;
    }
    .compPart .vgt-table th:nth-child(1){
       width: 8% !important;
    }
    .compPart .vgt-table th:nth-child(2){
       width: 20% !important;
    }
    .compPart .vgt-table th:nth-child(5){
       width: 20% !important;
    }
</style>