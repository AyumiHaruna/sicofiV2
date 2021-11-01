<template>
    <div class="row login">
        <div class="col-12">
            <form @submit.prevent="handleSubmit">          
                <h2>Login</h2>
                <input type="text" name="user" v-model="user" placeholder="Usuario" required>
                <input type="password" name="password" v-model="password" placeholder="Contraseña" required>
                ¿Con que año desea trabajar?
                <select name="year" v-model="year" required>
                    <option value="2020">2020</option>
                </select>
                <button type="submit">Enviar</button>
                
                <Loader v-if="$store.state.isLoading" />
            </form>      
        </div>  
    </div>
</template>

<script>
import Loader from '../general/Loader.vue';

export default {
    name: 'Login',
    components: {
        Loader
    },
    data() {
        return {
            user: 'ayumi',
            password: 'aerith',
            year: '2020',
        }
    },
    methods: {
        async handleSubmit() {            
            // console.log(process.env.apiUrl);
            // show loader 
            this.$store.dispatch('setIsLoading', true); 

            // create form object
            const formData = [{
                user: this.user,
                password: this.password,
                year: this.year
            }]

            console.log( JSON.stringify(formData) );

            // make fetch request
            const res = await fetch( `${process.env.apiUrl}/users/login` ,  
            {
                method: 'POST',
                headers: {
                    // 'Content-type' : 'text/plain',
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(formData)
            });
            //get response & change isLoading
            const resData = await res.json();
            this.$store.dispatch('setIsLoading', false); 

            // if is a success data
            if(resData.status === 200) {
                this.createSession(resData.results);
            } else {    //show error message
                toastError(resData.message);
            }   
            // console.log(resData);
        },

        createSession( data ){
            console.log(data);
            localStorage.setItem('id', data.id);
            localStorage.setItem('user', data.user); 
            localStorage.setItem('name', data.name); 
            localStorage.setItem('level', data.level); 
            localStorage.setItem('mail', data.mail); 
            localStorage.setItem('fullAccess', data.fullAccess); 
            localStorage.setItem('year', this.year);
            // if has proyects
            if(data.fullAccess === 0){
                localStorage.setItem('projectList', JSON.stringify(data.projectList));
            }

            // this.$router.push('/')
            this.$router.go();
        }
    }
}
</script>

<style>

</style>