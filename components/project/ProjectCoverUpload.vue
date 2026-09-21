<script setup lang="ts">
import { ref } from 'vue'
import {
  ACCEPTED_COVER_IMAGE_TYPES,
  CoverImageError,
  type CoverImageErrorReason,
  isAcceptedCoverImageType,
  isCoverImageWithinSizeLimit,
  processCoverImage,
} from '~/utils/image'

defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'processing-change': [processing: boolean]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isProcessing = ref(false)
const errorMessage = ref('')

const ERROR_MESSAGES: Record<CoverImageErrorReason, string> = {
  'invalid-type': 'Formato não suportado. Escolha uma imagem .jpg ou .png.',
  'too-large': 'O arquivo é muito grande. O tamanho máximo é 5MB.',
  'compression-failed': 'Não foi possível processar esta imagem. Tente outra ou uma versão menor.',
}

function openFileDialog() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  errorMessage.value = ''

  if (!isAcceptedCoverImageType(file)) {
    errorMessage.value = ERROR_MESSAGES['invalid-type']
    return
  }
  if (!isCoverImageWithinSizeLimit(file)) {
    errorMessage.value = ERROR_MESSAGES['too-large']
    return
  }

  isProcessing.value = true
  emit('processing-change', true)
  try {
    const dataUrl = await processCoverImage(file)
    emit('update:modelValue', dataUrl)
  } catch (error) {
    const reason = error instanceof CoverImageError ? error.reason : 'compression-failed'
    errorMessage.value = ERROR_MESSAGES[reason]
  } finally {
    isProcessing.value = false
    emit('processing-change', false)
  }
}

function removeCover() {
  emit('update:modelValue', null)
}
</script>

<template>
  <div class="project-cover-upload">
    <p class="project-cover-upload__label">Capa do projeto</p>

    <div v-if="modelValue" class="project-cover-upload__preview">
      <img :src="modelValue" alt="" class="project-cover-upload__preview-image">
      <BaseButton
        icon-only
        label="Remover capa do projeto"
        variant="surface"
        size="sm"
        class="project-cover-upload__remove"
        @click="removeCover"
      >
        <AppIcon name="trash" size="sm" />
      </BaseButton>
    </div>

    <div v-else class="project-cover-upload__dropzone">
      <AppIcon name="upload" :size="24" />
      <p class="project-cover-upload__hint">Escolha uma imagem .jpg ou .png no seu dispositivo</p>
      <BaseButton
        size="sm"
        variant="secondary"
        type="button"
        :loading="isProcessing"
        :disabled="isProcessing"
        @click="openFileDialog"
      >
        Selecionar
      </BaseButton>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      class="project-cover-upload__input"
      :accept="ACCEPTED_COVER_IMAGE_TYPES.join(',')"
      aria-hidden="true"
      tabindex="-1"
      @change="onFileSelected"
    >

    <p v-if="errorMessage" class="project-cover-upload__error" role="alert">{{ errorMessage }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.project-cover-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-cover-upload__label {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}

.project-cover-upload__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  max-height: 395px;
  padding: var(--space-8) var(--space-4);
  border: var(--border-width) dashed var(--color-text-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.project-cover-upload__hint {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.project-cover-upload__preview {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.project-cover-upload__preview-image {
  width: 100%;
  aspect-ratio: 702 / 421;
  max-height: 395px;
  object-fit: cover;
}

.project-cover-upload__remove {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
}

.project-cover-upload__input {
  @include visually-hidden;
}

.project-cover-upload__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-error);
}
</style>
