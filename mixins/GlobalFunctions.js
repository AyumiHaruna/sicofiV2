    export default {
    methods: {
        // return one number in ammount format
        moneyFormat: (num) => {
            if ( isNaN(num) || num == null ){
                return '0.00';
            } else {
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
            }       
        },

        showLoader( msg ){
            this.$swal({  title: msg    });
            this.$swal.showLoading();
        },
        hideLoader(){
            this.$swal.close();
        },

        numberToString(value){
            function Unidades(num){
                switch(num)
                {
                  case 1: return "UN";
                  case 2: return "DOS";
                  case 3: return "TRES";
                  case 4: return "CUATRO";
                  case 5: return "CINCO";
                  case 6: return "SEIS";
                  case 7: return "SIETE";
                  case 8: return "OCHO";
                  case 9: return "NUEVE";
                }              
                return "";
            }
              
            function Decenas(num){
                let decena = Math.floor(num/10);
                let unidad = num - (decena * 10);
              
                switch(decena)
                {
                  case 1:   
                    switch(unidad)
                    {
                      case 0: return "DIEZ";
                      case 1: return "ONCE";
                      case 2: return "DOCE";
                      case 3: return "TRECE";
                      case 4: return "CATORCE";
                      case 5: return "QUINCE";
                      default: return "DIECI" + Unidades(unidad);
                    }
                  case 2:
                    switch(unidad)
                    {
                      case 0: return "VEINTE";
                      default: return "VEINTI" + Unidades(unidad);
                    }
                  case 3: return DecenasY("TREINTA", unidad);
                  case 4: return DecenasY("CUARENTA", unidad);
                  case 5: return DecenasY("CINCUENTA", unidad);
                  case 6: return DecenasY("SESENTA", unidad);
                  case 7: return DecenasY("SETENTA", unidad);
                  case 8: return DecenasY("OCHENTA", unidad);
                  case 9: return DecenasY("NOVENTA", unidad);
                  case 0: return Unidades(unidad);
                }
            }//Unidades()
              
            function DecenasY(strSin, numUnidades){
                if (numUnidades > 0)
                    return strSin + " Y " + Unidades(numUnidades)
                
                return strSin;
            }//DecenasY()
              
            function Centenas(num){
            
                let centenas = Math.floor(num / 100);
                let decenas = num - (centenas * 100);
                
                switch(centenas)
                {
                    case 1:
                    if (decenas > 0)
                        return "CIENTO " + Decenas(decenas);
                    return "CIEN";
                    case 2: return "DOSCIENTOS " + Decenas(decenas);
                    case 3: return "TRESCIENTOS " + Decenas(decenas);
                    case 4: return "CUATROCIENTOS " + Decenas(decenas);
                    case 5: return "QUINIENTOS " + Decenas(decenas);
                    case 6: return "SEISCIENTOS " + Decenas(decenas);
                    case 7: return "SETECIENTOS " + Decenas(decenas);
                    case 8: return "OCHOCIENTOS " + Decenas(decenas);
                    case 9: return "NOVECIENTOS " + Decenas(decenas);
                }
                
                return Decenas(decenas);
            }//Centenas()
              
            function Seccion(num, divisor, strSingular, strPlural){
                let cientos = Math.floor(num / divisor)
                let resto = num - (cientos * divisor)
                
                let letras = "";
                
                if (cientos > 0)
                    if (cientos > 1)
                    letras = Centenas(cientos) + " " + strPlural;
                    else
                    letras = strSingular;
                
                if (resto > 0)
                    letras += "";
                
                return letras;
            }//Seccion()
              
            function Miles(num){
                let divisor = 1000;
                let cientos = Math.floor(num / divisor)
                let resto = num - (cientos * divisor)
                
                let strMiles = Seccion(num, divisor, "MIL", "MIL");
                let strCentenas = Centenas(resto);
                
                if(strMiles == ""){
                    return strCentenas;
                }
                return strMiles + " " + strCentenas;            
            //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
            }//Miles()
              
            function Millones(num){
                let divisor = 1000000;
                let cientos = Math.floor(num / divisor)
                let resto = num - (cientos * divisor)
                
                let strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
                let strMiles = Miles(resto);
                
                if(strMillones == ""){
                    return strMiles;
                }                    
                
                return strMillones + " " + strMiles;            
                //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
            }//Millones()
              
            
            var data = {
                numero: value,
                enteros: Math.floor(value),
                centavos: (((Math.round(value * 100)) - (Math.floor(value) * 100))),
                letrasCentavos: "",
                letrasMonedaPlural: "PESOS",
                letrasMonedaSingular: "PESO"
            };
            
            data.letrasCentavos = ` ${data.centavos}/100 M.N`;

            
            if(data.enteros == 0){
                return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
            }
            if (data.enteros == 1){
                return `${Millones(data.enteros)} ${data.letrasMonedaSingular} ${data.letrasCentavos}`;
            } else {
                return `${Millones(data.enteros)} ${data.letrasMonedaPlural} ${data.letrasCentavos}`;
            }
        },

        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
              evt.preventDefault();
            } else {
              return true;
            }
            
        },

        
    },
    computed: {
        getApiUrl: function(){
            return `${process.env.apiUrl}`;
        }
    }
}