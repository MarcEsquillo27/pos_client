import { mapState , mapMutations } from 'vuex'

const myPlugins  = {
    install(Vue){
        Vue.mixin({
            data() {
                return {

                }
            },
            computed: {
                ...mapState([
                    'storedEmp',
                    'storedName'
                ])
                
            },
            methods: {
                ...mapMutations([
                    'STORE_EMP',
                    'STORE_NAME'
                ])
            },
            
        })
    }
}

export default myPlugins