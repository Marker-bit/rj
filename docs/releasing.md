# Releasing

Releases are drafted from SemVer tags. The workflow creates a draft Forgejo
release so it can be reviewed before publishing.

## Versioning

- `v1.2.4` patch: fixes, small UI polish, dependency patch updates.
- `v1.3.0` minor: new features and non-breaking behavior changes.
- `v2.0.0` major: breaking changes, risky migrations, or major product shifts.
- `v1.3.0-rc.1` prerelease: release candidates or test releases.

## Required Secrets

- `RELEASE_TOKEN`: Forgejo token with permission to create releases.
- `OPENAI_API_KEY`: optional. When present, release notes are AI-drafted.
- `OPENAI_MODEL`: optional. Overrides the changelog model.

If `OPENAI_API_KEY` is missing or the AI request fails, the workflow still
creates a draft release from the commit list.

## Creating a Release Draft

```bash
git fetch --tags
git tag v1.3.0
git push origin v1.3.0
```

The release workflow will:

1. Find the previous SemVer tag reachable from the new tag.
2. Collect non-merge commits between the previous tag and the new tag.
3. Generate `release-notes.md`.
4. Create a draft Forgejo release for review.

Review the draft in Forgejo, edit the changelog if needed, then publish it.
