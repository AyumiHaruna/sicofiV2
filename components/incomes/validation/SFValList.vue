<template>
  <div class="row block">
      <div class="col-12 panel">

          <div class="row">
              <div class="col-12 sectionTitle">LISTA DE VALIDACIONES</div>
              <div class="col-12">
                  <table class="secondLvl">
                        <tr>
                        <th>#</th>
                        <th>FECHA DEPÓSITO</th>
                        <th>FOLIO AUTORIZACIÓN</th>
                        <th>TOTAL</th>
                        <th v-for="num in 5" :key="num"> CAP {{num}}000</th>
                        <th class="obs">OBSERVACIONES</th>
                        <th>ELIMINAR</th>
                        </tr>
                        <tr v-for="(val, index) in $parent.income.validations" :key="val.id">
                        <td :data-id="val.id">{{index + 1}}</td>
                        <td>{{val.depDate}}</td>
                        <td>{{val.authNum}}</td>
                        <td>${{moneyFormat(val.total)}}</td>
                        <td v-for="num in 5" :key="num">${{moneyFormat(val[`cap${num}`])}}</td>
                        <td>{{val.obs}}</td>
                        <td>
                            <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar validación" alt="Eliminar validación" @click="askForDelete(val.id)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                  </table>
              </div>
          </div>

      </div>
  </div>
</template>

<script>

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'SFValList',
    mixins: [ GlobalFunctions ],
    methods: {
        askForDelete( id ) {
            this.$swal.fire({
                title: 'Deseas eliminar esta validación!?',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.$parent.formType = 'delete';
                    this.$parent.valId = id;
                    this.$parent.saveValidation();
                }
            });
        },
    }
}
</script>

<style>

</style>