<template>
  <form>
      <div class="row">
          <div class="col-12 panel">
              <div class="row">
                  <div class="col-12 title">
                      TOTALES
                  </div>

                  <div class="col-12 formBody">
                      <div class="row">
                          <div class="col-12">
                                <input type="text" class="text-right blockedField" :value="`$ ${moneyFormat($parent.totalBudget)}`" readonly />
                                <label for="">TOTAL DE PRESUPUESTADO PARA 
                                    {{ ($parent.incomeData['month'] === '')? '---' : ($store.state.monthList[ $parent.incomeData['month'] - 1 ]).toUpperCase() }} 
                                </label>
                          </div>
                          <div class="col-12">
                                <input type="text" class="text-right blockedField" :value="`$ ${moneyFormat($parent.totalParts)}`" readonly />
                                <label for="">CAPTURADO EN ESTA S.F.</label>
                          </div>
                          <div class="col-12">
                                <input type="text" class="text-right blockedField" :value="`$ ${moneyFormat($parent.substraction)}`" readonly />
                                <label for="">POR CAPTURAR</label>
                          </div>
                      </div>
                      <div class="col-12 text-right">
                            <button class="actionBtn saveBtn" @click.prevent="$parent.validateFullForm()"> 
                                <i class="far fa-save"></i>
                                GUARDAR S.F / IMPRIMIR
                            </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </form>
</template>

<script>
import GlobalFunctions from '../../mixins/GlobalFunctions';

export default {
    name: 'sfTotalForm',
    mixins: [ GlobalFunctions ],
}
</script>

<style>

</style>