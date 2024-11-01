<script setup lang="ts">
import { computed, type Message, useFeathers } from '#imports'

const params = computed(() => ({ query: { $limit: 20 } }))
const messages = useFeathers().api.service('messages').useFind<Message>(params, { paginateOn: 'hybrid' })
</script>

<template>
  <div>
    <p v-for="message in messages.data" :key="message.id" :data-testid="`message-${message.id}`">
      {{ message.id }}: {{ message.text }}
    </p>
  </div>
</template>
