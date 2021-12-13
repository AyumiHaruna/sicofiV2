<template>
    <div class="row">

        <div class="col-4 offset-2 pageTitle">
            Impresión de S.F. <span>{{income.sfId}}</span> ({{ (income.sfData.sfPrintType == 'pro')? 'Proyectos' : 'Servicios' }})
        </div>
        <div class="col-4 text-right buttonContainer">
            <button class="actionBtn infoBtn" @click="createPDF()">
                <i class="fas fa-print"></i>
                IMPRIMIR S.F.
            </button>
        </div>
        
        <div class="col-12">
            <sfPrintCommon id="pro" v-if="income.sfData.sfPrintType === 'pro'"></sfPrintCommon>
            <sfPrintServ id="ser" v-if="income.sfData.sfPrintType === 'ser'"></sfPrintServ>
        </div>

        
      <Toast ref="toast"></Toast>     
    </div>
</template>

<script>
import sfPrintCommon from '@/components/incomes/sfPrintCommon.vue';
import sfPrintServ from '@/components/incomes/sfPrintServ.vue';

import Toast from '@/components/general/Toast.vue';

import jsPDF from 'jspdf'
import html2canvas from "html2canvas"

export default {
    name: 'sf_print',
    components: { sfPrintCommon, sfPrintServ, Toast },
    data() {
        return {
            income: {
                sfId: "",
                requested: 0,
                sfData: {
                    sfPrintType: null,
                    sfTaxType: null,
                    taxConfig: '000',
                    ivaTC: 0,
                    ivaRC: 0,
                    isrRC: 0
                }
            }
        }
    },
    mounted() {
        if( this.$nuxt.$route.query.code ){
            this.getIncomeData( this.$nuxt.$route.query.code );
        } else {
            this.$refs.toast.makeToast('error', `No elegiste una S.F. para imprimir`);
            setTimeout(function(){
                window.location.href = '/';                       
            }, 2500);
        }
    },
    methods: {
        async getIncomeData( incId ){
            const res = await fetch( `${process.env.apiUrl}/incomes/getSF/${incId}`);
            
            if( res.status === 200 ){
                const resData = await res.json();   
                this.income = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `No se pudo obtener los datos de la SF. intenta nuevamente`);
            }
        },

        createPDF () {
            // const doc = new jsPDF('p', 'mm', [210, 297]);            
            // const contentHtml = document.getElementById( this.income.sfData.sfPrintType ).innerHTML;
            // doc.html(contentHtml, {
            //     callback: function(pdf) {
            //         pdf.save("mypdf.pdf")
            //     }
            // });

            let divElm = document.getElementById(this.income.sfData.sfPrintType);
            let elmHeight = divElm.offsetHeight * 0.26; // the % that elmWidth is reduced, keep height proportional
            // let elmWidth = divElm.offsetWidth;
            
            html2canvas( divElm, {
                scale: 2,
                quality: 4,
            }).then(canvas => {
                const img = canvas.toDataURL("image/png", 1);
                let pdf = new jsPDF('p', 'mm', [297, 210]);
                pdf.addImage(img, "PNG", 0, 0, 210, elmHeight);
                pdf.save(`${this.income.sfId}.pdf`);
            })
           
        },
    },
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

        actType: function(){
            switch (this.income.sfData.sfTaxType) {
                case "pro":
                    return 'Servicios Profesionales'
                    break;

                case "tec":
                    return 'Servicios Técnicos'
                    break;
            
                case "lra":
                    return 'Lista de raya'

                default:
                    return 'N/A'
                    break;
            }
        },

        ivaTra(){
            if( this.income.sfData.taxConfig[0] == true ){
                return ( this.income.requested * this.income.sfData.ivaTC );
            } else {    return 0;   }
        },
        ivaRet(){
            if( this.income.sfData.taxConfig[1] == true ){
                return ( this.income.requested * this.income.sfData.ivaRC );
            } else {    return 0;   }
        },
        isrRet(){
            if( this.income.sfData.taxConfig[2] == true ){
                return ( this.income.requested * this.income.sfData.isrRC );
            } else {    return 0;   }
        }
    }
}
</script>

<style>
    .pageTitle{
        text-align: center;
        font-size: 1.6em;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .pageTitle span{
        font-weight: bold;
        color: #b3b300;
    }
    .buttonContainer{
        margin-top: 1em;
        margin-bottom: 1em;
    }

    .printPage{
        background: #fff;
        color: #000;
        width: 826px;
        padding: 2em 5em;
        margin: auto;
        font-size: 0.7em;
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
        padding: 0.5em 0.2em;
    }
</style>