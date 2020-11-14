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
                >
                  <template v-slot:item.pdfPrint="{ item }">
                      <button type="button" class="btn btn-sm btn-danger" @click="downloadPdf(item)">
                      Print PDF
                      </button>
                  </template>
                </v-data-table>
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
import { quickRequest , dateGet } from "../../../common/misc";
import PageMixin from "../page-mixin";
import moment from 'moment';
import { jsPDF } from "jspdf";

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
          { text: 'Amount OFF', value: 'coupon.amount_off' },
          { text: 'Percent OFF', value: 'coupon.percent_off' },
          { text: 'Total', value: 'total' },
          { text: 'PDF', value: 'pdfPrint' },
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
            this.rows.forEach(element => {
              element.issueDate = dateGet(element.issueDate);
              if(element.coupon.percent_off) {
                let cut = (element.percent_off / 100) * total;
                element.total -= cut;
              }
              if(element.amount_off) element.total -= element.amount_off;
              element.total = '$'+element.total;
              if(element.percent_off) element.percent_off = '%'+element.percent_off;
            });
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
    downloadPdf(item){
      console.log(item)
            let y = 10;
            var doc = new jsPDF();
            doc.setTextColor(0,0,0);
            doc.setFontSize(18);
            doc.text("Invoice Record Of "+item.invoiceId, 10, y+=10);
            doc.text("", 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("id:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.id.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Invoice Id:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.invoiceId.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Product Name:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.Product.name.toString(), 20, y+=10);

            if(item.coupon){
              doc.setTextColor(100);
              doc.setFontSize(20);
              if(item.coupon.amount_off) doc.text("Amount OFF:", 20, y+=10);
              if(item.coupon.percent_off) doc.text("Percent OFF:", 20, y+=10);

              doc.setTextColor(0,0,0);
              doc.setFontSize(10);
              if(item.coupon.amount_off) doc.text(item.coupon.amount_off, 20, y+=10); 
              if(item.coupon.percent_off) doc.text(item.coupon.percent_off, 20, y+=10);
            }

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Total:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.total.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("User ID:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.userId.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("User Email:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.email.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Product Id:", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.productPid.toString(), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Issued", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(dateGet(item.createdAt), 20, y+=10);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Last Updated", 20, y+=10);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(dateGet(item.updatedAt), 20, y+=10);

            doc.save('invoice.pdf');
        },
    
  },
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>