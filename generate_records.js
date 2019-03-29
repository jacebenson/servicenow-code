var deleteRecord = function(){
	var v = new GlideRecord('sn_codesearch_table');
	v.addQuery('search_group','9a44f352d7120200b6bddb0c82520376');
	v.deleteMultiple();
};
deleteRecord();
var records = {};
var listOfFieldsToCheck = ['script', 'xml', 'html', 'html_script', 'script_plain', 'html_script', 'conditions', 'variable_conditions', 'condition_string'];
var listOfDoesNotContain = ['var__', 'bsm_', 'log', 'metric', 'ecc', 'clone', 'content_', 'sys_update_'];//, 'u_'];
var listOfTablesToForce = [{
		table: "sys_variable_value",
		column: "value"
	},{
		table: "sys_dictionary",
		column: "default_value"
	},{
		table: "sys_ui_style",
		column: "value"
	}];

var message = '--->Script Location List\n';
var scriptLocationList = buildScriptLocationList(listOfFieldsToCheck, listOfDoesNotContain, listOfTablesToForce);
message += '---> scriptLocationList.length: ' + scriptLocationList.length + '\n';

for (var i=0; i < scriptLocationList.length; i++) {
	message += scriptLocationList[i].table + ' - ' + scriptLocationList[i].column_name + ' - ' + scriptLocationList[i].type + '\n';
	if(records[scriptLocationList[i].table]){
		records[scriptLocationList[i].table].push(scriptLocationList[i].column_name);
	} else {
		records[scriptLocationList[i].table] = [scriptLocationList[i].column_name];
	}
}
///sn_codesearch_table_list.do?sysparm_query=search_group%3D9a44f352d7120200b6bddb0c82520376
//search_group=9a44f352d7120200b6bddb0c82520376^table=bsm_action^search_fields=name,script
function onlyUnique(value, index, self){
	return self.indexOf(value) === index;
}
for (var table in records){
	var fields = records[table].toString();
	var codeSearchTable = new GlideRecord('sn_codesearch_table');
	codeSearchTable.addQuery('search_group','9a44f352d7120200b6bddb0c82520376');
	codeSearchTable.addQuery('table', table);
	codeSearchTable.query();
	if(codeSearchTable.next()){
		codeSearchTable.setValue('search_fields', fields);
		codeSearchTable.update();
	} else {
		var cst = new GlideRecord('sn_codesearch_table');
		cst.initialize();
		cst.setValue('table', table);
		cst.setValue('search_group','9a44f352d7120200b6bddb0c82520376');
		cst.setValue('search_fields', fields);
		gs.info('trying to insert on ' + table + ' for fields: ' + fields);
		cst.insert();
	}
	
}
message = '\n\n--->Exception Location List\n';
var exceptionLocationList = buildExceptionLocationList(listOfDoesNotContain);
message += '---> exceptionLocationList.length: ' + exceptionLocationList.length + '\n';

for (var i=0; i < exceptionLocationList.length; i++) {
	message += exceptionLocationList[i].table + ' - ' + exceptionLocationList[i].column_name + ' - ' + exceptionLocationList[i].type + '\n';
}

function buildScriptLocationList(listOfFieldsToCheck, listOfDoesNotContain, listOfTablesToForce) {
	
	var scriptLocations = new GlideRecord('sys_dictionary');
	// what fields do we want to check for?
	var query = 'internal_type.name' + 'IN' + listOfFieldsToCheck + '^';
	// tables we want to exclude
	for (var j=0; j < listOfDoesNotContain.length; j++) {
		query += 'nameDOES NOT CONTAIN' + listOfDoesNotContain[j] + '^';
	}
	// this is how you do multiple order bys with a gliderecord
	for (var n=0; n < listOfTablesToForce.length; n++){
		query += 'NQ';
		query += 'name=' + listOfTablesToForce[n].table + '^';
		query += 'element=' + listOfTablesToForce[n].column;
		if(listOfTablesToForce.length != n){
			query += '^';
		}
	}
	scriptLocations.addEncodedQuery(query);
	scriptLocations.query();
	
	scriptLocList = [];
	
	while(scriptLocations.next()) {
		var scriptLocation = {};
		scriptLocation.table = scriptLocations.getValue('name');
		scriptLocation.column_name = scriptLocations.getValue('element');
		scriptLocation.type = scriptLocations.getValue('internal_type');
		scriptLocList.push(scriptLocation);
	}
	return scriptLocList;
}
	
function buildExceptionLocationList(listOfDoesNotContain) {
	
	// this is a best practice for allowing your encoded query to be easier to maintain
	var sql = 'internal_type=string' +
		'^elementNOT LIKEdescript' +
		'^elementNOT LIKEsubscript' +
		'^elementNOT LIKEjavascript' +
		'^elementNOT LIKEcondition_type' +
		'^elementLIKEscript' +
		'^ORelementLIKEcondition' + 
		'^ORelementLIKEhtml' + 
		'^ORelementLIKExml';

	var exceptionLocations = new GlideRecord('sys_dictionary');
    exceptionLocations.addEncodedQuery(sql);
	for (j=0; j < listOfDoesNotContain.length; j++) {
		exceptionLocations.addQuery('name', 'DOES NOT CONTAIN', listOfDoesNotContain[j]);
	}
	exceptionLocations.orderBy('name');//.orderBy('element');
	exceptionLocations.query();
	
	exceptionLocList = [];
	
	while(exceptionLocations.next()) {
		var exceptionLocation = {};
		exceptionLocation.table = exceptionLocations.getValue('name');
		exceptionLocation.column_name = exceptionLocations.getValue('element');
		exceptionLocation.type = exceptionLocations.getValue('internal_type');
		exceptionLocList.push(exceptionLocation);
	}
	return exceptionLocList;
}