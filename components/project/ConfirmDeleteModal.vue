<script setup lang="ts">
defineProps<{
  modelValue: boolean
  projectName: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function onCancel() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <BaseModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <template #overlay>
      <div class="confirm-delete-modal__icon">
        <AppIcon name="trash" :size="24" />
      </div>
    </template>
    <template #default="{ titleId }">
      <div class="confirm-delete-modal">
        <h2 :id="titleId" class="confirm-delete-modal__title">Remover projeto</h2>
        <hr class="confirm-delete-modal__divider">
        <p class="confirm-delete-modal__text">Essa ação removerá definitivamente o projeto:</p>
        <p class="confirm-delete-modal__project-name">{{ projectName }}</p>
        <div class="confirm-delete-modal__actions">
          <BaseButton variant="secondary" @click="onCancel">Cancelar</BaseButton>
          <BaseButton variant="primary" @click="onConfirm">Confirmar</BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.confirm-delete-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: var(--space-4);
}

.confirm-delete-modal__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: -32px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: var(--color-white);
}

.confirm-delete-modal__title {
  margin: 0 0 var(--space-6);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.confirm-delete-modal__divider {
  width: 100%;
  border: none;
  border-top: var(--border-width) solid var(--color-border);
  margin: 0 0 var(--space-8);
}

.confirm-delete-modal__text {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.confirm-delete-modal__project-name {
  margin: 0 0 var(--space-8);
  font-size: var(--font-size-3xl);
  line-height: 32px;
  font-weight: var(--font-weight-medium);
  color: var(--color-topbar);
}

.confirm-delete-modal__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
}

.confirm-delete-modal__actions :deep(.base-button) {
  width: 100%;
}

@include breakpoint(sm) {
  .confirm-delete-modal__actions {
    flex-direction: row;
  }

  .confirm-delete-modal__actions :deep(.base-button) {
    flex: 1;
  }
}
</style>
