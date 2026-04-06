<template>
    <Back />
    <div class="mail">

        <!-- Liste -->
        <aside class="mail__list">
            <div class="mail__list-head">
                <span class="mail__list-title">Messages</span>
                <span class="mail__list-count" v-if="unread > 0">{{ unread }}</span>
            </div>

            <div class="mail__list-body">
                <div v-if="loading"
                    class="mail__empty" >
                    Chargement...
                </div>

                <div
                    v-else-if="mails.length === 0"
                    class="mail__empty" >
                    Aucun message
                </div>

                <button
                    v-else
                    v-for="mail in mails"
                    :key="mail.id"
                    class="mail__item"
                    :class="{
                        'is-active':  selected?.id === mail.id,
                        'is-unread':  !mail.read
                    }"
                    @click="open(mail)" >
                <span class="mail__item-dot" v-if="!mail.read"></span>
                <div class="mail__item-content">
                    <div class="mail__item-top">
                        <span class="mail__item-from">{{ mail.from }}</span>
                        <span class="mail__item-date">{{ formatDate(mail.sentAt) }}</span>
                    </div>
                    <span class="mail__item-subject">{{ mail.subject }}</span>
                </div>
                </button>
            </div>
        </aside>

        <!-- Contenu -->
        <section class="mail__detail">
            <div class="mail__empty mail__empty--center" v-if="!selected">
                <span class="mail__empty-icon">✦</span>
                <span>Sélectionnez un message</span>
            </div>

            <template v-else>
                <div class="mail__detail-head">
                    <div class="mail__detail-meta">
                        <h2 class="mail__detail-subject">{{ selected.subject }}</h2>
                        <div class="mail__detail-info">
                            <span class="mail__detail-from">{{ selected.from }}</span>
                            <span class="mail__detail-sep">·</span>
                            <span class="mail__detail-date">{{ formatDateFull(selected.sentAt) }}</span>
                        </div>
                    </div>
                </div>

                <div class="mail__detail-body">
                    <p
                        v-for="(paragraph, i) in paragraphs"
                        :key="i"
                        class="mail__detail-p" >
                        {{ paragraph }}
                    </p>
                </div>

                <div class="mail__attachments" v-if="selected.attachments?.length">
                    <p class="mail__attachments-label">Pièces jointes</p>
                    <div class="mail__attachments-list">
                        <a :href="file.url" 
                            v-for="file in selected.attachments"
                            :key="file.id"
                            class="mail__attachment">
                            <img :src="file.url" alt="" >
                        </a>
                    </div>
                </div>

            </template>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Back from '@/component/Back.vue';
import request from '@/function/request';

const mails    = ref([
  {
    "id": "uuid",
    "from": "Gardien.exe",
    "subject": "Accès au Scriptorium refusé",
    "body": "Tu n'as pas les permissions requises.\n\nUtilise la rune ᚺ pour forger un nouveau passage.",
    "sentAt": "2026-04-05T14:32:00Z",
    "read": false,
    "attachments": [
      {
        "id": "uuid",
        "name": "acces_scriptorium.rune",
        "size": "2.4 Ko",
        "url": "/test.jpg"
      }
    ]
  }
])
const selected = ref(null)
const loading  = ref(true)

const unread = computed(() => mails.value.filter(m => !m.read).length)

const paragraphs = computed(() =>
  selected.value?.body?.split('\n').filter(p => p.trim() !== '') ?? []
)

onMounted(async () => {
  try {
    mails.value = await request('GET', '/api/email' )
  } finally {
    loading.value = false
  }
})

async function open(mail) {
  selected.value = mail

  if (!mail.read) {
    mail.read = true
    // await fetch(`/api/mails/${mail.id}/read`, {
    //   method: 'PATCH',
    //   headers: { ...getAuthHeader() }
    // })
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function formatDateFull(dateStr) {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>