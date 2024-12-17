<template>
  <Header subtitle="АВТОРИЗАЦИЯ"/>
  <div class="main">
    <v-sheet class="mx-auto" width="300">
      <v-form @submit.prevent="submit" v-model="valid">
        <v-text-field v-model="userName" :rules="rules" label="Имя брокера" required/>

        <v-btn class="mt-2" text="Отправить" type="submit" block :disabled="!valid"/>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
</script>

<script>
import brokerService from "@/service/broker.service.js";

export default {
  data: vm => ({
    valid: false,
    rules: [
      value => {
        if (value) return true

        return 'Введите своё имя.'
      },
      value => {
        if (value?.length > 2) return true

        return 'Имя должно быть длиннее 2х символов'
      }
    ],
    userName: '',
  }),

  methods: {
    async submit(event) {
      if (this.valid) {
        brokerService.getBrokerId(this.userName)
          .then(id => this.$router.push(`/profile/${id}`))
          .catch(() => console.log('fuck'));
      }
    }
  },
}
</script>
