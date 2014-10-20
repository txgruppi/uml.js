%lex
%%

'class'                   return 'CLASS'
'interface'               return 'INTERFACE'
'end'                     return 'END'
'+'                       return 'PUBLIC'
'-'                       return 'PRIVATE'
'#'                       return 'PROTECTED'
'<'                       return '<'
':'                       return ':'
'('                       return '('
')'                       return ')'
'['                       return '['
']'                       return ']'
','                       return ','
[a-zA-Z_.][a-zA-Z0-9_.]*  return 'IDENTIFIER'
\s+                       /* skip whitespace */
<<EOF>>                   return 'EOF'
.                         return 'INVALID'

/lex

%start start

%%

start
  : document EOF { return outputResult($1); }
  | EOF { return outputResult(null); }
  ;

document
  : classes { $$ = new DocumentNode(new DiagramNode($1)) }
  ;

classes
  : class { $$ = [$1] }
  | classes class { $$ = $1.concat($2) }
  ;

class
  : CLASS IDENTIFIER inheritance END { $$ = new ClassNode($2, [], [], $3) }
  | CLASS IDENTIFIER inheritance properties END { $$ = new ClassNode($2, $4, [], $3) }
  | CLASS IDENTIFIER inheritance methods END { $$ = new ClassNode($2, [], $4, $3) }
  | CLASS IDENTIFIER inheritance properties methods END { $$ = new ClassNode($2, $4, $5, $3) }
  | INTERFACE IDENTIFIER inheritance END { $$ = new InterfaceNode($2, [], $3) }
  | INTERFACE IDENTIFIER inheritance methods END { $$ = new InterfaceNode($2, $4, $3) }
  ;

inheritance
  : { $$ = [] }
  | '<' identifiers { $$ = $2 }
  ;

identifiers
  : IDENTIFIER { $$ = [$1] }
  | identifiers ',' IDENTIFIER { $$ = $1.concat($3) }
  ;

properties
  : property { $$ = [$1] }
  | properties property { $$ = $1.concat($2) }
  ;

property
  : visibility IDENTIFIER ':' IDENTIFIER { $$ = new PropertyNode($1, $2, $4) }
  | visibility IDENTIFIER ':' IDENTIFIER '[' ']' { $$ = new PropertyNode($1, $2, $4 + $5 + $6) }
  ;

methods
  : method { $$ = [$1] }
  | methods method { $$ = $1.concat($2) }
  ;

method
  : visibility IDENTIFIER '(' arguments ')' return_type { $$ = new MethodNode($1, $2, $6, $4) }
  ;

return_type
  : { $$ = null }
  | ':' IDENTIFIER { $$ = $2 }
  | ':' IDENTIFIER '[' ']' { $$ = $2 + $3 + $4 }
  ;

arguments
  : { $$ = [] }
  | argument { $$ = [$1] }
  | arguments ',' argument { $$ = $1.concat($3) }
  ;

argument
  : IDENTIFIER ':' IDENTIFIER { $$ = new VariableNode($1, $3) }
  | IDENTIFIER ':' IDENTIFIER '[' ']' { $$ = new VariableNode($1, $3 + $4 + $5) }
  ;

visibility
  : PRIVATE
  | PROTECTED
  | PUBLIC
  ;

%%

function outputResult(document) {
  if (!document) {
    return null;
  }

  var classNameFromArray = function(c){ return c && c.replace(/\[\]$/, ''); }

  document.diagram.classes.forEach(function(c){
    c.parents && c.parents.forEach(function(p){
      if (!ClassNode.nameIndex[classNameFromArray(p)] && !InterfaceNode.nameIndex[classNameFromArray(p)]) {
        document.diagram.classes.push(ClassNode.createAndGet(p));
      }
      if (InterfaceNode.nameIndex[classNameFromArray(p)]) {
        document.diagram.links.push(new LinkNode('implementation', classNameFromArray(p), c.name));
      } else {
        document.diagram.links.push(new LinkNode('generalization', classNameFromArray(p), c.name));
      }
    });

    delete c.parents;

    c.properties && c.properties.forEach(function(prop){
      var l = null;
      if ((ClassNode.nameIndex[classNameFromArray(prop.variable.type)] || InterfaceNode.nameIndex[classNameFromArray(prop.variable.type)]) && (l = LinkNode.getIfNew('aggregation', c.name, classNameFromArray(prop.variable.type)))) {
        document.diagram.links.push(l);
      }
    });

    c.methods && c.methods.forEach(function(method){
      var l = null;
      if ((ClassNode.nameIndex[classNameFromArray(method.variable.type)] || InterfaceNode.nameIndex[classNameFromArray(method.variable.type)]) && (l = LinkNode.getIfNew('aggregation', c.name, classNameFromArray(method.variable.type)))) {
        document.diagram.links.push(l);
      }

      method.arguments.forEach(function(arg){
        if ((ClassNode.nameIndex[classNameFromArray(arg.type)] || InterfaceNode.nameIndex[classNameFromArray(arg.type)]) && (l = LinkNode.getIfNew('aggregation', c.name, classNameFromArray(arg.type)))) {
          document.diagram.links.push(l);
        }
      });
    });
  });

  if (typeof module !== 'undefined' && require.main === module) {
    console.log(JSON.stringify(document));
  }

  return document;
}

function DocumentNode(diagram) {
  this.diagram = diagram;
}

function DiagramNode(classes) {
  this.type = 'ClassDiagram';
  this.classes = classes;
  this.links = [];
}

function ClassNode(name, properties, methods, parents) {
  this.name = name;
  this.properties = properties;
  this.methods = methods;
  this.parents = parents;
  if (!ClassNode.nameIndex[name]) {
    ClassNode.nameIndex[name] = this;
  }
}

ClassNode.nameIndex = {};
ClassNode.createAndGet = function(name) {
  return ClassNode.nameIndex[name] || new ClassNode(name, [], [], []);
}

function InterfaceNode(name, methods, parents) {
  this.name = name;
  this.methods = methods;
  this.parents = parents;
  if (!InterfaceNode.nameIndex[name]) {
    InterfaceNode.nameIndex[name] = this;
  }
}

InterfaceNode.nameIndex = {};

function PropertyNode(visibility, name, type) {
  this.visibility = visibility;
  this.variable = {
    name: name,
    type: type,
  }
}

function MethodNode(visibility, name, type, args) {
  this.visibility = visibility;
  this.variable = {
    name: name,
    type: type,
  }
  this.arguments = args;
}

function VariableNode(name, type) {
  this.name = name;
  this.type = type;
}

function LinkNode(type, first, second) {
  this.type = type;
  this.first = first;
  this.second = second;
  var key = type + first + second;
  if (!LinkNode.index[key]) {
    LinkNode.index[key] = this;
  }
}

LinkNode.index = {};
LinkNode.getIfNew = function(type, first, second) {
  var key = type + first + second;
  if (!LinkNode.index[key]) {
    return new LinkNode(type, first, second);
  }
}

parser.ast = {};
parser.ast.DocumentNode = DocumentNode;
parser.ast.DiagramNode = DiagramNode;
parser.ast.ClassNode = ClassNode;
parser.ast.PropertyNode = PropertyNode;
parser.ast.MethodNode = MethodNode;
parser.ast.VariableNode = VariableNode;
