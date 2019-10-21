@Generic_Reusable @login
Feature: Login Check - BOS

  Scenario: User able to login to internet banking

    Given I login as "valid" user for "dummyTest" brand
    When I do logout

