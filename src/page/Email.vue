<template>
    <div class="mail">

        <!-- Topbar mobile -->
        <div class="mail__topbar" @click="panelOpen = true">
            <span class="mail__topbar-title">Messages</span>
            <span class="mail__list-count" v-if="unread > 0">{{ unread }}</span>
        </div>

        <!-- Overlay -->
        <div
        class="mail__overlay"
        :class="{ 'is-open': panelOpen }"
        @click="panelOpen = false"
        ></div>

       <!-- Liste -->
        <aside class="mail__list" :class="{ 'is-open': panelOpen }">
            <div class="mail__list-head">
                <span class="mail__list-title">Messages</span>
                <span class="mail__list-count" v-if="unread > 0">{{ unread }}</span>
                <button class="mail__list-close" @click="panelOpen = false">✕</button>
            </div>

            <div class="mail__list-body">
                <div v-if="loading"
                    class="mail__empty" >
                    Chargement...
                </div>

                <div
                    v-else-if="emails.length === 0"
                    class="mail__empty" >
                    Aucun message
                </div>

                <button
                    v-else
                    v-for="mail in emails"
                    :key="mail.id"
                    class="mail__item"
                    :class="{
                        'is-active':  selected?.id === mail.id,
                        'is-unisRead':  !mail.isRead
                    }"
                    @click="open(mail)" >
                <span class="mail__item-dot" v-if="!mail.isRead"></span>
                <div class="mail__item-content">
                    <div class="mail__item-top">
                        <span class="mail__item-from">{{ mail.sender }}</span>
                        <span class="mail__item-date">{{ formatDate(mail.date) }}</span>
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
                <div class="mail__detail-placeholder"></div>

                <div class="mail__detail-head">
                    <div class="mail__detail-meta">
                        <h2 class="mail__detail-subject">{{ selected.subject }}</h2>
                        <div class="mail__detail-info">
                            <span class="mail__detail-from">{{ selected.sender }}</span>
                            <span class="mail__detail-sep">·</span>
                            <span class="mail__detail-date">{{ formatDateFull(selected.date) }}</span>
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
import request from '@/function/request';

const panelOpen = ref(false);
const emails = ref([]);
const selected = ref(null)
const loading  = ref(true)

const unread = computed(() =>
    emails.value?.filter(m => !m.isRead).length ?? 0
)

const paragraphs = computed(() =>
  selected.value?.text?.split('\n').filter(p => p.trim() !== '') ?? []
)

onMounted(async () => {
  try {
    let response = await request('GET', '/api/emails' );
    emails.value = response.data;
  } finally {
    loading.value = false
  }
})

async function open(mail) {
  selected.value = mail
  panelOpen.value = false

  if (!mail.isRead) {
    mail.isRead = true
    request('POST', `/api/emails/${mail.id}/read`);
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