package com.odde.doughnut.entities;

import com.odde.doughnut.testability.MakeMe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(locations = {"classpath:repository.xml"})
@Transactional
public class CommentReadStatusTest {
    @Autowired
    MakeMe makeMe;
    User user;
    Note note;
    Comment comment;

    @BeforeEach
    void setup() {
        user = makeMe.aUser().please();
        note = makeMe.aNote().please();
        comment = makeMe.aComment(note, user).please();
    }

    @Test
    void shouldCreateCommentReadStatus() {
        CommentReadStatus status = makeMe.aCommentReadStatus(comment, user).please();

        assertThat(status.getComment().getId(), equalTo(comment.getId()));
        assertThat(status.getUser().getId(), equalTo(user.getId()));
    }
}
