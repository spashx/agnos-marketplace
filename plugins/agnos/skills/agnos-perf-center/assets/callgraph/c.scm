; agnos-perf-center call graph, C. Fixed capture names: @definition and @definition.name (a
; function with a body, and its declared name), @call and @call.name (a call site and the expression called), @comment
; (for the IDs just above a definition). C has no scope that qualifies a function.
(function_definition
  declarator: (function_declarator declarator: (_) @definition.name)) @definition
(function_definition
  declarator: (pointer_declarator declarator: (function_declarator declarator: (_) @definition.name))) @definition
(function_definition
  declarator: (pointer_declarator
    declarator: (pointer_declarator declarator: (function_declarator declarator: (_) @definition.name)))) @definition
(call_expression function: (_) @call.name) @call
(comment) @comment
