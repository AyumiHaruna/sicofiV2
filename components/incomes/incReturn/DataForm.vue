<template>
    <form>
        <div class="row">
            <div class="col-12 panel dataForm">
                <div class="row">
                    <div class="col-12 bordered">
                        <div class="row">

                            <div class="col-12 sectionTitle">
                                DATOS GENERALES
                            </div>

                            <div class="col-8">
                                <select ref="projectNumber" v-model="$parent.incomeData.projectNumber">
                                    <option value="">- Elige un proyecto -</option>
                                    <option :value="project.projectNumber" v-for="(project, index) in projectsList" :key="index">
                                        {{ project.projectNumber }} - {{ project.projectName}}
                                    </option>
                                </select>
                                <label for="">PROYECTO</label>
                            </div>                            
                            <div class="col-4">
                                <select v-model="$parent.incomeData.type" class="blockedField" disabled>
                                    <option value="rei">REINTEGRO</option>
                                </select>
                                <label for="">TIPO</label>
                            </div>

                            <div class="col-8">
                                <input type="text" v-model.trim="$parent.incomeData['concept']" />
                                <label for="">CONCEPTO</label>
                            </div>
                            <div class="col-4">
                                <select ref="account" v-model="$parent.incomeData['account']">
                                    <option value="">- Elige una cuenta -</option>
                                    <option value="1">Coordinación</option>
                                    <option value="2">Instituto</option>
                                </select>
                                <label for="">CUENTA</label>
                            </div>

                            <div class="col-3">
                                <select v-model="$parent.incomeData['opType']">
                                    <option value="">- Eliga el tipo de operación -</option>
                                    <option value="gba">Gasto Básico</option>
                                    <option value="gop">Gastos Operación</option>
                                    <option value="inv">Inversión</option>
                                    <option value="pro">Recursos Fiscales</option>
                                    <option value="gad">Gastos Administración</option>
                                    <option value="ter">Con aportación de terceros</option>
                                </select>
                                <label for="">TIPO DE OPERACIÓN</label>
                            </div>
                            <div class="col-3">
                                <select ref="month" v-model="$parent.incomeData['month']">
                                    <option value="">- Elige un mes -</option>
                                    <option :value="(index+1)" v-for="(month, index) in $store.state.monthList" :key="month">{{ month }}</option>
                                </select>
                                <label for="">MES</label>
                            </div>
                            <div class="col-3">
                                <input type="date" v-model="$parent.incomeData['elabDate']">
                                <label for="">FECHA DE ELABORACIÓN</label>
                            </div>                            
                            <div class="col-3">
                                <input type="text" v-model="$parent.incomeData['authNum']">
                                <label for="">NÚMERO DE AUTORIZACIÓN</label>
                            </div>

                            <div class="col-12 sectionTitle">
                                MONTOS
                            </div>

                            <div class="col-2">
                                <input type="number" v-model="$parent.incomeData.cap1" @keypress="isNumber($event)">
                                <label for="">CAPÍTULO 1000</label>
                            </div>
                            <div class="col-2">
                                <input type="number" v-model="$parent.incomeData.cap2" @keypress="isNumber($event)">
                                <label for="">CAPÍTULO 2000</label>
                            </div>
                            <div class="col-2">
                                <input type="number" v-model="$parent.incomeData.cap3" @keypress="isNumber($event)">
                                <label for="">CAPÍTULO 3000</label>
                            </div>
                            <div class="col-2">
                                <input type="number" v-model="$parent.incomeData.cap4" @keypress="isNumber($event)">
                                <label for="">CAPÍTULO 4000</label>
                            </div>
                            <div class="col-2">
                                <input type="number" v-model="$parent.incomeData.cap5" @keypress="isNumber($event)">
                                <label for="">CAPÍTULO 5000</label>
                            </div>
                            <div class="col-2">
                                <input type="number" class="blockedField" v-model="$parent.total" readOnly>
                                <label for="">TOTAL</label>
                            </div>

                            <div class="col-12 text-right">
                                <button class="actionBtn saveBtn" @click.prevent="$parent.validateForm()"> 
                                    <i class="far fa-save"></i>
                                    GUARDAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'DataForm',
    mixins: [ GlobalFunctions ],
    data() {
        return {
            projectsList: [],
            dataObject: {}
        }
    },
    mounted() {
        if(process.client){
            this.dataObject.year = localStorage.getItem('year');
            this.dataObject.id = localStorage.getItem('id');
            this.dataObject.fullAccess = localStorage.getItem('fullAccess');
            if(this.dataObject.fullAccess == 0){
                this.dataObject.projectList = localStorage.getItem('projectList');
            }
        }

        this.getProjectsList( this.$parent.incomeData.year );
    },
    methods: {
        async getProjectsList( year ) {
            const res = await fetch(`${process.env.apiUrl}/projects/simple_list`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200 ){
                    this.projectsList = resData.results;
                }
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
    }
}   
</script>

<style>

</style>