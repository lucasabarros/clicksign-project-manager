<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { MAX_PROJECT_DATE, MIN_PROJECT_DATE } from '~/utils/date'
import { firstInvalidField, isProjectFormValid, validateProjectForm, type ProjectFormErrors } from '~/utils/validation'
import type { ProjectFormInput } from '~/types/project'

const props = defineProps<{
  initialValue?: ProjectFormInput
  submitLabel: string
}>()

const emit = defineEmits<{
  submit: [value: ProjectFormInput]
}>()

const form = reactive<ProjectFormInput>({
  name: props.initialValue?.name ?? '',
  client: props.initialValue?.client ?? '',
  startDate: props.initialValue?.startDate ?? '',
  endDate: props.initialValue?.endDate ?? '',
  coverImage: props.initialValue?.coverImage ?? null,
})

const errors = ref<ProjectFormErrors>({})
const isCoverProcessing = ref(false)

const isReadyToSubmit = computed(() => isProjectFormValid(validateProjectForm(form)))

type FocusableFieldRef = { focus: () => void } | null

const nameInputRef = ref<FocusableFieldRef>(null)
const clientInputRef = ref<FocusableFieldRef>(null)
const startDateInputRef = ref<FocusableFieldRef>(null)
const endDateInputRef = ref<FocusableFieldRef>(null)

const fieldRefs: Record<keyof ProjectFormErrors, typeof nameInputRef> = {
  name: nameInputRef,
  client: clientInputRef,
  startDate: startDateInputRef,
  endDate: endDateInputRef,
}

function handleSubmit() {
  const validationErrors = validateProjectForm(form)
  errors.value = validationErrors

  const invalidField = firstInvalidField(validationErrors)
  if (invalidField) {
    fieldRefs[invalidField].value?.focus()
    return
  }

  emit('submit', { ...form })
}
</script>

<template>
  <form class="project-form" novalidate @submit.prevent="handleSubmit">
    <div class="project-form__fields">
      <BaseInput
        ref="nameInputRef"
        v-model="form.name"
        label="Nome do projeto"
        required
        :error="errors.name"
      />

      <BaseInput
        ref="clientInputRef"
        v-model="form.client"
        label="Cliente"
        required
        :error="errors.client"
      />

      <div class="project-form__dates">
        <BaseInput
          ref="startDateInputRef"
          v-model="form.startDate"
          type="date"
          label="Data de Início"
          icon="calendar-day"
          :min="MIN_PROJECT_DATE"
          :max="MAX_PROJECT_DATE"
          required
          :error="errors.startDate"
        />
        <BaseInput
          ref="endDateInputRef"
          v-model="form.endDate"
          type="date"
          label="Data Final"
          icon="calendar-check"
          :min="MIN_PROJECT_DATE"
          :max="MAX_PROJECT_DATE"
          required
          :error="errors.endDate"
        />
      </div>

      <ProjectCoverUpload v-model="form.coverImage" @processing-change="isCoverProcessing = $event" />

      <BaseButton
        type="submit"
        :variant="isReadyToSubmit ? 'primary' : 'primary-light'"
        block
        :loading="isCoverProcessing"
        :disabled="isCoverProcessing"
      >
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.project-form {
  width: 100%;
  padding: var(--space-6) var(--space-4);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
}

@include breakpoint(sm) {
  .project-form {
    padding: var(--space-13) var(--space-8);
  }
}

.project-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
  max-width: var(--size-form-max-width);
  margin-inline: auto;
}

.project-form__dates {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@include breakpoint(sm) {
  .project-form__dates {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
