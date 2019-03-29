/* global data, GlideRecord */
(function () {
  data.tables = [{
    name: '',
    display: '',
    calculated: 'All Tables'
  }];
  var tables = new GlideRecord('sn_codesearch_table');
  tables.addQuery('search_group', '9a44f352d7120200b6bddb0c82520376');
  tables.orderBy('table');
  tables.query();
  while (tables.next()) {
    var tablesObj = {};
    tablesObj.name = tables.getValue('table');
    var documentation = new GlideRecord('sys_documentation');
    documentation.addQuery('name', tables.getValue('table'));
    documentation.addQuery('element', '');
    documentation.addQuery('language', 'en');
    documentation.setLimit(1);
    documentation.query();
    if (documentation.next()) {
      tablesObj.display = documentation.getValue('label');
      tablesObj.calculated = documentation.getValue('label') + ' [' + tables.getValue('table') + ']';
    }
    data.tables.push(tablesObj);
  }
})();
