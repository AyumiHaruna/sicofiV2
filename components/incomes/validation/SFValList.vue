<template>
  <div class="row block">
      <div class="col-12 panel">

          <div class="row">
              <div class="col-12"> <label>LISTA DE VALIDACIONES</label> </div>
              <div class="col-12">
                  <table class="valTable">
                      <thead>
                          <tr>
                            <th>#</th>
                            <th>FECHA DEPÓSITO</th>
                            <th>FOLIO AUTORIZACIÓN</th>
                            <th>TOTAL</th>
                            <th v-for="num in 5" :key="num"> CAP {{num}}000</th>
                            <th>OBSERVACIONES</th>
                            <th>ELIMINAR</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(val, index) in $parent.income.validations" :key="val.id">
                            <td :data-id="val.id">{{index + 1}}</td>
                            <td>{{val.depDate}}</td>
                            <td>{{val.authNum}}</td>
                            <td>${{moneyFormat(val.total)}}</td>
                            <td v-for="num in 5" :key="num">${{moneyFormat(val[`cap${num}`])}}</td>
                            <td>{{val.obs}}</td>
                            <td>
                                <button class="plusBtn closeBtn" v-b-tooltip.hover title="Eliminar validación" alt="Eliminar validación" @click="askForDelete(val.id)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                      </tbody>
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
table.valTable {
    border: 0px solid #555555;
    background-color: #555555;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 0.9em;
}
table.valTable td, table.valTable th {
    border: 1px solid #555555;
    padding: 0.5em 0.5em;
}
table.valTable tbody td {
    font-size: 0.8em;
    font-weight: bold;
    color: #FFFFFF;
    letter-spacing: 1.1px;
}
table.valTable tr:nth-child(even) {
    background: #1C7C80;
}
table.valTable thead {
    background: #16B8B8;
    border-bottom: 10px solid #1C7C80;
}
table.valTable th {
    font-size: 0.8em;
    font-weight: bold;
    color: #FFFDD5;
}
table.valTable thead th {
    font-weight: bold;
    color: #333333;
    text-align: center;
    border-left: 2px solid #1C7C80;
}
table.valTable thead th:first-child {
    border-left: none;
}
</style>