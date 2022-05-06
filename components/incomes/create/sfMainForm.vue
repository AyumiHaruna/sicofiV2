<template>
    <form>
        <div class="row">
            <div class="col-12 panel sfMainForm">
                <div class="row">
                    <div class="col-12 bordered">
                        <div class="row">
                            <div class="col-12 sectionTitle">
                                DATOS GENERALES
                            </div>

                            <div class="col-12 formBody">
                                <div class="row">
                                    <div class="col-9">
                                        <select ref="projectNumber" v-model="$parent.incomeData['projectNumber']" 
                                            @change="getMonthParts" :disabled="$parent.formType !== 'Alta'"
                                            :class="($parent.formType !== 'Alta')?'blockedField':''"
                                        >
                                            <option value="">- Elige un proyecto -</option>
                                            <option :value="project.projectNumber" v-for="(project, index) in projectsList" :key="index">
                                                {{ project.projectNumber }} - {{ project.projectName}}
                                            </option>
                                        </select>
                                        <label for="">PROYECTO</label>
                                    </div>
                                    <div class="col-3">
                                        <select ref="account" v-model="$parent.incomeData['account']" @change="getMonthParts"
                                        :disabled="$parent.formType !== 'Alta'" :class="($parent.formType !== 'Alta')?'blockedField':''"
                                        >
                                            <option value="">- Elige una cuenta -</option>
                                            <option value="1">Coordinación</option>
                                            <option value="2">Instituto</option>
                                        </select>
                                        <label for="">CUENTA</label>
                                    </div>

                                    <div class="col-9">
                                        <input type="text" v-model.trim="$parent.incomeData['concept']" />
                                        <label for="">CONCEPTO</label>
                                    </div>
                                    <div class="col-3">
                                        <select ref="month" v-model="$parent.incomeData['month']" @change="getMonthParts"
                                            :disabled="$parent.formType !== 'Alta'"
                                            :class="($parent.formType !== 'Alta')?'blockedField':''"
                                        >
                                            <option value="">- Elige un mes -</option>
                                            <option :value="(index+1)" v-for="(month, index) in $store.state.monthList" :key="month">{{ month }}</option>
                                        </select>
                                        <label for="">MES</label>
                                    </div>

                                    <div class="col-6">
                                        <input type="date" v-model="$parent.incomeData['elabDate']">
                                        <label for="">FECHA DE ELABORACIÓN</label>
                                    </div>
                                    <div class="col-3">
                                        <select v-model="$parent.incomeData['opType']" 
                                            :disabled="$parent.formType !== 'Alta'"
                                            :class="($parent.formType !== 'Alta')?'blockedField':''"
                                        >
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
                                        <input type="text" class="blockedField" v-model="folioSF" readonly />
                                        <label for="">FOLIO DE S.F.</label>
                                    </div>

                                    <div class="col-6">  
                                        <input type="text" list="suggestions" v-model="$parent.incomeData.sign" @input="changeToUpper()">
                                            <datalist id="suggestions">
                                                <option v-for="(suggest, index) in suggestions" :key="index">{{suggest.name}}</option>
                                            </datalist>
                                        <label>A FAVOR DE: </label>
                                    </div>

                                    <div class="col-6">
                                        <textarea
                                            rows="3"
                                            max-rows="6"
                                            v-model.trim="$parent.incomeData['obs']"
                                        >
                                        </textarea>
                                        <label for="">OBSERVACIONES</label>
                                    </div>  

                                    <div class="col-2">
                                        <label>TIPO DE S.F.</label>
                                        <b-form-group v-slot="{ ariaDescribedby }">
                                            <b-form-radio v-model="$parent.incomeData.sfAddData['sfPrintType']" :aria-describedby="ariaDescribedby" value="pro">PROYECTOS</b-form-radio>
                                            <b-form-radio v-model="$parent.incomeData.sfAddData['sfPrintType']" :aria-describedby="ariaDescribedby" value="ser">SERVICIOS</b-form-radio>
                                        </b-form-group>                                
                                    </div> 

                                    <div class="col-10" v-if="($parent.incomeData.sfAddData['sfPrintType'] === 'ser')">
                                        <div class="row">
                                            <div class="col-3">
                                                <select v-model="$parent.incomeData.sfAddData['sfTaxType']" @change="setTax()">
                                                    <option value="pro">Profesionales</option>
                                                    <option value="tec">Técnicos</option>
                                                    <option value="lra">Otros servicios</option>
                                                </select>
                                                <label for="">TIPO DE SERVICIOS</label>
                                            </div>
                                            <div class="col-3 text-center">
                                                <input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.ivaT" />
                                                <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[0]" size="sm"></b-form-checkbox>
                                                <label>IVA (Tra)</label>
                                            </div>
                                            <div class="col-3 text-center">
                                                <input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.ivaR" />
                                                <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[1]" size="sm"></b-form-checkbox>
                                                <label>IVA (Ret)</label>
                                            </div>
                                            <div class="col-3 text-center">
                                                <input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.isrR" />
                                                <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[2]" size="sm"></b-form-checkbox>
                                                <label>ISR (Ret)</label>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <table class="secondLvl">
                                                <thead>
                                                    <tr>
                                                        <th>Autorizado</th>
                                                        <th>IVA</th>
                                                        <th>Subtotal</th>
                                                        <th>IVA (Ret)</th>
                                                        <th>ISR (Ret)</th>
                                                        <th>Retenciones</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>$ {{moneyFormat($parent.totalParts)}}</td>
                                                        <td>$ {{moneyFormat($parent.ivaTra)}}</td>
                                                        <td>$ {{moneyFormat( $parent.totalParts + $parent.ivaTra )}}</td>
                                                        <td>$ {{moneyFormat($parent.ivaRet)}}</td>
                                                        <td>$ {{moneyFormat($parent.isrRet)}}</td>
                                                        <td>$ {{moneyFormat( $parent.ivaRet + $parent.isrRet )}}</td>
                                                        <td>$ {{moneyFormat( $parent.totalParts + $parent.ivaTra - $parent.ivaRet - $parent.isrRet )}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    
                                </div>
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
    name: 'sfMainForm.vue',
    mixins: [ GlobalFunctions ],

    data() {
        return {
            projectsList: [],
            lastSF: '',
            year: '',

            suggestions: [],

            taxPatterns: {
                pro: [true, true, true],
                tec: [true, true, false],
                lra: [false, false, false]
            },

            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
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
        
        this.year = localStorage.getItem('year');
        this.getProjectsList( this.year );
        this.getPeopleList();

        if(this.$parent.formType == 'Alta'){
            this.getLastSFId( this.year );
        }
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
        async getLastSFId( year) {
            // get projects list
            const res = await fetch(`${process.env.apiUrl}/incomes/last_id/${year}`);
            
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200 ){
                    this.lastSF = resData.results;
                }
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
        async getMonthParts(){
            if( this.$parent.incomeData['projectNumber'] !== '' &&
                this.$parent.incomeData['account'] !== '' &&
                this.$parent.incomeData['month'] !== '' ){

                // get month parts and autofill
                const res = await fetch(`${process.env.apiUrl}/projects/monthParts`,{
                    method: 'post',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body: JSON.stringify({
                        year: this.year,
                        month: this.$parent.incomeData['month'],
                        projectNumber: this.$parent.incomeData['projectNumber'],
                        account: this.$parent.incomeData['account']
                    })
                });
                // if api response is ok 
                if( res.status === 200 ){
                    //convert response to json
                    const resData = await res.json();
                    this.$parent.proyPartList = resData.results;

                } else {
                    this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
                }

                //look for previous SF for this info
                const res2 = await fetch(`${process.env.apiUrl}/incomes/prevSF`, {
                    method: 'post',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body: JSON.stringify({
                        year: this.year,
                        month: this.$parent.incomeData['month'],
                        projectNumber: this.$parent.incomeData['projectNumber'],
                        account: this.$parent.incomeData['account']
                    })
                });
                // if api response is ok 
                if( res2.status === 200 ){
                    //convert response to json
                    const resData2 = await res2.json();
                    this.$parent.prevSF = resData2.results;
                } else {
                    this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
                }
            }
        },
        async getPeopleList(){
            // get projects list
            const res = await fetch(`${process.env.apiUrl}/people/list`);
            
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200 ){
                    this.suggestions = resData['results'];
                    if( resData['results'] > 0){
                        this.$parent.incomeData['sign'] = resData['results'][0]['name'];
                    }                    
                }
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
        
        changeToUpper() {
            this.$parent.incomeData['sign'] = (this.$parent.incomeData['sign']).toUpperCase();
        },

        setTax(){
            this.$parent.incomeData.sfAddData.taxConfig = this.taxPatterns[ this.$parent.incomeData.sfAddData.sfTaxType ];
        }
    },
    computed: {
        folioSF: function(){
            if(this.$parent.formType == 'Alta'){
                this.$parent.incomeData['sfNum'] = this.lastSF + 1;
                this.$parent.incomeData['sfId'] = `${this.$parent.incomeData['year']}-${this.$parent.incomeData['month']}_SF-${this.$parent.incomeData['projectNumber']}-${this.$parent.incomeData['account']}_${this.$parent.incomeData['opType']}-${(this.lastSF + 1)}`;
                return `${this.$parent.incomeData['year']}-${this.$parent.incomeData['month']}_SF-${this.$parent.incomeData['projectNumber']}-${this.$parent.incomeData['account']}_${this.$parent.incomeData['opType']}-${(this.lastSF + 1)}`;
            } else {
                return this.$parent.incomeData['sfId']    ;
            }
        },

        filteredOptions() {
            return [
                { 
                data: this.suggestions[0].data.filter(option => {
                    return option.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                })
                }
            ];
        },
    }
}
</script>

<style>
.sfMainForm {
    font-size: 0.2em;
}
.sfMainForm .custom-radio label{
    cursor: pointer;
}
</style>