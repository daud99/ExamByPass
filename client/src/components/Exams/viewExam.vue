<template>
  <div >
    <v-dialog
    v-model="dialog"
    max-width="45%"
    >
    <template v-slot:activator="{ on, attrs }">
        <v-btn
        color="red lighten-2"
        dark
        v-bind="attrs"
        v-on="on"
        >
        Click Me
        </v-btn>
    </template>

    <v-card>
        <v-card-title class="headline blue darken-2">
        <h3 style="color:white">Start Exam:&nbsp;&nbsp;</h3><h4 style="color:white">Exam Name</h4>
        </v-card-title>

        <div class="container-fluid">
            <div class="row">
                <div class="col col-lg-12 col-md-12 col-xs-12">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <h4 style="color:white; text-weigth:bolder; line-height: 1.6;">
                        <v-icon color="white">mdi-play</v-icon>
                            CONTINUE LAST SESSION
                        </h4>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">AT QUESTION 1/3</h6>
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col col-lg-6 col-md-6 col-xs-6">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <v-icon color="white">mdi-clock</v-icon>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">TRAINING MODE</h6>
                    </button>
                </div>
                <div class="col col-lg-6 col-md-6 col-xs-6">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <v-icon color="white">mdi-clock</v-icon>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">EXAM MODE</h6>
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col col-lg-12 col-md-12 col-xs-12">
                <p>WE SHOW YOU THE CORRECT ANSWER AFTER EACH QUESTION. THERE IS NO TIME LIMIT DURING TRAINING</p>
                </div>
            </div>

            <div class="row">
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <v-icon color="white">mdi-dialpad</v-icon>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">TRAINING MODE</h6>
                    </button>
                </div>
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <v-icon color="white">mdi-message-text</v-icon>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">EXAM MODE</h6>
                    </button>
                </div>
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <button type="button" class="btn btn-sm btn-primary btn-block">
                        <v-icon color="white">mdi-checkbox-marked-circle</v-icon>
                        <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">EXAM MODE</h6>
                    </button>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col col-lg-12 col-md-12 col-xs-12">
                <p>RANDOMIZE</p>
                </div>
            </div>
            <div class="row">
                <div class="col col-lg-6 col-md-6 col-xs-6">
                    <v-checkbox
                        v-model="ex4"
                        label="Question order (Unavailable in trail mode)"
                        color="success"
                        value="primary"
                        hide-details
                    ></v-checkbox> 
                </div>
                <div class="col col-lg-6 col-md-6 col-xs-6">
                    <v-checkbox
                        v-model="ex4"
                        label="Answer order"
                        color="success"
                        value="primary"
                        hide-details
                    ></v-checkbox>  
                </div>
            </div>

            <div class="row">
                <div class="col col-lg-12 col-md-12 col-xs-12">
                <p>Question Types</p>
                </div>
            </div>
            <div class="row">
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <v-checkbox
                        v-model="ex4"
                        label="Drag and Drop"
                        color="success"
                        value="primary"
                        hide-details
                    ></v-checkbox> 
                </div>
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <v-checkbox
                        v-model="ex4"
                        label="Single Choice"
                        color="success"
                        value="primary"
                        hide-details
                    ></v-checkbox>  
                </div>
                <div class="col col-lg-4 col-md-4 col-xs-4">
                    <v-checkbox
                        v-model="ex4"
                        label="Hot Area"
                        color="success"
                        value="primary"
                        hide-details
                    ></v-checkbox>  
                </div>
            </div>
        </div>
        
        <v-divider></v-divider>

        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="dialog = false"
        >
            I accept
        </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
  </div>
</template>

<script>
import card from '../../components/Card'
export default {
    data () {
        return {
        dialog: false,
        }
    },
    components: {
    card,
    }
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>