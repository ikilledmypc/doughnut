<template>
  <div class="btn-group btn-group-sm">
    <slot name="additional-buttons" />
    <PopButton title="Edit notebook settings">
      <template #button_face>
        <SvgEditNotebook />
      </template>
      <NotebookEditDialog v-bind="{ notebook }" />
    </PopButton>
    <PopButton
      title="Move to ..."
      v-if="user?.externalIdentifier === notebook.creatorId"
    >
      <template #button_face>
        <SvgMoveToCircle />
      </template>
      <NotebookMoveDialog v-bind="{ notebook }" />
    </PopButton>
    <PopButton
      title="Notebook Questions"
      v-if="user?.externalIdentifier === notebook.creatorId"
    >
      <template #button_face>
        <SvgRaiseHand />
      </template>
      <NotebookQuestionsDialog v-bind="{ notebook }" />
    </PopButton>
    <PopButton title="Notebook Assistant" v-if="user?.admin">
      <template #button_face>
        <SvgRobot />
      </template>
      <template #default="{ closer }">
        <NotebookAssistantManagementDialog
          v-bind="{ notebook }"
          @close="closer($event)"
        />
      </template>
    </PopButton>
    <button
      class="btn btn-sm"
      title="Share notebook to bazaar"
      @click="shareNotebook()"
    >
      <SvgBazaarShare />
    </button>
  </div>
</template>

<script lang="ts">
import PopButton from "@/components/commons/Popups/PopButton.vue"
import usePopups from "@/components/commons/Popups/usePopups"
import SvgBazaarShare from "@/components/svgs/SvgBazaarShare.vue"
import SvgEditNotebook from "@/components/svgs/SvgEditNotebook.vue"
import SvgMoveToCircle from "@/components/svgs/SvgMoveToCircle.vue"
import SvgRaiseHand from "@/components/svgs/SvgRaiseHand.vue"
import { Notebook, User } from "@/generated/backend"
import useLoadingApi from "@/managedApi/useLoadingApi"
import { PropType, defineComponent } from "vue"
import NotebookEditDialog from "./NotebookEditDialog.vue"
import NotebookMoveDialog from "./NotebookMoveDialog.vue"
import NotebookQuestionsDialog from "./NotebookQuestionsDialog.vue"
import NotebookAssistantManagementDialog from "./NotebookAssistantManagementDialog.vue"
import SvgRobot from "../svgs/SvgRobot.vue"

export default defineComponent({
  setup() {
    return { ...useLoadingApi(), ...usePopups() }
  },
  props: {
    notebook: { type: Object as PropType<Notebook>, required: true },
    user: { type: Object as PropType<User>, required: false },
  },
  components: {
    SvgBazaarShare,
    PopButton,
    NotebookEditDialog,
    NotebookMoveDialog,
    NotebookAssistantManagementDialog,
    SvgEditNotebook,
    SvgMoveToCircle,
    SvgRobot,
  },
  methods: {
    async shareNotebook() {
      if (await this.popups.confirm(`Confirm to share?`)) {
        this.managedApi.restNotebookController
          .shareNotebook(this.notebook.id)
          .then(() => this.$router.push({ name: "notebooks" }))
      }
    },
  },
})
</script>
