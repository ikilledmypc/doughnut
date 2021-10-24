/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/vue";
import NoteMinmap from "@/components/notes/mindmap/NoteMindmap.vue";
import store from "../../src/store/index.js";
import { renderWithStoreAndMockRoute } from "../helpers";
import makeMe from "../fixtures/makeMe";

describe("note mindmap", () => {
  const notes = []
  beforeEach(()=>{
    notes.length = 0
  })

  const renderAndGetContainer = (noteId) => {
    store.commit("loadNotes", notes);
    const { wrapper } = renderWithStoreAndMockRoute(
      store,
      NoteMinmap,
      { props: { noteId, scale: 1, ancestors: [] } },
    );
    return wrapper.container
  }

  it("should render one note", async () => {
    notes.push(makeMe.aNote.title("single note").shortDescription('not long').please())
    renderAndGetContainer(notes[0].id)
    expect(screen.getByRole("card")).toHaveTextContent("single note");
  });

  describe("with two notes", () => {
    beforeEach(()=>{
      const note = makeMe.aNote.title("note1").please();
      const childNote = makeMe.aNote.title("note2").under(note).please();
      notes.push(note)
      notes.push(childNote)
    })

    it("should render the two notes", async () => {
      renderAndGetContainer(notes[0].id)
      expect(screen.getAllByRole("card")).toHaveLength(2)
    });

    it("should connect the two notes", async () => {
      const container = renderAndGetContainer(notes[0].id)
      const connection = await container.querySelector("svg.mindmap-canvas")
      const line = connection.querySelector("line")
      expect(parseFloat(line.getAttribute("x2"))).toBeCloseTo(0)
      expect(parseFloat(line.getAttribute("y2"))).toBeCloseTo(185)
    });

    describe("with two grandchildren notes", () => {
      beforeEach(()=>{
        const childNote = notes[1]
        notes.push(makeMe.aNote.title('grand1').under(childNote).please())
        notes.push(makeMe.aNote.title('grand2').under(childNote).please())
      })

      it("should connect the two notes", async () => {
        const container = renderAndGetContainer(notes[0].id)
        const connection = await container.querySelector("svg.mindmap-canvas")
        const lines = connection.querySelectorAll("line")
        expect(lines).toHaveLength(3)
        expect(parseFloat(lines[2].getAttribute("x1"))).toBeCloseTo(-75)
        expect(parseFloat(lines[2].getAttribute("y1"))).toBeCloseTo(198.1212)
        expect(parseFloat(lines[2].getAttribute("y2"))).toBeCloseTo(189.0275953)
      });

    })
    describe("links between notes", () => {
      beforeEach(()=>{
        const [top, child1] = notes
        const child2 = makeMe.aNote.title('child2').under(top).linkTo(child1).please()
        notes.push(child2)
      })

      it("should link the two linked notes", async () => {
        const container = renderAndGetContainer(notes[0].id)
        const connection = await container.querySelector("svg.mindmap-canvas")
        const linkStart = connection.querySelectorAll(".link-start")
        expect(linkStart).toHaveLength(2)
        expect(linkStart[0].getAttribute("transform")).toEqual("translate(244, 25) rotate(36)")
        expect(linkStart[1].getAttribute("transform")).toEqual("translate(-176, 25) rotate(36)")
      });

      it("should link the two linked notes", async () => {
        const container = renderAndGetContainer(notes[0].id)
        const connection = await container.querySelector("svg.mindmap-canvas")
        const lines = connection.querySelectorAll("g.notes-link path")
        expect(lines).toHaveLength(1)
        const d = lines[0].getAttribute("d")
        expect(d).toMatch(/M -142 50/)
        expect(d).toMatch(/.*? 278 50/)
      });

    });

    describe("links between note and note outside the map", () => {
      it("link target is not on the map", async () => {
        const [top, child1] = notes
        const noteThatIsNotOnTheMap = makeMe.aNote.title('not on the map').please()
        const child2 = makeMe.aNote.title('child2').under(top).linkTo(noteThatIsNotOnTheMap).please()
        notes.push(noteThatIsNotOnTheMap)
        notes.push(child2)
        const container = renderAndGetContainer(notes[0].id)
        const connection = await container.querySelector("svg.mindmap-canvas")
        const lines = connection.querySelectorAll("g.notes-link line")
        expect(lines).toHaveLength(0)
      });

    })


  });

})
