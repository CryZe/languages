// Generated by CoffeeScript 1.10.0
(function() {
  var compiler, defaultText, elements, graph, i, j, language, len, len1, name, ref, showElements, source, target, type;

  this.LANGUAGES = new Set;

  elements = [];

  for (i = 0, len = COMPILERS.length; i < len; i++) {
    compiler = COMPILERS[i];
    name = compiler.name, source = compiler.source, target = compiler.target, type = compiler.type;
    ref = [source, target];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      language = ref[j];
      if (LANGUAGES.has(language)) {
        continue;
      }
      elements.push({
        data: {
          id: language,
          color: COLORS[language] || '#ccc'
        }
      });
      LANGUAGES.add(language);
    }
    elements.push({
      data: {
        id: name,
        source: source,
        target: target,
        type: type,
        sourceColor: COLORS[source] || '#ccc',
        targetColor: COLORS[target] || '#ccc'
      }
    });
  }

  defaultText = LANGUAGES.size + " languages\n" + COMPILERS.length + " compilers";

  graph = null;

  window.onload = function() {
    graph = cytoscape({
      container: document.getElementById('graph'),
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'font-size': function(ele) {
              return Math.max(14, 9 + 0.25 * ele.incomers().length);
            },
            'width': 'label',
            'height': function(ele) {
              return Math.min(50, 10 + 2 * ele.incomers().length);
            },
            'color': 'white',
            'background-color': 'data(color)',
            'text-valign': 'center',
            'padding-left': 10,
            'padding-right': 10,
            'padding-top': 10,
            'padding-bottom': 10
          }
        }, {
          selector: 'edge',
          style: {
            'label': 'data(id)',
            'width': 3,
            'font-size': function(ele) {
              return Math.min(Math.max(22 - ele.style()['label'].length, 9), 12);
            },
            'color': 'black',
            'line-color': 'data(sourceColor)',
            'target-arrow-color': 'data(sourceColor)',
            'target-arrow-shape': 'triangle',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'text-opacity': 10,
            'opacity': 0.7,
            'curve-style': 'bezier'
          }
        }
      ]
    });
    return graph.layout({
      name: 'cose-bilkent',
      idealEdgeLength: 101,
      nodeRepulsion: 11000,
      padding: 40,
      random: false
    });
  };

  this.filter = function(e) {
    var count, form, sourceNode, targetNode, text;
    e.preventDefault();
    form = e.currentTarget;
    source = form.source.value;
    target = form.target.value;
    if (!source && !target) {
      return show();
    }
    info.innerText = 'Select a language from the list';
    if ((source && !LANGUAGES.has(source)) || (target && !LANGUAGES.has(target))) {
      return;
    }
    if (source) {
      sourceNode = graph.getElementById(source);
    }
    if (target) {
      targetNode = graph.getElementById(target);
    }
    if (sourceNode && targetNode) {
      elements = sourceNode.successors().intersection(targetNode.predecessors()).add([sourceNode, targetNode]);
      showElements(elements);
      text = '';
    } else if (sourceNode) {
      elements = sourceNode.successors().add(sourceNode);
      showElements(elements);
      count = elements.filter('node').length - 1;
      text = count === 1 ? source + " compiles to " + count + " language" : source + " compiles to " + count + " languages";
    } else if (targetNode) {
      elements = targetNode.predecessors().add(targetNode);
      showElements(elements);
      count = elements.filter('node').length - 1;
      text = count === 1 ? count + " language compiles to " + target : count + " languages compile to " + target;
    }
    return info.innerText = text + "\n" + (elements.filter('edge').length) + " compilers";
  };

  showElements = function(elements) {
    return graph.batch(function() {
      graph.elements().style({
        display: 'none'
      });
      return elements.style({
        display: 'element'
      });
    });
  };

  this.show = function(e) {
    graph.elements().style({
      display: 'element'
    });
    return info.innerText = defaultText;
  };

}).call(this);

//# sourceMappingURL=main.js.map
