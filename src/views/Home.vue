<template>
  <div class="home">
    <div class="filtros">
      <input v-model="busqueda" placeholder="Buscar agente..." class="buscador" />
      <select v-model="filtroRol" class="select-rol">
        <option value="">Todos los roles</option>
        <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">{{ rol }}</option>
      </select>
    </div>

    <div v-if="agentesFiltrados.length === 0">No se encontraron agentes.</div>

    <div class="agentes">
      <AgenteCard
        v-for="agente in agentesFiltrados"
        :key="agente.uuid"
        :agente="agente"
        @toggle-fav="toggleFavorito"
        @ver-detalle="verDetalle"
        :es-favorito="favoritos.includes(agente.uuid)"
      />
    </div>

   
    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>{{ detalleAgente.displayName }}</h2>
        <img :src="detalleAgente.fullPortrait || detalleAgente.bustPortrait" alt="imagen" class="modal-img" />
        <p><strong>Rol:</strong> {{ detalleAgente.role?.displayName || 'Sin rol' }}</p>
        <p><strong>Descripción:</strong> {{ detalleAgente.description || 'Sin descripción' }}</p>
        <button @click="cerrarModal" class="btn-rojo">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import AgenteCard from '../components/AgenteCard.vue'

export default {
  components: { AgenteCard },
  data() {
    return {
      agentes: [],
      busqueda: '',
      filtroRol: '',
      favoritos: JSON.parse(localStorage.getItem('favoritos')) || [],
      modalAbierto: false,
      detalleAgente: {}
    }
  },
  computed: {
    rolesDisponibles() {
      const roles = new Set(this.agentes.map(a => a.role?.displayName).filter(Boolean))
      return Array.from(roles)
    },
    agentesFiltrados() {
      return this.agentes.filter(agente => {
        const nombreCoincide = agente.displayName.toLowerCase().includes(this.busqueda.toLowerCase())
        const rolCoincide = this.filtroRol === '' || agente.role?.displayName === this.filtroRol
        return nombreCoincide && rolCoincide
      })
    }
  },
  mounted() {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=es-ES')
      .then(res => res.json())
      .then(data => {
        this.agentes = data.data
      })
      .catch(err => console.error(err))
  },
  methods: {
    toggleFavorito(id) {
      if (this.favoritos.includes(id)) {
        this.favoritos = this.favoritos.filter(fav => fav !== id)
      } else {
        this.favoritos.push(id)
      }
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos))
    },
    verDetalle(agente) {
      this.detalleAgente = agente
      this.modalAbierto = true
    },
    cerrarModal() {
      this.modalAbierto = false
    },
    obtenerAnio(agente) {
      if (agente?.date) return new Date(agente.date).getFullYear()
      return 'No disponible'
    }
  }
}
</script>