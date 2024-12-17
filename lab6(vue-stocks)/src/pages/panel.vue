<script setup>

import Header from "@/components/Header.vue";
</script>

<template>
  <Header subtitle="ПАНЕЛЬ АДМИНИСТРАТОРА"/>
  <div class="main">
    <v-sheet class="mx-auto" width="50%" min-width="600px">
      <v-table>
        <thead>
        <tr>
          <th class="text-left">
            ID
          </th>
          <th class="text-left">
            Имя брокера
          </th>
          <th class="text-left">
            Баланс
          </th>
          <th class="text-left">
            Акции
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="broker in brokers?.values() ?? []"
          :key="broker.id"
        >
          <td>{{ broker.id }}</td>
          <td>{{ broker.name }}</td>
          <td>{{ broker.balance.toFixed(2) }}</td>
          <td>
            <v-btn @click="curBroker = broker.id; dialog = true" density="comfortable" icon="mdi-list-box-outline"/>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-sheet>

    <v-dialog v-model="dialog" width="auto">
      <v-card
        max-width="600"
        :title="`Акции брокера ${brokers.get(curBroker)?.name ?? ''}`"
      >
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              Обозначение
            </th>
            <th class="text-left">
              Количество
            </th>
            <th class="text-left">
              Текущая цена
            </th>
            <th class="text-left">
              Прибыль
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="stock in brokers.get(curBroker)?.stocks ?? []"
            :key="stock.symbol"
          >
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.count }}</td>
            <td>{{ stocks.get(stock.symbol).price.toFixed(2) }}</td>
            <td
              :style="{color: (stocks.get(stock.symbol).price * stock.count + stock.received - stock.spent >= 0) ? 'green' : 'red'}">
              {{ (stocks.get(stock.symbol).price * stock.count + stock.received - stock.spent).toFixed(2) }}
            </td>
          </tr>
          </tbody>
        </v-table>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Закрыть" @click="dialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import brokerService from "@/service/broker.service.js";
import stocksService from "@/service/stocks.service.js";
import {brokerSocket, stocksSocket} from "@/service/socket.service.js";

export default {
  data() {
    return {
      brokers: null,
      dialog: false,
      curBroker: null,
      stocks: null
    }
  },
  created() {
    brokerService.getBrokers()
      .then(brokers => {
        this.brokers = new Map();

        for (const broker of brokers) {
          this.brokers.set(broker.id, broker);
        }
      });
    stocksService.getStocks()
      .then(stocks => {
        this.stocks = new Map();

        for (const stock of stocks) {
          this.stocks.set(stock.symbol, stock);
        }
      });

    brokerSocket.on("update-brokers", brokers => {
      const tmp = new Map();

      for (const broker of brokers) {
        tmp.set(broker.id, broker);
      }

      if (!tmp.get(this.curBroker)) {
        this.dialog = false;
      }

      this.brokers = tmp;
    });

    stocksSocket.on("update-stocks", stocks => {
      const tmp = new Map();

      for (const stock of stocks) {
        tmp.set(stock.symbol, stock);
      }

      this.stocks = tmp;
    });
  }
}
</script>
