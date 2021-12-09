<template>
  <div class="printPage service">
      <div class="row">
        <div class="col-3"><img src="~/assets/logo_cultura.svg" class="logo" alt="inah logo"></div>
        <div class="col-6 text-center title">INSTITUTO NACIONAL DE ANTROPOLOGIA E  HISTORIA</div>
        <div class="col-3"><img src="~/assets/inah-logo.png" class="logo2" alt="inah logo"></div>

        <div class="col-12 text-center subTitle">SOLICITUD DE FONDOS (sicofi)</div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th>NO. DE SOLICITUD DE FONDOS</th>
                <th>FECHA</th>
                <th>NOMBRE DEL CENTRO DE TRABAJO</th>
                <th>CLAVE DEL CENTRO DE TRABAJO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{$parent.income.sfId}}</td>
                <td>{{$parent.income.elabDate}}</td>
                <td>Coordinación Nacional de Conservación del Patrimonio Cultural</td>
                <td>530000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th>TIPO DE FINANCIAMIENTO</th>
                <th>ID</th>
                <th>NOMBRE DEL PROYECTO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{$parent.opType}}</td>
                <td>{{$parent.income.projectNumber}}</td>
                <td>{{$parent.income.projectName}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th>A FAVOR DE</th>
                <th>CONCEPTO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{$parent.income.signName}}</td>
                <td>{{$parent.income.concept}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12 midTitle">
          APLICACIÓN CONTABLE Y PRESUPUESTAL
        </div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th>CTA. CONTABLE</th>
                <th>DEBE</th>
                <th>HABER</th>
                <th>PARTIDA PRESUPUESTAL</th>
                <th>IMPORTE PARCIAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(part, index) in $parent.income.partList" :key="index" class="partsNumbers">
                <td class="text-left">{{index + 1}}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td class="text-left">{{index + 1}}.- {{part.partNumber}} {{part.partName}}</td>
                <td colspan="2" class="text-right">${{moneyFormat(part.total)}}</td>
              </tr>

              <!-- <tr v-for="num in 14" :key="num" class="partsNumbers">
                <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
              </tr> -->

              <tr>
                <th colspan="4">TOTAL SOLICITADO EN LETRA</th>
                <th>TOTAL</th>                
              </tr>
              <tr>
                <td colspan="4">${{moneyFormat($parent.income.requested)}} ({{numberToString($parent.income.requested)}})</td>
                <td class="text-right">${{moneyFormat($parent.income.requested)}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th class="text-left">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">{{$parent.income.obs}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12">
          <table>
            <thead>
              <tr>
                <th>ACTIVIDAD</th>
                <th>(1) AUTORIZADO</th>
                <th>16%(IVA)</th>
                <th>SUBTOTAL</th>
                <th>2/3 IVA</th>
                <th>ISR</th>
                <th>SUBTOTAL RETENCIONES</th>
                <th>TOTAL A MINISTRAR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{$parent.actType}}</td>
                <td>${{moneyFormat($parent.income.requested)}}</td>
                <td> {{ ($parent.ivaTra == 0)? 'N/A' : `$ ${moneyFormat($parent.ivaTra)}` }} </td>
                <td>${{ moneyFormat(parseFloat($parent.income.requested) + parseFloat($parent.ivaTra)) }}</td>
                <td> {{ ($parent.ivaRet == 0)? 'N/A' : `$ ${moneyFormat($parent.ivaRet)}` }} </td>
                <td> {{ ($parent.isrRet == 0)? 'N/A' : `$ ${moneyFormat($parent.isrRet)}` }} </td>
                <td>${{ moneyFormat(parseFloat($parent.ivaRet) + parseFloat($parent.isrRet)) }}</td>
                <td>
                  ${{ 
                    moneyFormat( 
                      parseFloat($parent.income.requested) +parseFloat($parent.ivaTra) - parseFloat($parent.ivaRet) - parseFloat($parent.isrRet)
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12">
          <table class="tableSign">
            <thead>
                <tr>
                    <th>NOMBRE Y FIRMA DEL TITULAR</th>
                    <th>PRESUPUESTO</th>
                    <th>FISCALIZACIÓN</th>
                    <th>CONTABILIDAD</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{$parent.income.signName}} </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        </div>
        
      </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sfPrintServ',
    mixins: [ GlobalFunctions ],
}
</script>

<style>
  .service .logo{
      width: 100%;
  }
  .service .logo2{
      width: 35%;
  }
  .service .title{
    font-size: 1.2em;
  }
  .service .subTitle{
    font-size:  1.1em;
    font-weight: bold;
    margin-bottom: 1em;
  }

  .midTitle{
    text-align: center;
    font-size: 1.1em;
    font-weight: bold;
  }

  .partsNumbers td{
    padding: 0.2em !important;
  }

  .tableSign td {
      height: 8em;
      position: relative;
      vertical-align: bottom;
  }
</style>