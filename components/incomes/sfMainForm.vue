<template>
    <form>
        <div class="row">
            <div class="col-12 panel">
                <div class="row">
                    <div class="col-12 title">
                        DATOS GENERALES
                    </div>

                    <div class="col-12 formBody">
                        <div class="row">
                            <div class="col-9">
                                <b-form-select ref="projectNumber" v-model="$parent.incomeData['projectNumber']" @change="getMonthParts">
                                    <b-form-select-option value="">- Elige un proyecto -</b-form-select-option>
                                    <b-form-select-option :value="project.projectNumber" v-for="(project, index) in projectsList" :key="index">
                                        {{ project.projectNumber }} - {{ project.projectName}}
                                    </b-form-select-option>
                                </b-form-select>
                                <label for="">PROYECTO</label>
                            </div>
                            <div class="col-3">
                                <b-form-select ref="account" v-model="$parent.incomeData['account']" @change="getMonthParts">
                                    <b-form-select-option value="">- Elige una cuenta -</b-form-select-option>
                                    <b-form-select-option value="1">Coordinación</b-form-select-option>
                                    <b-form-select-option value="2">Instituto</b-form-select-option>
                                </b-form-select>
                                <label for="">CUENTA</label>
                            </div>

                            <div class="col-9">
                                <input type="text" v-model.trim="$parent.incomeData['concept']" />
                                <label for="">CONCEPTO</label>
                            </div>
                            <div class="col-3">
                                <b-form-select ref="month" v-model="$parent.incomeData['month']" @change="getMonthParts">
                                    <b-form-select-option value="">- Elige un mes -</b-form-select-option>
                                    <b-form-select-option :value="(index+1)" v-for="(month, index) in $store.state.monthList" :key="month">{{ month }}</b-form-select-option>
                                </b-form-select>
                                <label for="">MES</label>
                            </div>

                            <div class="col-6">
                                <b-form-datepicker placeholder="Elige una fecha" locale="es" v-model="$parent.incomeData['elabDate']"></b-form-datepicker>
                                <label for="">FECHA DE ELABORACIÓN</label>
                            </div>
                            <div class="col-3">
                                <b-form-select v-model="$parent.incomeData['opType']">
                                    <b-form-select-option value="">- Eliga el tipo de operación -</b-form-select-option>
                                    <b-form-select-option value="gba">Gasto Básico</b-form-select-option>
                                    <b-form-select-option value="gop">Gastos Operación</b-form-select-option>
                                    <b-form-select-option value="inv">Inversión</b-form-select-option>
                                    <b-form-select-option value="pro">Recursos Fiscales</b-form-select-option>
                                    <b-form-select-option value="gad">Gastos Administración</b-form-select-option>
                                    <b-form-select-option value="ter">Con aportación de terceros</b-form-select-option>
                                </b-form-select>
                                <label for="">TIPO DE OPERACIÓN</label>
                            </div>
                            <div class="col-3">
                                <input type="text" class="blockedField" v-model="folioSF" readonly />
                                <label for="">FOLIO DE S.F.</label>
                            </div>

                            <div class="col-6">        
                                <vue-autosuggest
                                    :suggestions="filteredOptions"
                                    v-model="query"                    

                                    @focus="showSuggest = toggleSuggest(1)"
                                    @blur="showSuggest = toggleSuggest(0), changeQueryToUpper()" 
                                    
                                    :get-suggestion-value="getSuggestionValue"
                                    :input-props="{id:'autosuggest__input', placeholder:'Buscar...'}"
                                >
                                    <div slot-scope="{suggestion}">
                                        <div>{{suggestion.item.name}}</div>
                                    </div>
                                </vue-autosuggest>
                                <label>A FAVOR DE: </label>
                            </div>

                            <div class="col-6">
                                 <b-form-textarea
                                    rows="3"
                                    max-rows="6"
                                    v-model.trim="$parent.incomeData['obs']"
                                >
                                </b-form-textarea>
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
                                        <b-form-select v-model="$parent.incomeData.sfAddData['sfTaxType']" @change="setTax()">
                                            <b-form-select-option value="pro">Profesionales</b-form-select-option>
                                            <b-form-select-option value="tec">Técnicos</b-form-select-option>
                                            <b-form-select-option value="lra">Lista de raya</b-form-select-option>
                                        </b-form-select>
                                        <label for="">TIPO DE SERVICIOS</label>
                                    </div>
                                    <div class="col-3 text-center">
                                        <b-form-input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.ivaT"></b-form-input>
                                        <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[0]" size="sm"></b-form-checkbox>
                                        <label>IVA (Tra)</label>
                                    </div>
                                    <div class="col-3 text-center">
                                        <b-form-input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.ivaR"></b-form-input>
                                        <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[1]" size="sm"></b-form-checkbox>
                                        <label>IVA (Ret)</label>
                                    </div>
                                    <div class="col-3 text-center">
                                        <b-form-input type="number" min="0.00" max="100" v-model="$parent.incomeData.sfAddData.isrR"></b-form-input>
                                        <b-form-checkbox v-model="$parent.incomeData.sfAddData.taxConfig[2]" size="sm"></b-form-checkbox>
                                        <label>ISR (Ret)</label>
                                    </div>
                                </div>

                                <div class="row">
                                    <table class="taxData">
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
    </form>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest';

import GlobalFunctions from '../../mixins/GlobalFunctions';

export default {
    name: 'sfMainForm.vue',
    mixins: [ GlobalFunctions ],
    components: { VueAutosuggest },

    data() {
        return {
            projectsList: [],
            lastSF: '',
            year: '',

            query: '',
            suggestions: [{data: []}],
            showSuggest: false,

            taxPatterns: {
                pro: [true, true, true],
                tec: [true, true, false],
                lra: [false, false, false]
            }
        }
    },
    mounted() {
        this.year = localStorage.getItem('year');

        this.getProjectsList( this.year );
        this.getLastSFId( this.year );
        this.getPeopleList();
    },
    methods: {
        async getProjectsList( year ) {
            // get projects list
            const res = await fetch(`${process.env.apiUrl}/projects/simple_list/${year}`);
            
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

            }
        },
        async getPeopleList(){
            // get projects list
            const res = await fetch(`${process.env.apiUrl}/people/list`);
            
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200 ){
                    this.suggestions[0]['data'] = resData['results'];
                    this.query = resData['results'][0]['name'];
                    this.$parent.incomeData['sign'] = this.query;
                }
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },

        onSelected(item) {
            this.selected = item.item;
        },
        getSuggestionValue(suggestion) {
            this.query = suggestion.item.name;
            this.$parent.incomeData['sign'] = this.query;
            return suggestion.item.name;
        },
        toggleSuggest( boolSate ){
            (document.getElementById("autosuggest-autosuggest__results")).style.opacity = boolSate;
        },
        changeQueryToUpper() {
            this.query = (this.query).toUpperCase();
            this.$parent.incomeData['sign'] = this.query;
        },

        setTax(){
            this.$parent.incomeData.sfAddData.taxConfig = this.taxPatterns[ this.$parent.incomeData.sfAddData.sfTaxType ];
        }
    },
    computed: {
        folioSF: function(){
            this.$parent.incomeData['sfNum'] = this.lastSF + 1;
            this.$parent.incomeData['sfId'] = `${this.$parent.incomeData['year']}-${this.$parent.incomeData['month']}_SF-${this.$parent.incomeData['projectNumber']}-${this.$parent.incomeData['account']}_${this.$parent.incomeData['opType']}-${(this.lastSF + 1)}`;
            return `${this.$parent.incomeData['year']}-${this.$parent.incomeData['month']}_SF-${this.$parent.incomeData['projectNumber']}-${this.$parent.incomeData['account']}_${this.$parent.incomeData['opType']}-${(this.lastSF + 1)}`;
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
.autosuggest__results-container{
    position: fixed;
    z-index: 9;
    border: solid 1px #6666ff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background: #0f143c;
    width: 35%;
    padding: 0.2em 1em;
    height: auto;
    max-height: 8em;
    overflow: auto; 
    opacity: 0;
}
.autosuggest__results-container li{
    list-style-type: none; 
    margin-top: 0.2em;
}
.custom-radio label{
    cursor: pointer;
}

table.taxData {
    border: 0px solid #555555;
    background-color: #555555;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
}
table.taxData td, table.taxData th {
    border: 1px solid #555555;
    padding: 0.5em 0.5em;
}
table.taxData tbody td {
    font-size: 0.7em;
    font-weight: bold;
    color: #FFFFFF;
    letter-spacing: 1.1px;
}
table.taxData td:nth-child(even) {
    background: #1C7C80;
}
table.taxData thead {
    background: #16B8B8;
    border-bottom: 10px solid #1C7C80;
}
table.taxData th {
    font-size: 0.9em;
    font-weight: bold;
    color: #FFFDD5;
}
table.taxData thead th {
    font-weight: bold;
    color: #333333;
    text-align: center;
    border-left: 2px solid #1C7C80;
}
table.taxData thead th:first-child {
    border-left: none;
}
</style>