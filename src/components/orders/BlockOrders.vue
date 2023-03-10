<template>
  <div class="block-orders">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <span
        >Найдено: <b>{{ count }}</b></span
      >

      <div>
        <b-button variant="primary" :to="{ name: 'order-create' }" v-if="!readOnly" :disabled="readOnly">
            Создать
        </b-button
        >
      </div>
    </div>

    <b-card>
      <b-table
        :items="orders"
        :fields="fields"
        striped
        responsive
        @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
      >
        <template #cell(show_details)>
          <b-form-checkbox plain class="vs-checkbox-con">
            <span class="vs-checkbox">
              <span class="vs-checkbox--check">
                <i class="vs-icon feather icon-check" />
              </span>
            </span>
          </b-form-checkbox>
        </template>

        <template #cell(id)="data">
          <router-link
            style="border-bottom: 1px dotted blue"
            :to="{ name: 'order', params: { id: data.item.id } }"
            >{{ data.item.id }}</router-link
          >
        </template>

        <template #row-details="data">
          <b-card class="mb-1">
            <h5>Отправитель</h5>

            <table class="w-50">
              <tr>
                <td class="w-50 pb-1">ФИО</td>
                <td class="pb-1">{{ data.item.sender_full_name }}</td>
              </tr>

              <tr>
                <td class="pb-1">Пасспорт</td>
                <td class="pb-1">
                  {{ data.item.sender_passport_series }}
                  {{ data.item.sender_passport_no }}
                </td>
              </tr>

              <tr>
                <td class="pb-1">Адрес</td>
                <td class="pb-1">{{ data.item.sender_address }}</td>
              </tr>

              <tr v-if="data.item.sender_city">
                <td class="pb-1">Город</td>
                <td class="pb-1">
                  {{ data.item.sender_city.name }}
                </td>
              </tr>

              <tr v-if="data.item.sender_counterparty">
                <td class="pb-1">Контрагент</td>
                <td class="pb-1">
                  <router-link
                    class="link"
                    target="_blank"
                    :to="{
                      name: 'client',
                      params: { id: data.item.sender_counterparty.id },
                    }"
                  >
                    {{ data.item.sender_counterparty.name }}</router-link
                  >
                </td>
              </tr>

              <tr v-if="data.item.sender_counterparty_type">
                <td class="pb-1">Тип контрагента</td>
                <td class="pb-1">
                  {{ getClientType(data.item.sender_counterparty_type) }}
                </td>
              </tr>
            </table>
          </b-card>

          <b-card>
            <h5>Получатель</h5>

            <table class="w-50">
              <tr>
                <td class="w-50 pb-1">ФИО</td>
                <td class="pb-1">{{ data.item.recipient_full_name }}</td>
              </tr>

              <tr>
                <td class="pb-1">Пасспорт</td>
                <td class="pb-1">
                  {{ data.item.recipient_passport_series }}
                  {{ data.item.recipient_passport_no }}
                </td>
              </tr>

              <tr>
                <td class="pb-1">Адрес</td>
                <td class="pb-1">{{ data.item.recipient_address }}</td>
              </tr>

              <tr v-if="data.item.recipient_city">
                <td class="pb-1">Город</td>
                <td class="pb-1">
                  {{ data.item.recipient_city.name }}
                </td>
              </tr>

              <tr v-if="data.item.recipient_counterparty">
                <td class="pb-1">Контрагент</td>
                <td class="pb-1">
                  <router-link
                    class="link"
                    target="_blank"
                    :to="{
                      name: 'client',
                      params: { id: data.item.recipient_counterparty.id },
                    }"
                  >
                    {{ data.item.recipient_counterparty.name }}</router-link
                  >
                </td>
              </tr>

              <tr v-if="data.item.recipient_counterparty_type">
                <td class="pb-1">Тип контрагента</td>
                <td class="pb-1">
                  {{ getClientType(data.item.recipient_counterparty_type) }}
                </td>
              </tr>

              <tr v-if="data.item.recipient_email">
                <td class="pb-1">Email</td>
                <td class="pb-1">
                  <a :href="`mailto:${data.item.recipient_emai}`">{{
                    data.item.recipient_email
                  }}</a>
                </td>
              </tr>
            </table>
          </b-card>

          <b-card v-if="data.item.payer_counterparty || data.item.payer_city">
            <h5>Плательщик</h5>

            <table class="w-50">
              <tr v-if="data.item.payer_city">
                <td class="w-50 pb-1">Город</td>
                <td class="pb-1">
                  {{ data.item.payer_city.name }}
                </td>
              </tr>

              <tr v-if="data.item.payer_counterparty">
                <td class="pb-1">Контрагент</td>
                <td class="pb-1">
                  <router-link
                    class="link"
                    target="_blank"
                    :to="{
                      name: 'client',
                      params: { id: data.item.payer_counterparty.id },
                    }"
                  >
                    {{ data.item.payer_counterparty.name }}</router-link
                  >
                </td>
              </tr>
            </table>
          </b-card>
        </template>

        <template #cell(location)="data">
          {{ data.item.location || "Не определено" }}
        </template>

        <template #cell(date_created)="data">
          {{ formatDate(data.item.date_created) }}
        </template>

        <template #cell(status)="data">
          <b-badge :variant="getColorStatus(data.item.status)">
            {{ data.item.status || "Не задан" }}
          </b-badge>
        </template>
      </b-table>

      <b-pagination
        v-if="showPagination"
        :total-rows="count"
        :per-page="perPage"
        @change="changePage"
        :value="curPage"
        align="right"
      ></b-pagination>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

import {
  BRow,
  BCol,
  BCard,
  BTable,
  BButton,
  BBadge,
  BFormCheckbox,
  BPagination,
} from "bootstrap-vue";

import { RoleConstants } from '@/utils/role';
import store from "@/store/index";

export default {
  data() {
    return {
      fields: [
        { key: "show_details", label: "" },
        { key: "id", label: "Номер заказа" },
        { key: "date_created", label: "Дата заказа" },
        { key: "status", label: "Статус заказа" },
        { key: "location", label: "Местонахождение" },
        { key: "mode", label: "Режим заказа" },
        { key: "pay_on_order", label: "Наложенный платеж" },
        { key: "places_amount", label: "Количество мест" },
        { key: "sender_full_name", label: "Отправитель" },
        { key: "sender_city.name", label: "Город отправителя" },
        { key: "recipient_full_name", label: "Получатель" },
        { key: "recipient_city.name", label: "Город получателя" },
        { key: "payer_counterparty.name", label: "Плательщик" },
        { key: "contract.contract", label: "Договор" },
      ],

      orderStatus: [],
    };
  },
  components: {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BFormCheckbox,
    BPagination,
  },
  computed: {
    ...mapGetters({
      loading: "moduleOrders/getLoading",
      count: "moduleOrders/getCount",
      perPage: "moduleOrders/getCountPerPage",
      curPage: "moduleOrders/getCurPage",
      orders: "moduleOrders/getOrders",

      orderMode: "moduleOrders/getOrderMode",
      clientType: "moduleClients/getClientType",
    }),
    showPagination() {
      return Math.ceil(this.count / this.perPage) > 1;
    },
    readOnly() {
        return store.state.app.user.role !== RoleConstants.AD && store.state.app.user.role !== RoleConstants.LG;
    }
  },

  methods: {
    ...mapActions({
      fetchOrders: "moduleOrders/fetchOrders",
    }),
    ...mapMutations({
      changeCurPage: "moduleOrders/changePage",
    }),
    getColorStatus(status) {
      return (
        this.orderStatus.find((x) => x.title === status)?.color || "secondary"
      );
    },
    formatDate(date) {
      	return this.dayjs(date).format("DD.MM.YYYY");
    },
    changePage(page) {
      this.changeCurPage(page);
      this.fetchOrders();
    },
    fetchStatus() {
      this.$api.orderStatus.getOrderStatusList().then((response) => {
        this.orderStatus = response.data.results;
      });
    },
    getClientType(clientType) {
      return this.clientType.find((type) => type.id === clientType)
        ?.short_title;
    },
  },
  mounted() {
    this.fetchStatus();

    this.fetchOrders();
  },
};
</script>
