package com.odde.doughnut.testability.builders;

import com.odde.doughnut.entities.BazaarNote;
import com.odde.doughnut.entities.NoteEntity;
import com.odde.doughnut.services.ModelFactoryService;
import com.odde.doughnut.testability.MakeMe;

public class BazaarNoteBuilder {
    private final MakeMe makeMe;
    private final BazaarNote bazaarNote;

    public BazaarNoteBuilder(MakeMe makeMe, NoteEntity note) {
        this.makeMe = makeMe;
        bazaarNote = new BazaarNote();
        bazaarNote.setNote(note);
    }

    public void please(ModelFactoryService modelFactoryService) {
        modelFactoryService.bazaarNoteRepository.save(bazaarNote);
    }
}
