<script setup lang="ts">
import type { ClientApplication } from 'nuxt-feathers/client'
import { type Message, onMounted, ref, useFeathers } from '#imports'

const api = useFeathers().api as any as ClientApplication // workaround for pregenerated .nuxt imports

const messages = ref<Message[]>([])
// get messages
onMounted(async () => {
  console.log('fetching messages')
  messages.value = await api.service('messages').find({ paginate: false })
  console.log('messages', messages.value)
})
</script>

<template>
  <div style="max-width: 300px;">
    <h3>Total: {{ messages.length }}</h3>
    <p v-for="message in messages" :key="message.id" :data-testid="`message-${message.id}`">
      {{ message.id }}: {{ message.text }}
    </p>
  </div>
</template>
