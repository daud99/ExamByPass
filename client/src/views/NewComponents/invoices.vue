<template>
<core-content :loading="loading">
    <div class="py-5" id="getMessageSection">
        <div class="container-fluid">
            <div class="row">
                <div class="col col-lg-12 col-md-12 col-xs-12">
                    <v-layout justify-center>
                        <h4>Invoices</h4>
                    </v-layout><br><br>
                    <v-layout justify-center>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search By All Fields (Any type of query)" outlined shaped></v-text-field>
                    </v-layout>
                    <v-data-table :headers="headers" :items="invoiceArray" :search="search" class="elevation-1">
                        <template v-slot:item.pdfPrint="{ item }">
                            <button type="button" class="btn btn-sm btn-danger" @click="downloadPdf(item)">
                            Print PDF
                            </button>
                        </template>
                    </v-data-table>
                </div>
            </div>
        </div>
    </div>
    <div id="elementH">
        
    </div>
</core-content>
</template>

<script>
import card from '../../components/Card';
import {
    mapActions,
    mapGetters
} from 'vuex';
import Swal from "sweetalert2";
import {
    quickRequest, dateGet
} from "../../../common/misc";
import PageMixin from "../page-mixin";
import Vue from 'vue'
import JsonCSV from 'vue-json-csv'
import { jsPDF } from "jspdf";
Vue.component('downloadCsv', JsonCSV)
export default {
    data: () => ({
        search: '',
        loading: false,
        headers: [{
                text: 'id',
                value: 'id',
            },
            {
                text: 'Invoice Id',
                value: 'invoiceId'
            },
            {
                text: 'Product Name',
                value: 'productName'
            },
            {
                text: 'total',
                value: 'total'
            },
            {
                text: 'User ID',
                value: 'userId'
            },
            {
                text: 'Issued',
                value: 'createdAt'
            },
            {
                text: 'Last Updated',
                value: 'updatedAt'
            },
            {
                text: 'PDF',
                value: 'pdfPrint'
            },
        ],
        invoiceArray: [],
    }),
    components: {
        card
    },

    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },

    watch: {
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        if (!this["auth/isAuthenticated"] && this["auth/getUser"].roles != 'admin') {
            this.$router.push('/')
        }
        this.initialize()
    },
    beforeDestroy: function () {
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
        downloadPdf(item){
            var doc = new jsPDF();
            doc.setTextColor(0,0,0);
            doc.setFontSize(18);
            doc.text("Invoice Record Of "+item.invoiceId, 10, 10);
            doc.text("", 20, 20);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("id:", 20, 30);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.id.toString(), 20, 40);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Invoice Id:", 20, 50);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.invoiceId.toString(), 20, 60);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Product Name:", 20, 70);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.productName.toString(), 20, 80);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Total:", 20, 90);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.total.toString(), 20, 100);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("User ID:", 20, 110);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.userId.toString(), 20, 120);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Issued", 20, 130);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.createdAt.toString(), 20, 140);

            doc.setTextColor(100);
            doc.setFontSize(20);
            doc.text("Last Updated", 20, 150);

            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            doc.text(item.updatedAt.toString(), 20, 160);

            doc.save('sample-document.pdf');
        },
        async initialize() {
            this.invoiceArray = []
            let invoiceObject = {}
            try {
                let response = await quickRequest("/getInvoices", "GET", {});
                console.log(response)
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                } else {
                    if (response.invoices.length > 0) {
                        for (let index = 0; index < response.invoices.length; index++) {
                            invoiceObject.id = response.invoices[index].id
                            invoiceObject.invoiceId = response.invoices[index].invoiceId
                            invoiceObject.createdAt = dateGet(response.invoices[index].createdAt)
                            invoiceObject.updatedAt = dateGet(response.invoices[index].updatedAt)
                            invoiceObject.total = '$'+response.invoices[index].total
                            invoiceObject.userId = response.invoices[index].userId
                            invoiceObject.productName = response.invoices[index].Product.name
                            this.invoiceArray.push(invoiceObject)
                            invoiceObject = {}
                        }
                    }
                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                    type: "error",
                    title: "Error Fetching Information",
                    text: "Error occured",
                });
            }
        },
    }
}
</script>
