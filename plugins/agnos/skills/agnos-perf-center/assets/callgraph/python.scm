; agnos-perf-center call graph, Python. Fixed capture names: @definition and
; @definition.name (a def, and its name), @scope and @scope.name (classes; modules are files and make no box), @call and
; @call.name (a call and the expression called), @comment (for the IDs just above a definition).
(function_definition name: (identifier) @definition.name) @definition
(class_definition name: (identifier) @scope.name) @scope
(call function: (_) @call.name) @call
(comment) @comment
; A decorator stands between the comment block and its def: taken as part of the block, it lets the block reach the def.
(decorator) @comment
