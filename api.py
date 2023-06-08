
from typing import Annotated

from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette import status

app = FastAPI(
	title='My Task Manager',
	description='Une superbe application.'
)

origins = [
	'http://localhost:5173',
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=['*'],
	allow_headers=['*'],
)

class User(BaseModel):
	name:str
	age:int
	gender:str
	favorite_color:str = 'Red'


users = [User(name='Bastien', age=25, gender='male', favorite_color='red')]

@app.get('/users', response_model=list[User], tags=['users'])
def get_users() -> list[User]:
	"""Returns every regirstered user"""
	return users

@app.get('/users/{user_id}', response_model=User, tags=['users'])
def get_user(user_id:int) -> User:
	try:
		return users[user_id]
	except IndexError:
		raise HTTPException(status_code=404)

@app.post('/users', response_model=User, tags=['users'])
def post_user(user:User) -> User:
	"""Adds a new user"""
	users.append(user)
	return user

@app.delete('/users', tags=['users'])
def delete_user():
	try:
		return users.pop()
	except IndexError:
		raise HTTPException(status_code=404)


@app.delete('/purge/users', tags=['users'], deprecated=True)
def purge_users():
	"""Purge all users"""
	users.clear()



class Task(BaseModel):
	id:int
	user_id:int
	text:str

@app.get('/users/{user_id}/tasks/{task_id}', tags=['tasks'])
def get_task(user_id:int, task_id:int, page:int=0, done:bool=False) -> Task:
	"""
	Loads a task.
	You need to provide the id of the task.
	You can also provide a page number that does nothing.
	"""

	if task_id == 404:
		raise HTTPException(status_code=404)

	return Task(id=task_id, user_id=1, text='Kill Bastien')

import enum

class TaskStatus(enum.Enum):
	""""""
	TODO = "TODO"
	IN_PROGRESS = "IN_PROGRESS"
	DONE = "DONE"

@app.post('/users/{user_id}/tasks', tags=['tasks'])
def add_task(user_id:int, task_status:TaskStatus, text:str='Do something'):
	return None


class Tasks(BaseModel):
	tasks:list[Task]

@app.post('/tasks', tags=['tasks'])
def add_tasks(tasks:Tasks):
	return tasks


from datetime import datetime, date

class EmailConfidentiality(enum.Enum):
	"""Conidentiality level of the Email (C1 is most confidential)"""
	C1 = 'C1'
	C2 = 'C2'
	C3 = 'C3'

class EmailRequest(BaseModel):
	recipient:str
	subject:str
	date:date
	important:bool
	confidentiality:EmailConfidentiality

@app.post('/email', tags=['email'])
def send_email(email:EmailRequest):
	return {'status': 'ok'}


import json
@app.get('/file/{filename}')
def get_file(filename:str):
	with open('C:\\Users\\Bastien\\Downloads\\' + filename, 'r') as file:
		return json.load(file)

@app.get('/no-content', status_code=status.HTTP_204_NO_CONTENT)
def return_no_content():
	return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.get('/status/{status_code}', status_code=status.HTTP_404_NOT_FOUND)
def return_status(status_code:int):
	raise HTTPException(status_code=status_code)


@app.get("/items")
async def read_items(
	q: Annotated[str | None, Query(
		title="Query string",
		min_length=3,
		description="Query string for the items to search in the database that have a good match"
	)] = None
):
	results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
	if q:
		results.update({"q": q})
	return results
