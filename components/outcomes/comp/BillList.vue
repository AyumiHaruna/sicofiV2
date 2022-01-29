<template>
    <div class="row billList">
        <div class="col-6 sectionTitle">
            LISTA DE FACTURAS
        </div>
        <div class="col-6 text-right">
            <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir Factura" alt="Añadir Factura" @click="$parent.openBill()">
                <i class="fas fa-file-invoice-dollar"></i>
                AÑADIR FACTURA
            </button>
        </div>
       

        <div class="col-12">
            <table class="secondLvl">
                <thead>
                    <tr>
                        <th>#</th>
                        <th class="whide">FOLIO</th>
                        <th>TOTAL</th>
                        <th>ELIMINAR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(bill, index) in $parent.outcome.bills" :key="index">
                        <td>{{index + 1}}</td>
                        <td>{{bill.foil}}</td>
                        <td>${{moneyFormat(bill.total)}}</td>
                        <td>
                            <button class="miniBtn closeBtn" @click="$parent.deleteBill(bill.id)"> 
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'BillList',
    mixins: [ GlobalFunctions ]
}
</script>

<style>
    .billList .sectionTitle{
        margin-top: 2.5em;
    }
    .billList .whide{
        width: 60%;
    }
</style>