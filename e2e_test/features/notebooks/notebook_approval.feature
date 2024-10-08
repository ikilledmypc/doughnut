Feature: Notebook approval

  Background:
    Given I am logged in as an existing user
    And I have the following notebooks:
      | TDD           |
      | GIT           |
      | COW           |


  Scenario: Apply for an approval for a notebook
    When I request for an approval for notebooks:
      | TDD           |
    Then I should see the status "Pending" of the approval for notebook "TDD"

  Scenario: Approval cannot be requested again after requesting it
    When I request for an approval for notebooks:
      | TDD           |
    Then I cannot request approval again for notebook "TDD"
  
  Scenario: Empty approval list is shown
      Given I am logged in as an admin
      When I open certification approval page
      Then I should see empty approval list

  Scenario: Approval list shows pending requests for notebooks
    When I request for an approval for notebooks:
    | TDD           |
    | GIT           |
    When I am logged in as an admin
    And I open certification approval page
    Then I should see following notebooks waiting for approval:
    | Notebook name | Username            | Approve |
    | TDD           | old_learner         | Approve |
    | GIT           | another_old_learner | Approve |

  Scenario: Approved notebook is removed from approval list
      When I request for an approval for notebooks:
      | TDD           |
      | GIT           |
      When I am logged in as an admin
      And I open certification approval page
      Then I should see following notebooks waiting for approval:
      | Notebook name | Username            | Approve |
      | TDD           | old_learner         | Approve |
      | GIT           | another_old_learner | Approve |
      And I approve notebook "TDD"
      Then I should not see notebook "TDD" waiting for approval
  @skip
  Scenario: Approved notebook is removed from approval list
      Given following notebooks are requested for approval:
      | Notebook name | Username            | Approve |
      | TDD           | old_learner         | Approve |
      | GIT           | another_old_learner | Approve |
      And I am logged in as an admin
      When I approve notebook "TDD"
      Then I should not see notebook "TDD" waiting for approval

