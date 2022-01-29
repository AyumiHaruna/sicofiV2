<template>
    <form v-if="($parent.formVisible)">
        <div class="row smoke">
            <div class="col-10 offset-1">
                <div class="row valForm">
                    <div class="col-12 panel">
                        <div class="row">
                            <div class="col-12 bordered">
                                <div class="row">
                                    <div class="col-12">
                                        <table class="secondLvl">
                                            <tr>
                                                <th></th>
                                                <th v-for="num in 5" :key="num"> CAP. {{num}}000</th>
                                            </tr>
                                            <tr>
                                                <th>SOLICITADOS</th>
                                                <td v-for="num in 5" :key="num">
                                                    ${{moneyFormat($parent.income.sfData[`cap${num}`])}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>VALIDADOS</th>
                                                <td v-for="num in 5" :key="num">
                                                    ${{moneyFormat( capVal[num-1] )}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>POR VALIDAR</th>
                                                <td v-for="num in 5" :key="num">
                                                    ${{moneyFormat( $parent.income.sfData[`cap${num}`] - capVal[num-1] )}}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div class="col-3">
                                        <label>
                                            DATOS PARA LA VALIDACIÓN
                                        </label>
                                    </div>
                                    <div class="col-3">
                                        <input type="date" name="depDate" v-model="$parent.formData.depDate">
                                        <label for="depDate">FECHA DE DEPÓSITO</label>
                                    </div>
                                    <div class="col-3">
                                        <input type="input" name="autNum" v-model.trim="$parent.formData.authNum" maxlength="15">
                                        <label for="autNum">FOLIO DE AUTORIZACIÓN</label>
                                    </div>
                                    <div class="col-3">
                                        <input type="input" name="autNum" :value="moneyFormat($parent.formTotal)" class="blockedField" readonly>
                                        <label for="autNum">TOTAL ($)</label>
                                    </div>

                                    <div class="col-2">
                                        <label>MONTOS ($)</label>
                                    </div>
                                    <div class="col-2" v-for="num in 5" :key="num">
                                        <input type="input" :name="`cap${num}`" 
                                            v-model="$parent.formData[`cap${num}`]" 
                                            @keypress="isNumber($event)" 
                                            @change="testValue(num)"
                                        >
                                        <label :for="`cap${num}`">CAP. {{num}}000</label>
                                    </div> 

                                    <div class="col-2 text-right">
                                        <label>OBSERVACIONES</label>
                                    </div>
                                    <div class="col-10">
                                        <textarea name="obs" v-model="$parent.formData.obs" cols="20" rows="3"></textarea>
                                    </div>

                                    <div class="col-12 text-right">
                                        <button class="actionBtn closeBtn" @click.prevent="$parent.closeForm()"> 
                                            <i class="fas fa-times"></i>
                                            CANCELAR
                                        </button>
                                        <button class="actionBtn saveBtn" @click.prevent="$parent.validateForm()"> 
                                            <i class="fas fa-hand-holding-usd"></i>
                                            GUARDAR VALIDACIÓN
                                        </button>
                                    </div>
                                    <!-- <div class="col-6 text-center">
                                        
                                    </div> -->
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
import GlobalFunctions from '@/mixins/GlobalFunctions'

export default {
    name: 'sfValForm',
    mixins: [ GlobalFunctions ],
    methods: {
        testValue( num ){
            if( this.$parent.formData[`cap${num}`] == '' ) {
                this.$parent.formData[`cap${num}`] = 0;
            }
        }
    },
    computed: {
        capVal: function(){
            let total = [0,0,0,0,0];
            (this.$parent.income.validations).forEach(val => {
                for (let i = 1; i <= 5; i++) {
                    total[ i-1 ] += parseFloat(val[`cap${i}`]);
                }
            });
            return total;
        }
    }
}
</script>

<style>
.valForm{
    position: absolute;
    top: 10em;
}

/* table.capTable{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 1em;
    margin-bottom: 2em;
}
table.capTable th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.8em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
}
table.capTable tr{
    background-color: #565656;
}
table.capTable td{
    font-size: 0.9em;
    width: 7.14%;
    border: solid 1px #000;
}

table.capTable .conceptCell{
    font-size: 0.8em;
    width: 14.2%
} */
</style>