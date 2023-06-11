
import OpenAPIParser from "@readme/openapi-parser";

export async function loadOpenApiDocument(openapiDocumentUrl) {
	//let openapiDocumentUrl = 'http://localhost:8000/openapi.json';
	//let openapiDocumentUrl = 'http://localhost:8000/file/swagger.json';
	//let openapiDocumentUrl = 'https://petstore.swagger.io/v2/swagger.json';
	//let openapiDocumentUrl = 'https://petstore3.swagger.io/api/v3/openapi.json';

	let response = await fetch(openapiDocumentUrl, {mode: 'cors', referrerPolicy: 'no-referrer'});
	let openapi = await OpenAPIParser.dereference(await response.json());

	return decorateOpenApi(openapiDocumentUrl, openapi);
}

export function unflattenFormData(data) {
	let content = {};
	for (let [key, value] of data) {
		_unflatten(content, key.split('.'), 1, value);
	}
	return content[''];
}

const isInteger = s => /^\d+$/.test(s);

function _unflatten(previous, path, index, value) {
	if (index >= path.length) { return value; }

	let prevKey = path[index-1];
	let currKey = path[index];
	let newNode = previous[prevKey] || (isInteger(currKey)? []:{});

	//console.log(index, prevKey, currKey, newNode);

	let res = _unflatten(newNode, path, index+1, value);

	newNode[currKey] = res;
	previous[prevKey] = newNode;

	return newNode;
}

function fixFormData(data, schema, required) {
	if (data === undefined && required) {
		if (schema.type === "object") {data = {};}
		if (schema.type === "array") {data = [];}
		//throw "Cant fix form data " + schema.type;
	}
	_fix(data, schema, required);
	return data;
}

function _fix(data, schema, required) {
	console.log('_fix', data, schema, required);

	if ((data === undefined || Object.keys(data).length === 0) && !required) { return; }
	if (!schema || (!schema.type && !("anyOf" in schema))) { return; }
	if (schema.type === "integer") { return; }

	if ("anyOf" in schema) {
		if (data && "anyOf" in data) {
			let selected = data.anyOf;
			delete data.anyOf;
			_fix(data, schema.anyOf[selected], required);
		}
		return;
	}

	if (schema.type === "array") {
		for (let item of data) {
			_fix(item, schema.items, required);
		}
		return;
	}

	for (let [propertyId, property] of Object.entries(schema.properties)) {
		let propertyRequired = schema.required && schema.required.includes(propertyId);
		//console.log(propertyId, propertyRequired, property, data);
		if (property.type === "object") {
			_fix(data[propertyId], property, propertyRequired);
			continue;
		}
		if (property.type === "array" && propertyRequired) {
			data[propertyId] = data[propertyId] || [];
		}
		if (property.type === "array" && data[propertyId] !== undefined) {	
			for (let item of data[propertyId]) {
				_fix(item, property.items, propertyRequired);
			}
			continue;
		}
		if (property.type === "boolean") {
			if (propertyId in data) {
				data[propertyId] = data[propertyId] == "on";
			} else {
				// handles unchecked checkboxes that are not in form data
				data[propertyId] = false;
			}
			continue;
		}
		if ((property.type === "string" || property.type === "integer") && !propertyRequired && !data[propertyId]) {
			delete data[propertyId];
		}
	}
}


export async function callOperation(baseUrl, openapi, path, operation, content) {

	let _url = `${baseUrl}${path}`;
	let _queryParams = new URLSearchParams();

	//console.log('callOperation', operation, content);

	if (operation.parameters) {
		for (let param of operation.parameters) {
			//console.log(param);
			if (param.in == "path") {
				_url = _url.replace(`{${param.name}}`, content[param.name]);
			} else if (param.in == "query") {
				let value = content[param.name];
				if (value) {
					_queryParams.set(param.name, content[param.name]);
				} else if (param.required) {
					if (param.schema.type === "boolean") _queryParams.set(param.name, "false");
				}
			} else {
			}
		}
	}

	_url = `${_url}${_queryParams.size?'?':''}${_queryParams}`;

	let body = null;
	if (operation.requestBody) {
		body = fixFormData(content, operation.requestBody.content['application/json'].schema, operation.requestBody.required);
	}

	return await callEndpoint(_url, operation.method.toLowerCase(), body);
}

export async function callEndpoint(url, method, body) {

	let request;
	if (method == "get") {
		if(body !== null) {
			throw "Tried to send a body to a GET endpoint";
		}
		request = self.fetch(
			url,
			{
				method: method,
				mode: 'cors',
				referrerPolicy: 'no-referrer',
			},
		);
	} else {
		request = self.fetch(
			url,
			{
				method: method,
				mode: 'cors',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			},
		);
	}

	let response;
	try {
		response = await request;
	} catch (error) {
		console.log(error);
	}

	//console.log(response);

	let data;
	try {
		data = await response.json();
	} catch (error) {
		data = {};
	}
	//console.log(data);
	return {response: response, content: data || {}};
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function defaultMap(createDefault) {
	return new Proxy({}, {
		get: (target, name) => {
			if (!(name in target)) {
				target[name] = createDefault();
			}
			return target[name];
		}
	});
}

export function getInputType(property) {
	if (property.type === "string") {
		return {
			"date": "date"
		}[property.format] || "text";
	}
	return {
		"integer": "number",
		"object": "object",
		"array": "array",
	}[property.type];
}

export function schemaFromObject(o) {

	if (Array.isArray(o)) {
		return schemaFromArray(o);
	}

	let properties = {};
	let schema = {
		title: "Object",
		type: "object",
		properties: properties
	};

	for (let key of Object.keys(o)) {
		properties[key] = {title: key, type: "string"};
	}

	schema.required = Object.keys(schema.properties);

	return schema;
}

function schemaFromArray(arr) {
	return {
		title: "Array",
		type: "array",
		items: schemaFromObject(arr[0] || {})
	};
}

function createTag(tagName) {
	return {
		name: tagName,
		description: "Operations about " + name,
		operations: []
	};
}

function addServer(documentUrl, openapi) {

	let url = new URL(documentUrl);

	if (openapi.servers && openapi.servers[0]) {
		let server = openapi.servers[0].url;

		if (server.startsWith('http')) {
			openapi.server = server;
			return;
		}

		if (server.startsWith('/')) {
			openapi.server = url.origin + server;
			return
		}

		openapi.server = url + server;
	}

	openapi.server = url.origin;
}


function linkOperationToTags(openapi) {

	console.log(openapi);

	let otherOperations = [];

	openapi.tags = openapi.tags || [];
	openapi.tags.forEach(t => t.operations = []);

	for (let [path, endpoint] of Object.entries(openapi.paths)) {
		for (let [method, operation] of Object.entries(endpoint)) {

			operation.path = path;
			operation.endpoint = endpoint;
			operation.method = method;
			operation.parameters = operation.parameters || [];

			if (!operation.tags) {
				otherOperations.push(operation);
				continue;
			}

			for (let tagName of operation.tags) {
				let tag = openapi.tags.find(t => t.name == tagName);
				if (!tag) {
					tag = createTag(tagName);
					openapi.tags.push(tag);
				}
				tag.operations.push(operation);
			}
		}
	}

	if (otherOperations.length) {
		openapi.tags.push({
			name: "other",
			description: "Other operations",
			operations: otherOperations
		});
	}
	console.log(openapi);
}

function fillSchema(openapi) {

	const emptyParameters = [];

	for (let endpoint of Object.values(openapi.paths)) {
		for (let operation of Object.values(endpoint)) {
			operation.parameters = operation.parameters || emptyParameters;
			for (let parameter of operation.parameters) {
				parameter.schema.name = parameter.schema.name || parameter.name;
			}
		}
	}
}

export function decorateOpenApi(documentUrl, openapi) {
	addServer(documentUrl, openapi);
	linkOperationToTags(openapi);
	fillSchema(openapi);
	return openapi;
}