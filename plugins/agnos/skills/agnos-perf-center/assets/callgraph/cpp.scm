; agnos-perf-center call graph, C++. Fixed capture names: @definition and @definition.name (a
; function or method with a body, and its declared name), @scope and @scope.name (what qualifies the definitions inside),
; @call and @call.name (a call site and the expression called), @comment (for the IDs just above a definition).
(function_definition
  declarator: (function_declarator declarator: (_) @definition.name)) @definition
(function_definition
  declarator: (pointer_declarator declarator: (function_declarator declarator: (_) @definition.name))) @definition
(function_definition
  declarator: (pointer_declarator
    declarator: (pointer_declarator declarator: (function_declarator declarator: (_) @definition.name)))) @definition
(function_definition
  declarator: (reference_declarator (function_declarator declarator: (_) @definition.name))) @definition
(namespace_definition name: (_) @scope.name) @scope
(class_specifier name: (_) @scope.name body: (_)) @scope
(struct_specifier name: (_) @scope.name body: (_)) @scope
(union_specifier name: (_) @scope.name body: (_)) @scope
(call_expression function: (_) @call.name) @call
(comment) @comment
