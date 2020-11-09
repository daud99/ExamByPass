<template>
  <core-content :loading="loading">
      <div v-if="msg" class="p-5 m-2">
          <strong>{{msg}}</strong>
      </div>
      <template v-if="!msg">
        <v-card
                class="mx-auto my-3"
                color="#999999"
                dark
                max-width="800" v-for="(row, index) in rows" :key="index"        > 
               
                <v-card-title>
                <v-icon
                    large
                    left
                >
                    mdi-note-text
                </v-icon>
                <span class="title font-weight-light"> <strong>{{row.Product.name}}</strong> Subscription</span>
                </v-card-title>

                <v-card-text class="headline font-weight-bold">
            <v-data-table
                    item-key="name"
                    class="elevation-1"
                    :loading="false"
                    hide-default-footer
                    :headers="headers"
                    :items="[ {...row, 'email': _self['auth/getUser'].email } ]"
                    loading-text="Loading... Please wait"
                ></v-data-table>
                </v-card-text>

                <v-card-actions>
                <v-list-item>
                    <v-list-item color="grey darken-3">
                    <img
                        alt=""
                        src="/img/brand/ExamByPass.png" style="height: 40px; width: 100px;"
                    >
                    </v-list-item>

                    <v-list-item-content>
                    </v-list-item-content>
                </v-list-item>
                </v-card-actions>
        </v-card>
        </template>
  </core-content>
</template>

<script>
import card from '../../components/Card'
import Swal from "sweetalert2";
import {mapGetters} from 'vuex';
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";
import moment from 'moment';

export default {
  mixins: [PageMixin],
  data: () => ({
      headers: [
          {
            text: 'Email',
            align: 'start',
            value: 'email',
          },
          { text: 'Invoice ID', value: 'invoiceId' },
          { text: 'Date Of Issue', value: 'issueDate' },
          { text: 'Total', value: 'total' },
      ],
      rows: [],
      msg: ''
    }),
  components: {
    card
  },
  computed: {
    ...mapGetters(["auth/getUser"])
  },
  async mounted() {
    this.loading = true;
    try {
        this.loading = true;
        let response = await quickRequest("/get-invoices", "POST", {});    
        if(response.msg) {
            this.msg = response.msg;
        } else if(response.invoices) {

            this.rows = response.invoices;
        }
      } catch (e) {
        console.log(e);
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not fetch subscription through the server.",
        });
      } finally {
        this.loading = false;
      }
  },
  methods: {
    
  },
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>