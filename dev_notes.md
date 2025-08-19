## Project Description
An educational, collaborative app to preserve, record, and share Nicaragua’s popular, cultural,
and traditional knowledge. The app connects schools, families, and communities so cultural
heritage reaches new generations.

## Project Goals
- Preserve and disseminate cultural memories through multimedia stories (image, text, audio, video)
- Actively involve schools, families, and communities in content creation and curation
- Provide an interactive map of geolocated memories by neighborhood, municipality, or community
- Offer a cultural calendar of traditional events, fairs, and festivities
- Build a collaborative library of popular knowledge, recipes, and customs
- Create educational challenges/games about identity, sovereignty, and patriotic values

## Stakeholders
- Students and teachers (education system)
- Families and community elders (primary storytellers)
- Cultural organizations and municipalities (event owners)
- Reviewers/moderators (content quality and cultural sensitivity)

## Development Approach

Scrum mixed with XP. The following rules are applied:
- Sprint (1-3 weeks)
- Pair Programming is present (on-site, on-call) with at least 1-hour session.
- Daily Scrum with a message (unless needed)
- Sprint Review (weekly meeting) on Saturdays at 5pm-8pm
- Sprint Retrospective at the end of weekly meeting.
- No TEST AUTOMATIZATION
- On-Site Customer (or Product Manager)

### GitHub Workflow
#### Branching
- Main: protected; release-ready
- Branch names derived from issues shouldn't have more than three words
- Feature branches: feat/<short-name>
- Hotfix: hotfix/<short-name>
- Refactor branches: ref/<short-name>
- Release (optional): release/<sprint-tag>
- **Delete branches after closed PR**

#### Commit convention
- Conventional Commits:
	- feat(map): add clustering on municipality view
	- fix(story): compress images before upload
	- chore(ci): add build cache
 - [Conventional commit reference](https://www.conventionalcommits.org/en/v1.0.0/)
 - Commits no longer than 50 characters
 - Verbs in infinitive NO PERSONS.

#### Issues & Labels
- Use GitHub Issues for tasks and bugs
- Issues' names should be three words or less
- Issues should contain an example of User Stories (if possible)
  -  As a _<role>_, I want _<feature>_ so that _<benefit>_.
  -  Kenneth will drop a template (remind me plz)

#### Project Board (GitHub Projects)
- Columns: Backlog → Ready → In Progress → Review → Done

#### Pull Requests (PRs)
- Small, focused PRs in issues
- Require review from 1 teammate
- Link issue: closes #123

### Definition of Done (DoD)
- Meets acceptance criteria
- Linted, tested, and reviewed
- Accessible labels/alt text added
- Documentation updated
