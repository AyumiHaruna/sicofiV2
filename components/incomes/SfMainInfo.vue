<template>
  <div class="row block sfMainInfo">
    <div class="col-12 panel">
      
      <div class="row">
        <div class="col-12 sectionTitle">
          DATOS DE LA SOLICITUD DE FONDOS
        </div>
        <div class="col-12">
          <!-- sf main info table  -->
          <table class="firstLvl">
            <tr>              
              <th>S.F. ID</th>
              <th>CONCEPTO</th>
              <th>OPERACIÓN</th>
              <th>OP. TIPO</th>
              <th>FECHA ELAB.</th>
              <th>TIPO DE FORMATO</th>
            </tr>
            
            <tr>
              <td>{{income.sfId}}</td>
              <td>{{income.concept}}</td>
              <td>{{ (income.type == 'ing') ? 'Ingreso': 'Reintegro' }}</td>
              <td>{{opType}}</td>
              <td>{{income.elabDate}}</td>
              <td class="yellow">{{ (income.sfData.sfPrintType == 'pro')? 'Proyecto' : 'Servicios' }}</td>
            </tr>
          </table>

          <!-- sf cap ammount table VALIDACION -->
          <table class="firstLvl" v-if="type == 'validacion'">
            <tr>
              <th></th>
              <th v-for="num in 5" :key="num">CAP {{num}}000</th>
            </tr>
            <tr>
                <th>SOLICITADO</th>
                <td v-for="num in 5" :key="num">${{moneyFormat( 
                  $parent.taxAmount(
                    income.sfData[`cap${num}`],
                    income.sfData['taxConfig'],
                    income.sfData['ivaTC']
                  ) )}}
                </td>
            </tr>
            <tr>
              <th>VALIDADO</th>
              <td v-for="num in 5" :key="num">${{moneyFormat(ministered[num-1])}}</td>
            </tr>
            <tr>
                <th>POR VALIDAR</th>
                <td v-for="num in 5" :key="num">${{moneyFormat( 
                  $parent.taxAmount(
                    income.sfData[`cap${num}`],
                    income.sfData['taxConfig'],
                    income.sfData['ivaTC']
                  ) - ministered[num-1] )}}
                </td>
            </tr>
            <tr>
              <th>SOLICITADO BRUTO</th>
              <th>SOLICITADO NETO</th>
              <th>TOTAL VALIDADO</th>
              <th>TOTAL POR VALIDAR</th>
              <th>% VALIDACIÓN</th>
              <th>AÑADIR VALIDACION</th>
            </tr>

            <tr>
              <td>${{moneyFormat(income.sfData.total)}}</td>
              <td>${{moneyFormat(income.requested)}}</td>
              <td>${{moneyFormat(income.ministered)}}</td>
              <td>${{ moneyFormat(income.requested - income.ministered) }}</td>
              <td>{{ ((income.ministered * 100) / income.requested).toFixed(2) }} % </td>
              <td>
                <button class="miniBtn infoBtn" v-b-tooltip.hover title="Añadir Validación" alt="Añadir Validación" @click="$parent.openform('create')">
                  <i class="fas fa-hand-holding-usd"></i>
                </button>
              </td>
            </tr>
          </table>

          <!-- sf cap ammount table COMPROBACION -->
          <table class="firstLvl" v-if="type == 'comprobacion'">
            <tr>
                <th></th>
                <th v-for="num in 5" :key="num">CAP {{num}}000</th>
            </tr>
            <tr>
                <th>SOLICITADO</th>
                <td v-for="num in 5" :key="num">${{moneyFormat(
                    $parent.taxAmount(
                      income.sfData[`cap${num}`],
                      income.sfData['taxConfig'],
                      income.sfData['ivaTC']
                    )
                  )}}
                </td>
            </tr>
            <tr>
                <th>VALIDADO</th>
                <td v-for="num in 5" :key="num">${{moneyFormat(ministered[num-1])}}</td>
            </tr>
            <tr>
                <th>COMPROBADO</th>
                <td v-for="num in 5" :key="num">${{moneyFormat(checkings[num-1])}}</td>
            </tr>
            <tr>
                <th>POR COMPROBAR</th>
                <td v-for="num in 5" :key="num">${{moneyFormat( ministered[num-1] - checkings[num-1] )}}</td>
            </tr>
            
            <tr>
              <th>TOTAL SOLICITADO</th>
              <th>TOTAL VALIDADO</th>
              <th>TOTAL COMPROBADO</th>
              <th>TOTAL POR COMPROBAR</th>
              <th>% COMPROBACIÓN</th>
              <th>AÑADIR COMPROBACIÓN</th>
            </tr>

            <tr>
              <td>${{moneyFormat(income.requested)}}</td>
              <td>${{moneyFormat(income.ministered)}}</td>
              <td>${{moneyFormat(income.checked)}}</td>
              <td>${{ moneyFormat(income.ministered - income.checked) }}</td>
              <td>{{ ((income.checked * 100) / income.ministered).toFixed(2) }} % </td>
              <td>
                <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}`">
                  <button class="miniBtn infoBtn" v-b-tooltip.hover title="Añadir Comprobación" alt="Añadir Comprobación">
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

    ministered: function(){
      let minis = [0,0,0,0,0];
          (this.income.validations).forEach(elm => {
            for (let i = 0; i < 5; i++) {
              minis[i] += parseFloat(elm[`cap${i+1}`]);
            }
          });
      return minis;
    },

    checkings: function() {
      let capsCheck = [0,0,0,0,0];
        (this.income.checkings).forEach(elm => {
          for (let i = 0; i < 5; i++) {
            capsCheck[i] += parseFloat(elm[`cap${i+1}`]);
          }
        });
      return capsCheck;
    },
  }
}
</script>

<style>
  .sfMainInfo .firstLvl tr th{
    border: solid 1px #b6b6b6;
  }
</style>