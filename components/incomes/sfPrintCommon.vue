<template>
    <section class="printPage common">
        <div class="row">
            <div class="col-3">
                <img src="~/assets/inah-logo2.png" class="logo" alt="inah logo">
            </div>
            <div class="col-9 text-center title">
                SOLICITUD DE FONDOS (Sicofi)
            </div>
            <div class="col-12">
                <table>
                    <thead>
                        <tr>
                            <th>NO. DE SOLICITUD</th>
                            <th>FECHA</th>
                            <th>NOMBRE DEL CENTRO DE TRABAJO</th>
                            <th>CVE. DEL CENTRO DE TRABAJO</th>
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

                <table>
                    <thead>
                        <tr>
                            <th>TIPO DE FINANCIAMIENTO</th>
                            <th>FOLIO</th>
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

                <table>
                    <tr>
                        <th>A FAVOR DE </th>
                        <td>{{$parent.income.signName}}</td>
                    </tr>
                </table>
            </div>

            <div class="col-12 midTitle">
                APLICACIÓN CONTABLE Y PRESUPUESTAL
            </div>

            <div class="col-12">
                <table class="tableNumbers">
                    <thead>
                        <tr>
                            <th>CUENTA CONTABLE</th>
                            <th>DEBE</th>
                            <th>HABER</th>
                            <th>PARTIDA PRESUPUESTAL</th>
                            <th>IMPORTE PARCIAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(part, index) in $parent.income.partList" :key="index">
                            <td>&nbsp;</td> <td>&nbsp;</td> <td>&nbsp;</td>
                            <td>{{part.partNumber}}</td>
                            <td class="text-right">${{moneyFormat(part.total)}}</td>
                        </tr>
                        <tr>
                            <th colspan="4" class="text-right">TOTAL</th>
                            <th class="text-right">${{moneyFormat($parent.income.requested)}}</th>
                        </tr>

                        <!-- <tr v-for="val in 18 " :key="`${val}`">
                            <td>&nbsp;</td> <td>&nbsp;</td> <td>&nbsp;</td><td>&nbsp;</td> <td>&nbsp;</td>
                        </tr> -->

                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                TOTAL SOLICITADO: ${{moneyFormat($parent.income.requested)}} ({{numberToString($parent.income.requested)}})
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td class="text-left">
                                <b>OBSERVACIONES:</b> <br>
                                {{$parent.income.obs}}
                            </td>
                        </tr>
                    </tbody>
                </table>

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
    </section>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sfPrintCommon',
    mixins: [ GlobalFunctions ],
}
</script>

<style>    
    .common {
        
    }
    .common .logo{
        width: 100%;
    }

    .common .title{
        font-size: 1.7em;
    }


    table{
        width: 100%;
        margin-bottom: 1em;
        border: solid 2px #000;
        word-wrap: break-word;   
        overflow-wrap: break-word;
    }
    tr, td, th{
        border: solid 1px #000;
        text-align: center;
        padding: 0.5em;
    }

    .midTitle{
        text-align: center;
        font-size: 1.3em;
        font-weight: bold;
    }

    .tableNumbers tr, 
    .tableNumbers td, 
    .tableNumbers th{
        padding: 0.2em;
    }

    .tableSign td {
        height: 8em;
        position: relative;
        vertical-align: bottom;
    }
</style>