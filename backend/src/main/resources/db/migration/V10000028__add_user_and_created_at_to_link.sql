ALTER TABLE link
ADD COLUMN user_id INT UNSIGNED;
ALTER TABLE link
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE link SET user_id = 1;
UPDATE link SET created_at = TIMESTAMP(DATE_SUB(NOW(), INTERVAL 10 day));

ALTER TABLE link
    MODIFY user_id INT UNSIGNED NOT NULL;

ALTER TABLE link
ADD CONSTRAINT FK_link_user_id
FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE link
    MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
