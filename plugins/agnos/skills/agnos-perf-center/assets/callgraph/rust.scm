; agnos-perf-center call graph, Rust. Fixed capture names: @definition and
; @definition.name (a fn with a body, and its name), @scope and @scope.name (inline modules; impl blocks by their type
; and traits; a module that is a file makes no box), @call and @call.name (a call and the expression called; a macro is
; not one), @comment (for the IDs just above a definition).
(function_item name: (identifier) @definition.name body: (block)) @definition
(mod_item name: (identifier) @scope.name body: (declaration_list)) @scope
(impl_item type: (_) @scope.name body: (declaration_list)) @scope
(trait_item name: (type_identifier) @scope.name body: (declaration_list)) @scope
(call_expression function: (_) @call.name) @call
(line_comment) @comment
(block_comment) @comment
; An attribute stands between the doc comment and its fn: taken as part of the block, it lets the block reach the fn.
(attribute_item) @comment
