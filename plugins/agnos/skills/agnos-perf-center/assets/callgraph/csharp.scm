; agnos-perf-center call graph, C#. Fixed capture names: @definition and
; @definition.name (a method, constructor or local function with a block or "=>" body, and its name), @scope and
; @scope.name (namespaces, classes, structs, interfaces, records), @call and @call.name (an invocation and the expression
; invoked), @comment (for the IDs just above a definition; attributes belong to the definition already).
(method_declaration name: (identifier) @definition.name body: (_)) @definition
(constructor_declaration name: (identifier) @definition.name body: (_)) @definition
(local_function_statement name: (identifier) @definition.name body: (_)) @definition
(namespace_declaration name: (_) @scope.name) @scope
; "namespace A.B;" stands before the declarations it qualifies: the whole file is its scope.
(compilation_unit (file_scoped_namespace_declaration name: (_) @scope.name)) @scope
(class_declaration name: (identifier) @scope.name) @scope
(struct_declaration name: (identifier) @scope.name) @scope
(interface_declaration name: (identifier) @scope.name) @scope
(record_declaration name: (identifier) @scope.name) @scope
(invocation_expression function: (_) @call.name) @call
(comment) @comment
