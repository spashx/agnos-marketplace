# AGNOS

AGNOS is a lightweight software engineering process for agentic development: requirements, architecture decisions,
plans and tasks, with full traceability from each requirement to the code and tests that fulfil it.

This plugin works with Claude Code and GitHub Copilot, in VS Code or the CLI.

## Getting Started

1. In your project, ask your agent to run the `agnos-init` skill. It completes `CLAUDE.md` and `AGENTS.md` with the
   AGNOS block, creates `agnos-process/` and writes the user's guide `agnos-process/AGNOS-GETTING-STARTED.md`.
2. Ask your agent to start a session. It asks for the session trigram and whether to run tests, then works on a
   `feature/<TRI>` branch.

## Skills

| Skill | Used for |
|---|---|
| [agnos-instructions](skills/agnos-instructions/SKILL.md) | The process itself, loaded before any work |
| [agnos-init](skills/agnos-init/SKILL.md) | Add AGNOS to a project, or update it there |
| [agnos-session](skills/agnos-session/SKILL.md) | Session state at start, reload, metrics at end |
| [agnos-index](skills/agnos-index/SKILL.md) | The generated index of the process artifacts |
| [agnos-git-workflow](skills/agnos-git-workflow/SKILL.md) | The session branch and each task's commit |
| [agnos-design-system](skills/agnos-design-system/SKILL.md) | The design system of a project with a user interface |
| [agnos-perf-center](skills/agnos-perf-center/SKILL.md) | Traceability, quality and delivery of the process on a project |
| [agnos-self-improvement](skills/agnos-self-improvement/SKILL.md) | Improving the project's own rules from the session's friction |

The complete guide, with a worked session, is [AGNOS-GETTING-STARTED.md](skills/agnos-init/assets/templates/AGNOS-GETTING-STARTED.md).

## License

AGPL-3.0-only.
