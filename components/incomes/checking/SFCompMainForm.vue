<template>       
    <div class="row">
        <div class="col-12">
            <label> DATOS DEL INGRESO </label>
        </div>

        <div class="col-3">
            <input type="text" :value="$parent.income.sfId" class="blockedField" readonly>
            <label>ID DE LA S.F.</label>
        </div>
        <div class="col-3">
            <input type="text" :value="$store.state.monthList[ $parent.income.month - 1 ]" class="blockedField" readonly>
            <label>MES</label>
        </div>
        <div class="col-3">
            <input type="text" :value="opType" class="blockedField" readonly>
            <label>TIPO DE OPERACIÓN</label>
        </div>
        <div class="col-3">
            <input type="date" :value="$parent.income.validations[0]['depDate']" class="blockedField" readonly>
            <label>FECHA DE 1a. MINISTRACIÓN</label>
        </div>

        <div class="col-6">
            <input type="text" :value="$parent.income.concept" class="blockedField" readonly>
            <label>CONCEPTO</label>
        </div>
        <div class="col-3">
            <input type="text">
            <label for="">CARATULA</label>
        </div>
        <div class="col-3">
            <select v-model="$parent.formData['transfer']">
                <option v-for="(val, index) in $parent.income.validations" :key="val.id" :selected="index == 0">
                    {{val.authNum}}
                </option>
            </select>
            <label>TRANSFERENCIA</label>
        </div>

        <div class="col-3">
            <input type="date" ref="elabDate" name="elabDate" v-model="$parent.formData['elabDate']">
            <label for="elabDate">FECHA DE COMPROBACIÓN</label>
        </div>
        <div class="col-3">
            <input type="text" :value="moneyFormat($parent.compTotal)" class="blockedField" readonly>
            <label for="">TOTAL DE LA CAPTURA ($)</label>
        </div>
        <div class="col-6 text-right">
            <button class="actionBtn saveBtn" @click="validateForm()"> 
                <i class="far fa-save"></i>
                GUARDAR COMPROBACIÓN
            </button>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';
export default {
    name: 'SFCompMainForm',
    mixins: [ GlobalFunctions ],
    methods: {
        validateForm(){
            // test elab date 
            if( !this.$parent.formData['elabDate'] ){ this.$refs.elabDate.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar "Fecha de elaboración"`); return  }
            // asign total to formData 
            this.$parent.partForm['total'] = this.$parent.compTotal;
            // test total
            if( this.$parent.partForm['total'] <= 0 ){ this.$parent.$refs.toast.makeToast('warning', `Debes capturar almenos una partida`); return  }

            this.$parent.saveComp();
        }
    },
    computed: {
        opType: function(){
            switch ( this.$parent.income.opType ) {
                case 'gba':
                        return 'Gasto Básico';
                    break;
                case 'gop':
                        return 'Gastos de operación';
                    break;
                case 'inv':
                        return 'Inversión';
                    break;
                case 'pro':
                        return 'Proyecto';
                    break;
                case 'gad':
                        return 'Gastos de administración';
                    break;
                case 'ter':
                        return 'Terceros';
                    break;
            
                default:
                        return '';
                    break;
            }
        },        
    }
}
</script>

<style>

</style>