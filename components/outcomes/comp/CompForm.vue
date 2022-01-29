<template>
    <form>
        <div class="row smoke">
            <div class="col-8 offset-2">
                <div class="row">
                    <div class="col-12 panel compForm">
                        <div class="row">
                            <div class="col-12 bordered">
                                <div class="row">
                                    <div class="col-5">
                                        <input type="date" name="compDate" v-model="$parent.formData.compDate" ref="compDate">
                                        <label for="compDate">FECHA DE LA COMPROBACIÓN</label>
                                    </div>
                                    <div class="col-5">
                                        <input type="number" name="total" v-model="$parent.formData.total" ref="total">
                                        <label for="total">TOTAL DE LA COMPROBACIÓN</label>
                                    </div>
                                    <div class="col-2 text-center">
                                        <input type="checkbox" name="gnc" v-model="$parent.formData.gnc" value="1">
                                        <label for="gnc">GNC</label>
                                    </div>
                                    <div class="col-12 text-right">
                                        <button class="actionBtn closeBtn" @click="$parent.closeForm()">
                                            <i class="fas fa-times"></i>
                                            CANCELAR
                                        </button>
                                        <button class="actionBtn infoBtn" @click.prevent="validateComp()"> 
                                            <i class="fas fa-clipboard-check"></i> AÑADIR COMPROBACIÓN
                                        </button>
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
export default {
    name: 'CompForm',
    methods: {
        validateComp() {
            //test compDate 
            if( !this.$parent.formData['compDate'] ){ this.$refs.compDate.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir una "Fecha de comprobación"`); return  }
            // test total
            if( !this.$parent.formData['total'] ){ this.$refs.total.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Total de la comprobación"`); return  }

            this.$parent.saveComp();
        }
    }
}
</script>

<style>
    .compForm {
        margin-top: 15em;
        padding: 2em;
    }
</style>