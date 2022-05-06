<template>
    <div class="row block">
        <div class="col-12 panel">
            <div class="row">
                <div class="col-12 bordered">
                    <div class="row">
                        <div class="col-12">
                            <label>MONTOS PARA EL EGRESO</label>
                        </div>
                        
                        <div class="col-6" v-for="num in 5" :key="num">
                            <input type="text" v-model="$parent.outcome[`cap${num}`]" :name="`cap${num}`" @keypress="isNumber($event)">
                            <label :for="`cap${num}`">CAPÍTULO {{num}}000</label>
                        </div>

                        <div class="col-6">
                            <input type="text" :value="`$ ${moneyFormat($parent.getTotal)}`" name="cap5" class="blockedField" readonly>
                            <label for="cap5">TOTAL</label>
                        </div>

                        <div class="col-12 text-right">
                            <button class="actionBtn saveBtn" @click="$parent.validateForm()"> 
                                <i class="far fa-save"></i>
                                {{ ($parent.type == 'Alta') ? 'CREAR' : 'MODIFICAR' }} EGRESO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'CapsForm',
    mixins: [ GlobalFunctions ],
}
</script>

<style>

</style>