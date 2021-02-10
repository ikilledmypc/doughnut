package com.odde.doughnut.testability;

import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.metamodel.EntityType;
import org.hibernate.Metamodel;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.context.ApplicationContext;
import org.springframework.transaction.annotation.Transactional;

public class DBCleaner implements BeforeEachCallback {
  @Override
  public void beforeEach(ExtensionContext context) {
    truncateAllTables();
  }

  @Transactional
  private void truncateAllTables() {
    withEntityManager(entityManager
                      -> getTableNames(entityManager)
                             .forEach(t -> truncateTable(t, entityManager)));
  }

  private EntityManager createEntityManager() {
    ApplicationContext context =
        ApplicationContextForRepositoriesHolder.getApplicationContext();
    EntityManagerFactory emf =
        context.getBean("emf", EntityManagerFactory.class);
    return emf.createEntityManager();
  }

  private void withEntityManager(Consumer<EntityManager> consumer) {
    EntityManager manager = createEntityManager();
    EntityTransaction transaction = manager.getTransaction();
    transaction.begin();
    consumer.accept(manager);
    transaction.commit();
    manager.close();
  }

  private void truncateTable(String tableName, EntityManager entityManager) {
  }

  private List<String> getTableNames(EntityManager manager) {
    Metamodel metamodel = (Metamodel)manager.getMetamodel();
    Set<EntityType<?>> entities = metamodel.getEntities();

    return entities.stream()
        .map(EntityType::getName)
        .collect(Collectors.toList());
  }
}
