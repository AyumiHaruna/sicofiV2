<template>
    <table class="secondLvl">
        <tr>
            <th></th>
            <th v-for="num in 5" :key="num">CAP {{num}}000</th>
        </tr>
        <tr>
            <th>SOLICITADO</th>
            <td v-for="num in 5" :key="num">${{moneyFormat(income.sfData[`cap${num}`])}}</td>
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
    </table>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'SFAmountInfo',
    props: [ "income" ],
    mixins: [ GlobalFunctions ],
    computed: {
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
        }
    }
}
</script>

<style>

</style>