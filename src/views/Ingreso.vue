<template>
   <h1>Ingreso de Usuario</h1>
    <!-- <form @submit.prevent="registrarUsuario({email: email, password: pass1})"> -->
    <form @submit.prevent="procesarFormulario">
        <input class="form-control mb-2" type="text" placeholder="Email" v-model.trim="email">
        <input class="form-control mb-2" type="password" placeholder="Password" v-model.trim="pass1">
        <button class="btn btn-info" type="submit" :disabled="bloquear">Ingresar</button>
    </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            email: '',
            pass1: '',
        }
    },
    computed: {
        bloquear() {
            if(!this.email.includes('@')) {
                return true
            }
            if (this.pass1.length > 5) {
                return false
            }
            return true
        }
    },
    methods: {
        ...mapActions(['ingresoUsuario']),
        procesarFormulario() {
            this.ingresoUsuario({email: this.email, password: this.pass1});
            this.email = '';
            this.pass1 = '';
        }

    }
}
</script>