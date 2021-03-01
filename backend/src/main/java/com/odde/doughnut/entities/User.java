package com.odde.doughnut.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.odde.doughnut.controllers.exceptions.NoAccessRightException;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "user")
public class User {
    @Id @Getter @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Getter @Setter private String name;
    @Column(name = "external_identifier") @Getter @Setter private String externalIdentifier;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    @Getter @Setter private List<NoteEntity> notes = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Where(clause = "parent_id IS NULL")
    @JsonIgnore
    @Getter private List<NoteEntity> orphanedNotes;

    public List<NoteEntity> getNotesInDescendingOrder() {
        List<NoteEntity> notes = getNotes();
        notes.sort(Comparator.comparing(NoteEntity::getUpdatedDatetime).reversed());
        return notes;
    }

    public List<NoteEntity> filterLinkableNotes(NoteEntity source, String searchTerm) {
        List<NoteEntity> linkableNotes = getAllLinkableNotes(source);
        if (searchTerm != null) {
            return linkableNotes.stream()
                    .filter(note -> note.getTitle().contains(searchTerm))
                    .collect(Collectors.toList());
        }
        return linkableNotes;
    }

    private List<NoteEntity> getAllLinkableNotes(NoteEntity source) {
        List<NoteEntity> targetNotes = source.getTargetNotes();
        List<NoteEntity> allNotes = getNotes();
        return allNotes.stream()
                .filter(i -> !targetNotes.contains(i))
                .filter(i -> !i.equals(source))
                .collect(Collectors.toList());
    }

    public boolean owns(NoteEntity note) {
        return note.getUser().id == id;
    }

    public void checkAuthorization(NoteEntity note) throws NoAccessRightException {
        if (! owns(note)) {
            throw new NoAccessRightException();
        }
    }
}
