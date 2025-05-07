<script lang="ts" setup>
import { useDrawers } from '~/composables/useDrawers'

const { toggleDrawerRight } = useDrawers()
</script>

<template>
  <VApp>
    <!-- Top Bar -->
    <VAppBar :app="true">
      <VToolbarTitle>Annoying App</VToolbarTitle>
      <VSpacer />
      <VBtn @click.stop="toggleDrawerRight">
        <VIcon color="primary" large>
          mdi-menu
        </VIcon>
      </VBtn>
    </VAppBar>

    <!-- Main Content Area -->
    <VMain class="pa-4">
      <NuxtPage />
    </VMain>

    <!-- Left Drawer -->
    <LeftNavigationDrawer />
    <!-- Right Drawer -->
    <RightNavigationDrawer />
  </VApp>
</template>

<style scoped>
.hidden-md-and-up {
  @media (min-width: 960px) {
    display: none;
  }
}
</style>
