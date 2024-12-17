<script setup>

import Header from "@/components/Header.vue";
import dayjs from "dayjs";
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, registerables} from 'chart.js'
import {brokerSocket, tradeSocket} from "@/service/socket.service.js"

ChartJS.register(...registerables)
</script>

<template>
  <Header :link="`/profile/${id}`" :subtitle="`ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ${broker?.name ?? ''}`"/>
  <div class="main pl-3">
    <h2 class="date">Текущая дата: {{ dayjs(curDate).format('DD.MM.YYYY') ?? '' }}</h2>
    <h2 class="balance">Баланс: {{ broker?.balance?.toFixed(2) ?? '' }}</h2>
    <router-link to="/panel">
      <v-btn class="mt-2" text="ПАНЕЛЬ" type="submit"/>
    </router-link>
    <v-sheet class="mx-auto" width="70%" min-width="700px">
      <v-table>
        <thead>
        <tr>
          <th class="text-left">
            Обозначение
          </th>
          <th class="text-left">
            Текущая цена
          </th>
          <th class="text-left">
            График
          </th>
          <th class="text-left">
            Количество
          </th>
          <th class="text-left">
            Прибыль
          </th>
          <th class="text-left">
            Купля/Продажа
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="stock in stocks?.values() ?? []"
          :key="stock.symbol"
        >
          <td>{{ stock.symbol }}</td>
          <td>{{ stock.price.toFixed(2) ?? 0 }}</td>
          <td>
            <v-btn @click="openDialog(stock.symbol)" density="comfortable" icon="mdi-chart-line"/>
          </td>
          <td>{{ brokerStocks?.get(stock.symbol)?.count ?? 0 }}</td>
          <td
            :style="{color: (stock.price * (brokerStocks?.get(stock.symbol)?.count ?? 0) + (brokerStocks?.get(stock.symbol)?.received ?? 0) - (brokerStocks?.get(stock.symbol)?.spent ?? 0) >= 0) ? 'green' : 'red'}">
            {{
              (stock.price * (brokerStocks?.get(stock.symbol)?.count ?? 0) + (brokerStocks?.get(stock.symbol)?.received ?? 0) - (brokerStocks?.get(stock.symbol)?.spent ?? 0)).toFixed(2)
            }}
          </td>
          <td>
            <v-form class="d-flex align-items-center ga-2 mt-2" @submit.prevent="submit(stock.symbol)">
              <v-number-input controlVariant="stacked" label="Количество" required
                              v-model="counts[stock.symbol]"
                              :min="-(brokerStocks?.get(stock.symbol)?.count ?? 0)"
                              :max="Math.floor((broker?.balance ?? 0) / stock.price)"/>

              <v-btn type="submit" density="comfortable" :icon="counts[stock.symbol] < 0 ? 'mdi-minus' : 'mdi-plus'"/>
            </v-form>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-sheet>

    <v-dialog v-model="dialog" width="auto">
      <v-card width="1200px" :title="`Исторические данные для ${curStock ?? ''}`">
        <Line :data="stockData"></Line>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import brokerService from "@/service/broker.service.js";
import tradeService from "@/service/trade.service.js";
import stocksService from "@/service/stocks.service.js";
import {brokerSocket, stocksSocket, tradeSocket} from "@/service/socket.service.js";

export default {
  data() {
    return {
      id: this.$route.params.id,
      broker: null,
      brokerStocks: null,
      stocks: null,
      curDate: null,
      counts: {},
      dialog: false,
      stockData: null,
      curStock: null
    }
  },
  created() {
    brokerService.getBroker(this.id)
      .then(broker => {
        const tmp = new Map()

        for (const stock of broker.stocks) {
          tmp.set(stock.symbol, stock)
        }
        delete broker.stocks

        this.broker = broker
        this.brokerStocks = tmp
      });

    tradeService.getInfo()
      .then(info => {
        const tmp = new Map()

        for (const stock of info.stocks) {
          if (stock.isTrade) {
            tmp.set(stock.symbol, stock)
            this.counts[stock.symbol] = 0
          }
        }

        this.stocks = tmp
        this.curDate = info.date
      });

    brokerSocket.on('update-brokers', brokers => {
      const broker = brokers.find(e => e.id === Number(this.id))

      if (broker) {
        const tmp = new Map()

        for (const stock of broker.stocks) {
          tmp.set(stock.symbol, stock)
        }
        delete broker.stocks

        this.broker = broker
        this.brokerStocks = tmp
      } else {
        this.$router.push(`/`)
      }
    })

    tradeSocket.on('update-trade', ({date, stocks}) => {
      const tmp = new Map()

      for (const stock of stocks) {
        if (stock.isTrade) {
          tmp.set(stock.symbol, stock)
          this.counts[stock.symbol] = 0
        }
      }
      if (this.dialog) {
        this.openDialog(this.curStock)
      }

      this.stocks = tmp
      this.curDate = date
    })

    stocksSocket.on('update-stocks', stocks => {
      const tmp = new Map()

      for (const stock of stocks) {
        if (stock.isTrade) {
          tmp.set(stock.symbol, stock)
          this.counts[stock.symbol] = 0
        }
      }
      if (this.dialog) {
        this.openDialog(this.curStock)
      }

      this.stocks = tmp
    })
  },
  methods: {
    submit(symbol) {
      if (this.counts[symbol] > 0) {
        brokerService.buyStocks(this.id, symbol, this.counts[symbol])
      } else if (this.counts[symbol] < 0) {
        brokerService.sellStocks(this.id, symbol, -this.counts[symbol])
      }
      this.counts[symbol] = 0
    },
    openDialog(symbol) {
      stocksService.getStockHistory(symbol)
        .then(data => {
          this.stockData = {
            labels: data.map(el => dayjs(el.date).format('DD.MM.YYYY')).reverse(),
            datasets: [{
              label: symbol,
              data: data.map(el => Number(el.price.toFixed(2))).reverse(),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)'
            }]
          };
          this.curStock = symbol
          this.dialog = true
        })
    },
  }
}
</script>
