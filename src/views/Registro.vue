<template>
    <h1>Registro de Usuario</h1>
    <!-- <form @submit.prevent="registrarUsuario({email: email, password: pass1})"> -->
    <form @submit.prevent="procesarFormulario">
        <input class="form-control mb-2" type="text" placeholder="Email" v-model.trim="email">
        <input class="form-control mb-2" type="password" placeholder="Password" v-model.trim="pass1">
        <input class="form-control mb-2" type="password" placeholder="Confirma Password" v-model.trim="pass2">
        <button class="btn btn-info" type="submit" :disabled="bloquear">Registrar</button>
    </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            email: '',
            pass1: '',
            pass2: ''
        }
    },
    computed: {
        bloquear() {
            if(!this.email.includes('@')) {
                return true
            }
            if (this.pass1.length > 5 && this.pass1 === this.pass2) {
                return false
            }
            return true
        }
    },
    methods: {
        ...mapActions(['registrarUsuario']),
        procesarFormulario() {
            this.registrarUsuario({email: this.email, password: this.pass1});
            this.email = '';
            this.pass1 = '';
            this.pass2 = '';
        }

    }
}
</script>