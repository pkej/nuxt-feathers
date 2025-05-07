import { ref } from 'vue'

const drawerLeft = ref(true)
const drawerRight = ref(false)
const drawerBottom = ref(false)
const drawerTop = ref(false)

export function useDrawers() {
  const toggleDrawerLeft = () => {
    drawerLeft.value = !drawerLeft.value
  }

  const closeDrawerLeft = () => {
    drawerLeft.value = false
  }

  const openDrawerLeft = () => {
    drawerLeft.value = true
  }

  const toggleDrawerRight = () => {
    drawerRight.value = !drawerRight.value
  }

  const closeDrawerRight = () => {
    drawerRight.value = false
  }

  const openDrawerRight = () => {
    drawerRight.value = true
  }

  const closeDrawerTop = () => {
    drawerTop.value = false
  }

  const openDrawerTop = () => {
    drawerTop.value = true
  }

  const toggleDrawerTop = () => {
    drawerTop.value = !drawerTop.value
  }

  const toggleDrawerBottom = () => {
    drawerBottom.value = !drawerBottom.value
  }

  const closeDrawerBottom = () => {
    drawerBottom.value = false
  }

  const openDrawerBottom = () => {
    drawerBottom.value = true
  }

  const closeAllDrawers = () => {
    drawerLeft.value = false
    drawerRight.value = false
    drawerBottom.value = false
    drawerTop.value = false
  }

  return {
    toggleDrawerBottom,
    toggleDrawerLeft,
    toggleDrawerRight,
    toggleDrawerTop,
    closeDrawerBottom,
    closeDrawerLeft,
    closeDrawerRight,
    closeDrawerTop,
    openDrawerBottom,
    openDrawerLeft,
    openDrawerRight,
    openDrawerTop,
    closeAllDrawers,
    drawerLeft,
    drawerRight,
    drawerBottom,
    drawerTop,
  }
}
