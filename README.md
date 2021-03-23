# Doughnut

![dough CI CD](https://github.com/nerds-odd-e/doughnut/workflows/dough%20CI%20CD/badge.svg) [![Join the chat at https://gitter.im/Odd-e-doughnut/community](https://badges.gitter.im/Odd-e-doughnut/community.svg)](https://gitter.im/Odd-e-doughnut/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## About

Doughnut is a Personal Knowledge Management ([PKM](https://en.wikipedia.org/wiki/Personal_knowledge_management)) tool combining [zettelkasten](https://eugeneyan.com/writing/note-taking-zettelkasten/) style of knowledge capture with some features to enhance learning (spaced-repetition, smart reminders) and ability to share knowledge bits with other people (for buddy/team learning).

For more background info you can read:

- <https://www.lesswrong.com/tag/scholarship-and-learning>
- <https://en.m.wikipedia.org/wiki/Knowledge_Acquisition_and_Documentation_Structuring>

### Tech Stack

- [OpenJDK 11](https://openjdk.java.net/projects/jdk/11/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Thymeleaf](https://www.thymeleaf.org/)
- [Gradle](https://gradle.org/)
- [Junit5](https://junit.org/junit5/)
- [Cypress](https://www.cypress.io/)
- [JavaScript](https://www.javascript.com)
- [Cucumber](https://cucumber.io/docs/guides/)
- [Flyway](https://flywaydb.org)
- [MySQL 8.0](https://dev.mysql.com/doc/refman/8.0/en/)
- [Google Cloud](https://cloud.google.com/gcp/getting-started)
- [Traefik](https://traefik.io/)
- [Github Actions](https://docs.github.com/en/actions)
- [Nix](https://nixos.org/)
- [git-secret](https://git-secret.io)

## Getting started

### 1. Install nix

Find instruction at nixos.org (multi-user installation).

#### For macOS:

```
 sh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume
```

#### For Linux:

```
sh <(curl -L https://nixos.org/nix/install) --daemon
```

(NB: if the install script fails to add sourcing of `nix.sh` in `.bashrc` or `.profile`, you can do it manually `source /etc/profile.d/nix.sh`)

_Install `any-nix-shell` for using `fish` or `zsh` in nix-shell_

```
nix-env -i any-nix-shell -f https://github.com/NixOS/nixpkgs/archive/master.tar.gz
```

##### `fish`

Add the following to your _~/.config/fish/config.fish_.
Create it if it doesn't exist.

```
any-nix-shell fish --info-right | source
```

##### `zsh`

Add the following to your _~/.zshrc_.
Create it if it doesn't exist.

```
any-nix-shell zsh --info-right | source /dev/stdin
```

### 2. Setup and run doughnut for the first time (local development profile)

The default spring profile is 'test' unless you explicitly set it to 'dev'. Tip: Add `--Dspring.profiles.active=${profile}"` to gradle task command.
MySQL DB server is started and initialised on entering the `nix-shell`.

Clone and launch local development environment

```bash
git clone $this_repo
cd doughnut
nix-shell --pure
# OR `nix-shell --pure --command "zsh"` if you want to drop down to zsh in nix-shell (uses your OS' ~/.zshrc)
gradle wrapper --distribution-type all
backend/gradlew -p backend bootRunDev"
# open localhost:8080 in your browser
```

#### IntelliJ IDEA (Community) IDE project import

```bash
nohup idea-community &
# open doughnut project in idea
# click import gradle project
# wait for deps resolution
# restore gradle wrapper if missing
```

#### Setup IntelliJ IDEA with JDK11 SDK

- Locate your `nix` installed JDK11 path location with `which java`.
  e.g. `/nix/store/5ib97va5ngfacdqzzcvxff62rjwkxajg-zulu11.2.3-jdk11.0.1/bin/java`.
- **File -> Project Structure -> Platform Settings -> SDKs -> Add JDK...**
  - Enter the full path of above (e.g. `/nix/store/5ib97va5ngfacdqzzcvxff62rjwkxajg-zulu11.2.3-jdk11.0.1`).

#### Run a single targetted JUnit5 test in IntelliJ IDEA

- Setup IntelliJ in Gradle perspective -> Gradle Settings (Wrench Icon) -> Run tests with -> IntelliJ IDEA
- Locate your test file in IDE (e.g. `backend/src/test/com/odde/doughnut/controllers/NoteRestControllerTests.java`).
  - Locate specific test method to run and look out for green run arrow icon in line number gutter.
  - Click on the green run arrow icon to kick off incremental build and single test run.

#### MySQL DB UI Client - DBeaver (ONLY available to Linux users - Non-macOS)

```
nohup dbeaver &
```

### 3. Setup and run doughnut with migrations in 'test' profile

```bash
backend/gradlew -p backend bootRun
```

### 4. Secrets via [git-secret](https://git-secret.io) and [GnuPG](https://www.devdungeon.com/content/gpg-tutorial)

#### Generate your local GnuPG key

- Generate your GnuPG key 4096 bits key using your odd-e.com email address with no-expiry (option 0 in dialog):

```
gpg --full-generate-key
```

- Export your GnuPG public key:

```
gpg --export --armor <your_email>@odd-e.com > <your_email>_public_gpg_key.gpg
```

- Email your GnuPG public key file <your_email>\_public_gpg_key.gpg from above step and private message an existing git-secret collaborator

#### Add a new user's GnuPG public key to local dev machine key-ring for git-secret for team secrets collaboration

- Add public key to local GnuPG key-ring: `gpg --import <your_email>_public_gpg_key.gpg`
- Add user to git-secret managed list of users: `git secret tell <your_email>@odd-e.com`
- Re-encrypt all managed secret files: `git secret hide -d`

#### List who are list of users managed by git-secret and allowed to encrypt/decrypt those files

- Short list of user emails of managed users: `git secret whoknows`
- List of user emails with expiration info of managed users: `git secret whoknows -l`

#### Removes a user from list of git-secret managed users (e.g. user should no longer be allowed access to list of secrets)

```
git secret killperson <user_to_be_removed_email>@odd-e.com
```

#### Add a new file for git-secret to manage

- Remove sensitive file from git: `git rm --cached <the_secret_file>`
- Tell git-secret to manage the file (auto add to .gitignore and update stuff in .gitsecret dir): `git secret add <the_secret_file>`
- Encrypt the file (need to reveal and hide for changes in list of users in dough/secrets*public_keys dir*): `git secret hide`

#### View diff of git-secret managed files

- `git secret changes -p <your__gpg_passphrase>`

#### List all git-secret managed files

- `git secret list`

#### Remove a git-secret file from git-secret management (make sure you reveal/decrypt it before doing this!!!)

- Just remove file from git-secret management but leaves it on the filesystem: `git secret remove <your__no_longer_secret_file>`
- Remove an encrypted file from git-secret management and permanently delete it from filesystem (make sure you have revealed/decrypted the file): `git secret remove -c <your_no_longer_secret_file>`

#### Reveal all git-secret managed encrypted files

- Upon hitting `enter/return` for each decrypt command below, enter secret passphrase you used when you generated your GnuPG key-pair.
- Decrypt secrets to local filesystem: `git secret reveal`
- Decrypt secrets to stdout: `git secret cat`

### 5. Create gcloud compute instance

- [Install `Google Cloud SDK`](https://cloud.google.com/sdk/docs/install)
- [Create App Server in GCloud Compute](infra/scripts/create-gcloud-app-compute.sh)
- Login to gcloud sdk: `gcloud auth login`
- Check your login: `gcloud auth list`
- Set/Point to gcloud dough project: `gcloud config set project carbon-syntax-298809`
- Check you can see the project as login user: `gcloud config list`

### 6. View doughnut app instance startup logs

```
infra/scripts/view-doughnut-app-instance-logs.sh
```

### 7. Shutdown running gcloud compute instance VMs (does not include Google Cloud SQL)

```
infra/scripts/stop-gcloud-doughnut-compute-instances.sh
```

### 8. Build/Refresh base image used to spawn doughnut app compute instance VM

```
cd infra
PACKER_LOGS=1 packer build packer.json`
```

### 9. Check gcloud compute instance startup logs

```
gcloud compute instances get-serial-port-output doughnut-app-instance --zone us-east1-b
```

### 10. End-to-End Test / Features / Cucumber / SbE / ATDD

We use cucumber + cypress + Java library to do end to end test.

- [Cucumber](https://cucumber.io/)
- [cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)

#### Commands

| Purpose                       | Command                               |
| ----------------------------- | ------------------------------------- |
| run all e2e test              | `yarn test`                           |
| run cypress IDE               | `yarn cy:open`                        |
| start SUT (system under test) | `yarn sut` (Not needed for yarn test) |

#### Structure

| Purpose          | Location                            |
| ---------------- | ----------------------------------- |
| feature files    | `/cypress/integration/**`           |
| step definitions | `/cypress/support/step_definitions` |

#### How-to

The Cypress+Cucumber tests are written in JavaScript.

- [Cucumber](https://cucumber.io/)
- [cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)

### 11, Building/refreshing doughnut-app-instance VM base image with Packer + GoogleCompute builder

We use packer + googlecompute builder + shell provisioner to construct and materialise base VM image to speed up deployment and control our OS patches and dependent packages and libraries upgrades

- [Packer](https://www.packer.io)
- [googlecompute](https://www.packer.io/docs/builders/googlecompute)

#### How-to

From `infra` directory, run the following:

Login to dough GCP project account with `gcloud auth login`
Configure gcloud CLI to project ID with `gcloud config set project carbon-syntax-298809`

```bash
export GCLOUDSDK_CORE_PROJECT="$(gcloud config get-value project)"
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/carbon-syntax-298809-f31377ba77a9.json
PACKER_LOG=1 packer build packer.json
```

Expect to see following log line towards end of Packer build stdout log:
`--> googlecompute: A disk image was created: doughnut-debian10-mysql80-base`

### 12. [Product Backlog](https://docs.google.com/spreadsheets/d/1_GofvpnV1tjy2F_aaoOiYTZUOO-8t_qf3twIKMQyGV4/edit?ts=600e6711&pli=1#gid=0)

[Story Map](https://miro.com/app/board/o9J_lTB77Mc=/)

### 13. How to Contribute

- We welcome product ideas and code contribution.
- Collaborate over:
  - [GitHub Discussions](https://github.com/nerds-odd-e/doughnut/discussions) for product ideas/features,
  - [GitHub Issues](https://github.com/nerds-odd-e/doughnut/issues) for reporting issues or bugs, OR
  - [doughnut gitter.im](https://gitter.im/Odd-e-doughnut/community)
- FOSS style; Fork and submit Github PR.
  - Please keep the PR small and on only one topic
  - The code need to come with tests
