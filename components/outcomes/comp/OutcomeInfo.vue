<template>

      <div class="row">
        <div class="col-12">
          <table class="firstLvl">
            <tr>
              <th># DE CHEQUE</th>
              <th>TIPO</th>
              <th>FECHA DE ELABORACIÓN</th>
              <th>TOTAL</th>
              <th>COMPROBADO</th>
              <th>RESTA COMPROBAR</th>
              <th>% DE COMPROBACIÓN</th>
              <th>OBSERVACIONES</th>
            </tr>
            <tr>
              <td>{{$parent.outcome.checkNumber}}</td>
              <td>{{$parent.outcome.payType}}</td>
              <td>{{$parent.outcome.elabDate}}</td>
              <td>${{moneyFormat($parent.outcome.total)}}</td>
              <td>${{moneyFormat(comp)}}</td>
              <td>${{moneyFormat($parent.outcome.total -  comp)}}</td>
              <td>% {{ ((comp * 100) / $parent.outcome.total).toFixed(2) }}</td>
              <td>{{$parent.outcome.obs}}</td>
            </tr>
            <tr>
              <th colspan="3">NOMBRE</th>
              <th colspan="5">CONCEPTO</th>
            </tr>
            <tr>
              <td colspan="3">{{$parent.outcome.name}}</td>
              <td colspan="5">{{$parent.outcome.concept}}</td>
            </tr>
          </table>
        </div>
      </div>

</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions'

export default {
  name: 'OutcomeInfo',
  mixins: [ GlobalFunctions ],
  computed: {
    comp: function(){
      let compT = 0;

      this.$parent.outcome.comp.forEach(comp => {
        compT += parseFloat(comp.total);
      });

      return compT;
    }
  },
}
</script>

<style>
</style>