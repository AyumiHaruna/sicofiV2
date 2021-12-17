<template>
  <div class="row block">
    <div class="col-12 panel">
      
      <div class="row">

        <div class="col-12">
          <!-- sf main info table  -->
          <table class="incomeInfo">
            <tr>              
              <th>S.F. ID</th>
              <th>CONCEPTO</th>
              <th>OPERACIÓN</th>
              <th>OP. TIPO</th>
              <th>FECHA ELAB.</th>
            </tr>
            
            <tr>
              <td>{{income.sfId}}</td>
              <td>{{income.concept}}</td>
              <td>{{ (income.type == 'ing') ? 'Ingreso': 'Reintegro' }}</td>
              <td>{{opType}}</td>
              <td>{{income.elabDate}}</td>
            </tr>
          </table>

          <!-- sf cap ammount table VALIDACION -->
          <table class="amountInfo" v-if="type == 'validacion'">            
            <tr>
              <th colspan="5">SOLICITADO POR CAPÍTULO</th>
            </tr>
            <tr>
              <th v-for="num in 5" :key="num">CAP. {{num}}000</th>
            </tr>

            <tr>
              <td v-for="cap in 5" :key="cap">${{moneyFormat(income.sfData[`cap${cap}`])}}</td>
            </tr>

            <tr>
              <th>TOTAL SOLICITADO</th>
              <th>VALIDADO</th>
              <th>POR VALIDAR</th>
              <th>% VALIDACIÓN</th>
              <th>AÑADIR VALIDACIÓN</th>
            </tr>

            <tr>
              <td>${{moneyFormat(income.requested)}}</td>
              <td>${{moneyFormat(income.ministered)}}</td>
              <td>${{ moneyFormat(income.requested - income.ministered) }}</td>
              <td>{{ ((income.ministered * 100) / income.requested).toFixed(2) }} % </td>
              <td>
                <button class="plusBtn infoBtn" v-b-tooltip.hover title="Añadir Validación" alt="Añadir Validación" @click="$parent.openform('create')">
                  <i class="fas fa-hand-holding-usd"></i>
                </button>
              </td>
            </tr>
          </table>

          <!-- sf cap ammount table COMPROBACION -->
          <table class="amountInfo" v-if="type == 'comprobacion'">
            <tr>
              <th colspan="5">VALIDADO POR CAPÍTULO</th>
            </tr>
            <tr>
              <th v-for="num in 5" :key="num">CAP. {{num}}000</th>
            </tr>

            <tr>
              <td v-for="cap in 5" :key="cap">${{moneyFormat($parent.valCap[cap -1])}}</td>
            </tr>

            <tr>
              <th>TOTAL VALIDADO</th>
              <th>COMPROBADO</th>
              <th>POR COMPROBAR</th>
              <th>% COMPROBACIÓN</th>
              <th>AÑADIR COMPROBACIÓN</th>
            </tr>

            <tr>
              <td>${{moneyFormat(income.ministered)}}</td>
              <td>${{moneyFormat(income.checked)}}</td>
              <td>${{ moneyFormat(income.ministered - income.checked) }}</td>
              <td>{{ ((income.checked * 100) / income.ministered).toFixed(2) }} % </td>
              <td>
                <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}`">
                  <button class="plusBtn warningBtn" v-b-tooltip.hover title="Añadir Comprobación" alt="Añadir Comprobación">
                    <i class="fas fa-clipboard-check"></i>
                  </button>
                </nuxt-link>
              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions'

export default {
  name: 'SfMainInfo',
  props: [ 'income', 'type' ],
  mixins: [ GlobalFunctions ],
  computed: {
    opType: function(){
      switch ( this.income.opType ) {
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
                return 'Recursos fiscales';
            break;
        case 'gad':
                return 'Gastos de administración';
            break;
        case 'ter':
                return 'Con aportación de terceros';
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
  table.incomeInfo {
    border: 0px solid #170655;
    background-color: #261441;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 0.9em;
    margin-bottom: 2em;
  }
  table.incomeInfo th {
    border: 1px solid #555555;
    padding: 0.5em 1em;
    font-size: 0.9em;
  }
  table.incomeInfo td {
    font-size: 0.9em;
    color: #FFFFFF;
    padding: 0.5em 1em;
    background: #685584;
  }
  table.incomeInfo th {
    background: #322446;
  }
  /* table.incomeInfo thead {
    background: #685584;
    border-bottom: 2px solid #6E02BA;
  }
  table.incomeInfo thead th {
    font-weight: bold;
    color: #F6F6F6;
    text-align: center;
    border-left: 2px solid #433755;
    font-size: 0.9em;
  }
  table.incomeInfo thead th:first-child {
    border-left: none;
  } */


  table.amountInfo{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 0.9em;
  }
  table.amountInfo th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.8em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.amountInfo tr{
    background-color: #565656;
  }
  table.amountInfo td{
    font-size: 0.9em;
    width: 7.14%;
    border: solid 1px #000;
    padding: 1em !important;
  }
  
  table.amountInfo .conceptCell{
    font-size: 0.8em;
    width: 14.2%
  }

  .plusBtn{        
    border: solid 0px #fff;
    border-radius:5px;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-weight: bold;
    padding: 0.8em 1.1em;
    text-decoration:none;
    margin: 0.5em 1em;
    letter-spacing: 1.3px;
}
.plusBtn i{
  font-size: 1.5em;
}
.plusBtn:active {
  position:relative;
  top:1px;
}
</style>