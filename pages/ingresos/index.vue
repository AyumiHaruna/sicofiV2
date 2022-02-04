<template>
    <div class="row incomeList">
        <div class="col-12">

            <div class="row">
                <div class="col-4 pageTitle">
                    Lista de S.F.
                </div>

                <div class="col-4">
                    <div class="row">
                        <div class="col-6">
                            <input type="number" v-model="printForm.start" @keypress="isNumber($event)">
                            <label for="starPrint">IMPRIMIR DESDE </label>        
                        </div>

                        <div class="col-6">
                            <input type="number" v-model="printForm.end" @keypress="isNumber($event)">
                            <label for="endPrint">HASTA</label>
                        </div>

                        <div class="col-12 text-center">
                            <button class="actionBtn warningBtn" v-b-tooltip.hover title="Imprimir en grupo" alt="Imprimir en grupo" @click="validatePrint()">
                                <i class="fas fa-print"></i>
                                S.F. IMPRIMIR GRUPO
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-4 proyForm">
                    <ProjectFilter></ProjectFilter>
                    <nuxt-link to="/ingresos/sf_formulario">
                        <button class="actionBtn saveBtn addBtn" v-b-tooltip.hover title="Nueva solicitud de fondos" alt="Nueva solicitud de fondos">
                            <i class="fas fa-folder-plus"></i>
                            NUEVA S.F.
                        </button>
                    </nuxt-link>   

                    <nuxt-link to="/ingresos/reintegros">
                        <button class="actionBtn saveBtn addBtn" v-b-tooltip.hover title="Nueva reintegro" alt="Nueva reintegro">
                            <i class="fas fa-piggy-bank"></i>
                            NUEVO REINTEGRO
                        </button>
                    </nuxt-link>  
                </div>
            </div>

            <sfListProyect v-model="selectedProject" v-show="projectList != ''"></sfListProyect>

            <Toast ref="toast"></Toast>     
            <LogTest ref="logTest" />     
        </div>
    </div>
</template>

<script>
import ProjectFilter from '@/components/general/ProjectFilter.vue';
import sfListProyect from '@/components/incomes/list/sfListProyect.vue'

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sf_list',
    mixins: [ GlobalFunctions ],
    components: {  ProjectFilter, sfListProyect, Toast, LogTest   },
    data() {
        return {
            projectList: '',
            selectedProject: '',
            printForm: {
                start: '',
                end: ''
            }
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 )
        
        this.getProjectsSF();
    },
    methods: {
        async getProjectsSF() {
            const res = await fetch(`${process.env.apiUrl}/incomes/sf_proy_list/${localStorage.getItem('year')}`);
            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.projectList = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
        validatePrint() {
            //test startNumber 
            if( this.printForm.start == '' ){ this.$refs.toast.makeToast('warning', `Para imprimir por grupo captura el "Numero inicial"`); return  }
            //test startNumber 
            if( this.printForm.end == '' ){ this.$refs.toast.makeToast('warning', `Para imprimir por grupo captura el "Numero final"`); return  }
        
            window.open(`${this.getApiUrl}/print/income/${this.printForm.start}/${this.printForm.end}`, '_blank');
        },
        async deleteRei( index ) {
            const res = await fetch(`${process.env.apiUrl}/incomes/del_return`, {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },                
                body: JSON.stringify({
                    'sfId': index
                })
            });

            const resData = await res.json(); 

            if( resData.status === 200 ){
                //send success message
                this.$refs.toast.makeToast('success', `Reintegro eliminado exitosamente`);
                this.getProjectsSF();
            } else {
                //send error message
                this.$parent.$refs.toast.makeToast('error', `El reintegro no pudo ser eliminado, intenta nuevamente`);
            }       
        }
    }
    
} 
</script>

<style>
    .incomeList .addBtn{
        margin-bottom: 0;
    }
</style>