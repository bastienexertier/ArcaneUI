
import OpenAPIParser from "@readme/openapi-parser";

export async function loadOpenApiDocument(openapiDocumentUrl) {
	//let openapiDocumentUrl = 'http://localhost:8000/openapi.json';
	//let openapiDocumentUrl = 'http://localhost:8000/file/swagger.json';
	//let openapiDocumentUrl = 'https://petstore.swagger.io/v2/swagger.json';
	//let openapiDocumentUrl = 'https://petstore3.swagger.io/api/v3/openapi.json';

	let response = await fetch(openapiDocumentUrl, {mode: 'cors', referrerPolicy: 'no-referrer'});
	let openapi = await OpenAPIParser.dereference(await response.json());

	// doc.components = doc.components || {schemas: {}};

	return decorateOpenApi(openapiDocumentUrl, openapi);
}

export async function callOperation(baseUrl, openapi, operation, content) {

	let _url = `${baseUrl}${operation.path}`;
	let _queryParams = new URLSearchParams();

	if (operation.parameters) {
		for (let param of operation.parameters) {
			if (param.in == "path") {
				_url = _url.replace(`{${param.name}}`, content[param.name]);
			} else if (param.in == "query") {
				let value = content[param.name];
				if (value) {
					_queryParams.set(param.name, content[param.name]);
				}
			} else {
			}
		}
	}

	_url = `${_url}${_queryParams.size?'?':''}${_queryParams}`;

	let body = {};
	if (operation.requestBody) {
		let schema = operation.requestBody.content['application/json'].schema;
		for (let [propertyId, property] of Object.entries(schema.properties)) {
			body[propertyId] = content[propertyId];
		}
	}

	return await callEndpoint(_url, operation.method.toLowerCase(), body);
}

export async function callEndpoint(url, method, body) {

	let request;
	if (method == "get") {
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

function createParameterSchema() {
	return {
		title: '',
		name: '',
		type: '',
		description: '',
		type: ''
	}
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