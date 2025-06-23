<script setup lang="ts">
import mobileBanner from '#assets/images/banner-mobile.png'
import banner from '#assets/images/banner.png'
</script>

<template>
  <div class="banner">
    <img
      alt="COSCUP x RubyConf Taiwan 2025 banner"
      :src="banner"
    >
    <img
      alt="COSCUP x RubyConf Taiwan 2025 mobile banner"
      class="mobile"
      :src="mobileBanner"
    >
  </div>
</template>

<style scoped>
@media screen and (min-width: 513px) {
  .banner > .mobile {
    display: none;
  }

  .banner {
    max-width: 1152px;
  }

  .banner img {
    border-radius: 12px;
  }

  .main .actions {
    align-items: center;
    gap: 12px;
  }
}

@media screen and (max-width: 512px) {
  .banner > :not(.mobile) {
    display: none;
  }

  .banner {
    padding-left: 24px;
    padding-right: 24px;
  }

  .banner .mobile {
    border-radius: 6px;
  }
}

@media screen and (min-width: 1024px) {
  .banner {
    margin: 0 auto;
  }
}
</style>
