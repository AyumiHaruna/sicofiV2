<template>
  <form>
      <div class="row">
          <div class="col-12 panel">
              <div class="row">
                  <div class="col-12 bordered">
                    <div class="row">
                        <div class="col-12 sectionTitle">
                            TOTALES
                        </div>

                        <div class="col-12 formBody">
                            <div class="row">
                                <div class="col-12">
                                        <input type="text" class="text-right yellow" :value="`$ ${moneyFormat($parent.totalBudget)}`" readonly />
                                        <label for="">TOTAL DE PRESUPUESTADO PARA 
                                            {{ ($parent.incomeData['month'] === '')? '---' : ($store.state.monthList[ $parent.incomeData['month'] - 1 ]).toUpperCase() }} 
                                        </label>
                                </div>
                                <div class="col-12">
                                        <input type="text" class="text-right yellow" :value="`$ ${moneyFormat($parent.prevTotal)}`" readonly />
                                        <label for="">CAPTURADO ANTERIORMENTE</label>
                                </div>
                                <div class="col-12">
                                        <input type="text" class="text-right green" :value="`$ ${moneyFormat($parent.totalParts)}`" readonly />
                                        <label for="">CAPTURADO BRUTO EN LA S.F.</label>
                                </div>
                                <div class="col-12">
                                        <input type="text" class="text-right green" :value="`$ ${moneyFormat($parent.totalNeto)}`" readonly />
                                        <label for="">CAPTURADO NETO</label>
                                </div>
                                <div class="col-12">
                                        <input type="text" class="text-right" :class="($parent.substraction >= 0)? 'green' : 'red' " :value="`$ ${moneyFormat($parent.substraction)}`" readonly />
                                        <label for="">POR CAPTURAR</label>
                                </div>
                            </div>
                            <div class="col-12 text-right">
                                    <button class="actionBtn saveBtn" @click.prevent="$parent.validateFullForm()"> 
                                        <i class="far fa-save"></i>
                                        GUARDAR S.F
                                    </button>
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
    name: 'sfTotalForm',
    mixins: [ GlobalFunctions ],
}
</script>

<style>
    .green{
        color: #29a329 !important;
    }
    .yellow{
        color: #b38f00 !important;
    }
    .red{
        color: #b30000 !important;
    }
</style>