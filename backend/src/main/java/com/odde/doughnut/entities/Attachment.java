package com.odde.doughnut.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
abstract class Attachment extends EntityIdentifiedByIdOnly {
  @NotNull
  @Size(min = 1, max = 255)
  @Getter
  @Setter
  private String name;

  @Getter @Setter private String type;

  @Column(name = "storage_type")
  @Getter
  @Setter
  private String storageType;

  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "attachment_blob_id", referencedColumnName = "id")
  @JsonIgnore
  @Getter
  @Setter
  private AttachmentBlob blob;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  @JsonIgnore
  @Getter
  @Setter
  private User user;
}
