# Compatibility

What was tested of the plugin `agnos`, per tool and system, and what was not. Each row states only what was observed; this file is
updated after each check.

| Tool or system | Result |
|---|---|
| Claude Code, Windows | Installed from a local folder; `agnos-init` and `agnos-index` run; the block loads the process; an agent found and run. A full session on a new repository ran as the process says, with a marketplace built before `AGNOS-GETTING-STARTED.md`: START SESSION with its question, the index and the branch, a requirement and a plan, the task approved, test first, `commit-task`, the end of the session, and `agnos-perf-center`. |
| GitHub Copilot CLI, Windows | Installed from a local folder; `agnos-init` and `agnos-index` run; the block loads the process on a work question, not on a trivial one; an agent found and run. A full session is not tested yet. |
| GitHub Copilot in VS Code | Installed from Copilot CLI, which shares its configuration; the plugin is read in place from the marketplace's folder. Skills listed; `agnos-init` gives its two steps; the block loads the process in the new conversation. A full session on a new repository ran: START SESSION with its questions, the index and the branch, `validate-ids` run, a requirement and a plan, the task approved, `commit-task`'s message, and `agnos-perf-center` with `--call-graph` and `--history`. Seen departing from the process: the commit staged chosen files instead of `git add .`, the functions cited no requirement, and no failing test run was shown before the code. |
| OpenAI Codex | Not tested: its catalogue and manifest follow its documentation. |
| Linux | Scripts and their tests pass on Ubuntu 24.04, except the tests that need a browser or tree-sitter, not run there. No agent tool was run on it. |
| macOS | Not tested: it shares the Linux scripts. |
| Install from a remote Git repository | Not tested. |

**Scripts for:** Windows (PowerShell 5.1), Linux and macOS (bash).
