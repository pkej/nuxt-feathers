<script setup lang="ts">
import { useDrawers } from '~/composables/useDrawers'

const { drawerRight } = useDrawers()
const menuItems = [
  { icon: 'mdi-home', text: 'Home' },
  { icon: 'mdi-mail', text: 'Messages' },
  { icon: 'mdi-settings', text: 'Settings' },
]
</script>

<template>
  <v-navigation-drawer
    v-model="drawerRight"
    :persistent="false"
    overlay="true"
    width="250"
    location="right"
    style="right: 0; top: 64px;"
  >
    <VList>
      <VListItem v-for="(item, index) in menuItems" :key="index" link :icon="item.icon">
        {{ item.text }}
      </VListItem>
    </VList>
  </v-navigation-drawer>
</template>
