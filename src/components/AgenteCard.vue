<template>
  <div class="card">
    <img :src="agente.displayIcon" alt="agente" />
    <h2>{{ agente.displayName }}</h2>
    <button @click="$emit('ver-detalle', agente)" class="detalle-btn">
      Ver detalle
    </button>
  </div>
</template>

<script>
export default {
  props: {
    agente: Object,
  }
}
</script>