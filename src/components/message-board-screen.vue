<template>
  <div class="absolute inset-0 overflow-auto text-white">
    <background-polygons />

    <div class="relative mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div class="flex items-center gap-3 pt-4">
        <button
          class="rounded-full bg-white/10 px-4 py-2 font-black backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          @click="emit('back')"
        >
          {{ t('common.back') }}
        </button>
        <h1 class="text-3xl font-black tracking-wider">{{ t('messageboard.title') }}</h1>
      </div>

      <!-- 發表留言 / 回覆 -->
      <div class="flex flex-col gap-2 rounded-2xl bg-black/40 p-4 backdrop-blur-md ring-1 ring-white/10">
        <div v-if="replyTo" class="flex items-center justify-between rounded-lg bg-lime-400/15 px-3 py-1 text-xs">
          <span class="text-lime-300">{{ t('messageboard.replyingTo', { name: replyTo.name || t('messageboard.anonymous') }) }}</span>
          <button class="text-white/60 hover:text-white" @click="replyTo = null">{{ t('messageboard.cancelReply') }}</button>
        </div>
        <input
          v-model="name"
          maxlength="16"
          :placeholder="t('messageboard.namePlaceholder')"
          class="rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
        />
        <textarea
          v-model="text"
          maxlength="200"
          rows="2"
          :placeholder="replyTo ? t('messageboard.replyPlaceholder', { name: replyTo.name || t('messageboard.anonymous') }) : t('messageboard.textPlaceholder')"
          class="resize-none rounded-2xl bg-black/40 px-4 py-2 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
        ></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/40">{{ text.length }}/200</span>
          <button
            class="rounded-full bg-lime-500 px-5 py-1.5 text-sm font-black text-black transition hover:bg-lime-400 active:scale-95 disabled:opacity-40"
            :disabled="!canSend || sending"
            @click="onSend"
          >
            {{ sending ? t('messageboard.sending') : replyTo ? t('messageboard.reply') : t('messageboard.send') }}
          </button>
        </div>
        <p v-if="error" class="text-xs text-rose-300/80">{{ error }}</p>
      </div>

      <div v-if="loading" class="rounded-2xl bg-white/5 p-8 text-center text-white/50">{{ t('messageboard.loading') }}</div>
      <div v-else-if="threads.length === 0" class="rounded-2xl bg-white/5 p-8 text-center text-white/60">
        {{ t('messageboard.empty') }}
      </div>

      <div v-else class="flex flex-col gap-2">
        <div v-for="th in threads" :key="th.msg.id" class="rounded-2xl bg-black/40 p-3 backdrop-blur-md ring-1 ring-white/10">
          <!-- 主留言 -->
          <div class="flex items-baseline justify-between gap-2">
            <span class="truncate font-black text-lime-300">{{ th.msg.name || t('messageboard.anonymous') }}</span>
            <span class="shrink-0 text-[0.66rem] text-white/40">{{ timeText(th.msg.at) }}</span>
          </div>
          <p class="mt-1 whitespace-pre-wrap break-words text-sm text-white/85">{{ th.msg.text }}</p>
          <div class="mt-1 flex gap-3 text-[0.7rem]">
            <button class="text-lime-300/80 hover:text-lime-300" @click="startReply(th.msg)">{{ t('messageboard.replyAction') }}</button>
            <button class="text-rose-300/70 hover:text-rose-300" @click="onDelete(th.msg.id)">{{ t('messageboard.deleteAction') }}</button>
          </div>

          <!-- 回覆 -->
          <div v-if="th.replies.length" class="mt-2 flex flex-col gap-2 border-l-2 border-white/10 pl-3">
            <div v-for="r in th.replies" :key="r.id">
              <div class="flex items-baseline justify-between gap-2">
                <span class="truncate text-sm font-bold text-cyan-300">{{ r.name || t('messageboard.anonymous') }}</span>
                <span class="shrink-0 text-[0.62rem] text-white/40">{{ timeText(r.at) }}</span>
              </div>
              <p class="whitespace-pre-wrap break-words text-sm text-white/80">{{ r.text }}</p>
              <button class="text-[0.66rem] text-rose-300/70 hover:text-rose-300" @click="onDelete(r.id)">{{ t('messageboard.deleteAction') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BackgroundPolygons from './background-polygons.vue';
import { fetchMessages, postMessage, deleteMessage, type Message } from '../game/api';
import { getPlayerName, setPlayerName } from '../game/leaderboard';
import { useI18n } from '../i18n';

const { t } = useI18n();
const emit = defineEmits<{ (e: 'back'): void }>();

const name = ref(getPlayerName());
const text = ref('');
const messages = ref<Message[]>([]);
const loading = ref(true);
const sending = ref(false);
const error = ref('');
const replyTo = ref<{ id: number; name: string } | null>(null);

const canSend = computed(() => name.value.trim().length > 0 && text.value.trim().length > 0);

/** 組成兩層樹：主留言（新到舊）+ 其回覆（依時間舊到新） */
const threads = computed(() => {
  const tops = messages.value.filter((m) => !m.parentId);
  const byParent = new Map<number, Message[]>();
  for (const m of messages.value) {
    if (m.parentId) {
      if (!byParent.has(m.parentId)) byParent.set(m.parentId, []);
      byParent.get(m.parentId)!.push(m);
    }
  }
  for (const arr of byParent.values()) arr.sort((a, b) => a.id - b.id);
  return tops.map((msg) => ({ msg, replies: byParent.get(msg.id) ?? [] }));
});

async function refresh() {
  const list = await fetchMessages();
  if (list) messages.value = list;
  loading.value = false;
}
onMounted(refresh);

function startReply(m: Message) {
  replyTo.value = { id: m.id, name: m.name };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function onSend() {
  if (!canSend.value || sending.value) return;
  sending.value = true;
  error.value = '';
  setPlayerName(name.value); // 記住暱稱，與排行榜共用
  const ok = await postMessage(name.value.trim(), text.value.trim(), replyTo.value?.id ?? 0);
  sending.value = false;
  if (ok) {
    text.value = '';
    replyTo.value = null;
    await refresh();
  } else {
    error.value = t('messageboard.sendFailed');
  }
}

async function onDelete(id: number) {
  const key = window.prompt(t('messageboard.deletePrompt'));
  if (key === null) return;
  const ok = await deleteMessage(id, key.trim());
  if (ok) await refresh();
  else window.alert(t('messageboard.deleteFailed'));
}

function timeText(at: number) {
  const d = new Date(at);
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
</script>
