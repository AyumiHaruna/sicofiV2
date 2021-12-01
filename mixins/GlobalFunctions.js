export default {
    methods: {
        // return one number in ammount format
        moneyFormat: (num) => {
            num = parseFloat(num);
            num = num.toFixed(2);
            num += '';
            let x = num.split('.');
            let x1 = x[0];
            let x2 = x.length > 1 ? '.' + x[1] : '';
            let rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        showLoader( msg ){
            this.$swal({  title: msg    });
            this.$swal.showLoading();
        },
        hideLoader(){
            this.$swal.close();
        },
    }
}