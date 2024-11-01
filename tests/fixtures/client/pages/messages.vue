<script setup lang="ts">
import { useFeathers } from '#imports'

const messages = await useFeathers().api.service('messages').find({ paginate: false })
</script>

<template>
  <div>
    <p v-for="message in messages" :key="message.id" :data-testid="`message-${message.id}`">
      {{ message.id }}: {{ message.text }}
    </p>
  </div>
</template>
