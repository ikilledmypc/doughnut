/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/vue";
import NoteControlCenter from "@/components/toolbars/NoteControlCenter.vue";
import helper from "../helpers";
import makeMe from "../fixtures/makeMe";
import history, { History } from "../../src/store/history";

helper.resetWithApiMock(beforeEach, afterEach);

describe("Note Control Center", () => {
  let histories: History;

  const historyWriter = (writer: (h: History) => void) => {
    writer(histories);
  };

  beforeEach(() => {
    histories = history({ noteUndoHistories: [] });
  });

  it("fetch API to be called ONCE", async () => {
    helper
      .component(NoteControlCenter)
      .withProps({ histories, historyWriter })
      .render();

    expect(await screen.findByTitle("undo")).toBeDisabled();
  });

  it("show undo when there is something to undo", async () => {
    const notebook = makeMe.aNotebook.please();
    histories.deleteNote(notebook.headNote.id);
    helper
      .component(NoteControlCenter)
      .withProps({ histories, historyWriter })
      .render();

    expect(await screen.findByTitle("undo delete note")).not.toBeDisabled();
  });
});
