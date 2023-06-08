
export async function callEndpoint(url, doc, action, formData) {

	let _url = `${url}${action.path}`;
	let _queryParams = new URLSearchParams();

	if (action.parameters) {
		for (let param of action.parameters) {
			if (param.in == "path") {
				_url = _url.replace(`{${param.name}}`, formData.get(param.name));
			} else if (param.in == "query") {
				let value = formData.get(param.name);
				if (value) {
					_queryParams.set(param.name, formData.get(param.name));
				}
			} else {
			}
		}
	}

	let body = {};
	if (action.requestBody) {
		let schema = action.requestBody.content['application/json'].schema;
		for (let [propertyId, property] of Object.entries(schema.properties)) {
			body[propertyId] = formData.get(propertyId);
		}
	}

	let request;
	if (action.method.toLowerCase() == "get") {
		request = self.fetch(
			`${_url}?${_queryParams}`,
			{
				method: action.method,
				mode: 'cors',
				referrerPolicy: 'no-referrer',
			},
		);
	} else {
		request = self.fetch(
			`${_url}?${_queryParams}`,
			{
				method: action.method,
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
		"integer": "number"
	}[property.type];
}

export function schemaFromObject(o) {
	let schema = {};
	for (let key of Object.keys(o)) {
		schema[key] = {'title': key};
	}
	return schema;
}