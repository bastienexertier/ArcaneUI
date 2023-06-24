
import OpenAPIParser from "@readme/openapi-parser";
import showdown from "showdown";

export const markdownConverter = new showdown.Converter();

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
		if (key.startsWith('body.')) {
			_unflatten(content, key.split('.'), 1, value);
		} else {
			content[key] = value;
		}
	}
	return content;
}

const isInteger = s => /^\d+$/.test(s);

function _unflatten(prevNode, path, index, value) {
	if (index >= path.length) { return value; }

	let prevKey = path[index-1];
	let currKey = path[index];
	let currNode = prevNode[prevKey] || (isInteger(currKey)? []:{});

	let nextNode = _unflatten(currNode, path, index+1, value);

	currNode[currKey] = nextNode;
	prevNode[prevKey] = currNode;

	return currNode;
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
	// console.log('_fix', data, schema, required);

	if (data === undefined) { return; }
	if (!schema || (!schema.type && !("anyOf" in schema))) { return; }
	if (schema.type === "integer") { return; }

	if (!required) {
		// the empty string as a key to mean the object is
		// provided by the user (form was shown)
		let isPresent = data[''];
		delete data[''];
		if (!isPresent) { return; }
	}

	if ("anyOf" in schema) {
		if (data && "anyOf" in data) {
			let selected = data.anyOf;
			delete data.anyOf;
			_fix(data, schema.anyOf[selected], required);
		}
		return;
	}

	if (schema.type === "array") {
		for (let item of removeNullFromArrayInPlace(data)) {
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
			for (let item of removeNullFromArrayInPlace(data[propertyId])) {
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

function removeNullFromArrayInPlace(array) {
	let nNull = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] === null || array[i] === undefined) {
			nNull += 1;
		} else if (nNull != 0) {
			array[i-nNull] = array[i];
		}
	}
	array.length -= nNull;
	return array;
}


export async function callOperation(baseUrl, openapi, path, operation, content) {

	let url = `${baseUrl}${path}`;
	let _queryParams = new URLSearchParams();

	//console.log('callOperation', operation, content);

	if (operation.parameters) {
		for (let param of operation.parameters) {
			//console.log(param);
			if (param.in == "path") {
				url = url.replace(`{${param.name}}`, content[param.name]);
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

	url = `${url}${_queryParams.size?'?':''}${_queryParams}`;

	let body = null;
	if (operation.requestBody) {
		body = fixFormData(content['body'], operation.requestBody.content['application/json'].schema, operation.requestBody.required);
	}

	return await callEndpoint(url, operation.method.toLowerCase(), body);
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

	let data = null;
	try {
		data = await response.json();
	} catch (error) { }
	//console.log(data);
	return {response: response, content: data};
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

export function chooseBestSchema(schemaFromResponses, responseContent) {
	if (schemaFromResponses !== null && Object.keys(schemaFromResponses).length !== 0) return schemaFromResponses;
	return schemaFromObject(responseContent);
}

function schemaFromObject(o) {

	if (o === null) return null;

	if (Array.isArray(o)) {
		return schemaFromArray(o);
	}

	if (typeof o !== 'object') return { title: "Values", type: "string" };

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
		items: schemaFromObject(arr.length === 0? {} : arr[0])
	};
}

export function getOperationCurrentResponse(operation, httpResponse) {
	return operation.responses[httpResponse.status] || operation.responses['default'];
}

export function getResponseSchema(operationResponseType) {

	if (!operationResponseType || !operationResponseType.content) {
		return null;
	}

	if ('application/json' in operationResponseType.content) {
		return operationResponseType.content['application/json'].schema;
	}

	for (let [contentType, contentSchema] of Object.entries(operationResponseType.content)) {
		if (contentType.includes('json')) {
			return contentSchema;
		}
	}

	return null;
}

export function createGetHandler(operation, properties, currentUrl, handleGet) {

	let getUrl = null;
	let getOperation = null;

	if (properties === null) return;

	let operationPath = operation.path.replace(/\/$/, '');

	for (let key of Object.keys(properties)) {
		let endpoint = operation.endpoint.children[operationPath + `/{${key}}`];
		if (endpoint && endpoint.get) {
			getOperation = endpoint.get;
			getUrl = new URL(currentUrl).pathname.replace(/\/$/, '') + `/{${key}}`;
			break;
		}
	}

	return (getUrl && getOperation)? id => handleGet(getUrl, getOperation, id): null;
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

const openapiHttpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];


function linkOperationToTags(openapi) {

	let otherOperations = [];

	openapi.tags = openapi.tags || [];
	openapi.tags.forEach(t => t.operations = []);

	for (let [path, endpoint] of Object.entries(openapi.paths)) {
		for (let [method, operation] of Object.entries(endpoint)) {
			if (!openapiHttpMethods.includes(method)) { continue; }

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
}

function fillSchema(openapi) {

	for (let endpoint of Object.values(openapi.paths)) {
		for (let [method, operation] of Object.entries(endpoint)) {

			if (!openapiHttpMethods.includes(method)) { continue; }

			operation.parameters = operation.parameters || [];

			if (endpoint.parameters) {
				let nonOverridenSharedParameters = endpoint.parameters.filter(
					sharedParameter => !operation.parameters.some(p => p.name == sharedParameter.name)
				);
				operation.parameters.unshift(...nonOverridenSharedParameters);
			}

			for (let parameter of operation.parameters) {
				parameter.schema.name = parameter.schema.name || parameter.name;
			}
		}
	}
}

function walkSchemas(openapi, visitors) {
	Object.values(openapi.components.schemas).forEach(schema => visitors.forEach(visitor => visitor(schema)));
}

function setRequired(schema) {
	if ('required' in schema) { return; }
	Object.entries(schema.properties).forEach(([key, property]) => {
		if (property.required === undefined) {
			property.required = schema.required && schema.required.includes(key);
		}
	})
}

function fixSchemas(openapi) {
	walkSchemas(openapi, [
		// schema => console.log(schema),
		schema => schema.properties = schema.properties || {},
		schema => setRequired(schema)
	]);
}

function arrayStartsWith(prefixArray, array) {
	if (array.length < prefixArray.length) return false;

	for (let i = 0; i < prefixArray.length; i++) {
		if (array[i] !== prefixArray[i]) return false;
	}
	return true;
}

function linkChildOperations(openapi) {

	let _pathes = Object.entries(openapi.paths);
	let endpoints = _pathes.map(([k, v]) => v);
	let pathes = _pathes.map(([k, v]) => k);
	let pathesAsArrays = pathes.map(p => p.replace(/\/$/, '').replace(/^\//, '').split('/'));

	endpoints.forEach((endpoint) => endpoint.children = {});

	for (let i = 0; i < pathesAsArrays.length; i++) {
		let path1 = pathesAsArrays[i];

		for (let j = 0; j < pathesAsArrays.length; j++) {
			let path2 = pathesAsArrays[j];

			if (i === j) continue;
			if (!arrayStartsWith(path1, path2)) continue;

			endpoints[i].children[pathes[j]] = endpoints[j];
		}
	}
}

export function decorateOpenApi(documentUrl, openapi) {
	addServer(documentUrl, openapi);
	linkOperationToTags(openapi);
	linkChildOperations(openapi);
	fillSchema(openapi);
	fixSchemas(openapi);

	console.log(openapi);

	return openapi;
}