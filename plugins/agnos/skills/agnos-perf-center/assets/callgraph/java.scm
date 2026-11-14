; agnos-perf-center call graph, Java. Fixed capture names: @definition and
; @definition.name (a method or constructor with a body, and its name), @scope and @scope.name (the package, classes,
; interfaces, enums, records), @call and @call.name (a method invocation and the name invoked), @comment (for the IDs
; just above a definition; annotations belong to the definition already).
(method_declaration name: (identifier) @definition.name body: (block)) @definition
(constructor_declaration name: (identifier) @definition.name body: (constructor_body)) @definition
; "package a.b;" stands before the declarations it qualifies: the whole file is its scope.
(program (package_declaration (_) @scope.name)) @scope
(class_declaration name: (identifier) @scope.name) @scope
(interface_declaration name: (identifier) @scope.name) @scope
(enum_declaration name: (identifier) @scope.name) @scope
(record_declaration name: (identifier) @scope.name) @scope
(method_invocation name: (identifier) @call.name) @call
(line_comment) @comment
(block_comment) @comment
