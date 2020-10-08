<script>

export default {
    data: function() {
        return {
            loading: false,
            afullView: false,
        };
    },
    // computed properties allow use to take the data or component and change their value before displaying
    computed: {
        fullView: {
            get: function() {
                return this.afullView;
            },
            set: function(newValue) {
                if(this.afullView == newValue) {
                    return;
                }

                this.afullView = newValue;
                // $emit is used to produce custom event 
                // first parameter is the name of event i.e. update:fullview
                // second parameter is the value we passed to the event listener
                this.$emit('update:fullView', newValue);
            }
        }
    },
    methods: {
        showPreloader: function() {
            this.loading = true;
        },
        hidePreloader: function() {
            this.loading = false;
        }
    }
};
</script>
