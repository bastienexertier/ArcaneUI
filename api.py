
import enum
from random import choice, randint
from typing import Annotated, Union

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

class UserGender(enum.Enum):
	"""The gender of the user"""
	MALE = 'Male'
	FEMALE = 'Female'

class User(BaseModel):
	name:str
	age:int
	gender:UserGender
	is_cool:bool
	favorite_color:str = 'Red'

class UserDeleteResponse(BaseModel):
	name:str

names = ['Bastien', 'Eloise', 'Fanny', 'Quentin', 'Yasuto']

def random_user(name:str):
	return User(
		name=f"{name}_{randint(0, 1000)}",
		age=randint(20, 80),
		gender=choice((UserGender.MALE, UserGender.FEMALE)),
		is_cool=choice((True, False)),
		favorite_color=choice(('Red', 'Blue', 'Green'))
	)

users = {user.name: user for user in map(random_user, names)}

@app.get('/users', response_model=list[User], tags=['users'])
def get_users() -> list[User]:
	"""Returns every registered user"""
	return list(users.values())

@app.get('/users/gender/{gender}', response_model=list[User], tags=['users'])
def get_users_by_gender(gender:UserGender) -> list[User]:
	"""Returns every registered user of the selected gender"""
	return [user for user in users.values() if user.gender == gender]

@app.get('/users/{name}', response_model=User, tags=['users'])
def get_user(name:str) -> User:
	if name in users:
		return users[name]
	raise HTTPException(status_code=404)

@app.post('/users', response_model=User, tags=['users'])
def post_user(user:User) -> User:
	"""Adds a new user"""
	users[user.name] = user
	return user

@app.post('/users/random', response_model=User, tags=['users'])
def post_random_user() -> User:
	"""Adds a new user"""
	name = choice(names)
	user = random_user(name)
	users[user.name] = user
	return user

@app.put('/users/{name}', tags=['users'])
def update_user(name:str, user:User) -> User:
	if name in users:
		users[name] = user
		return user

	raise HTTPException(status_code=404)

@app.delete('/users/{name}', tags=['users'])
def delete_user(name:str) -> UserDeleteResponse:
	if name in users:
		users.pop(name)
		return UserDeleteResponse(name=name)

	raise HTTPException(status_code=404)


@app.delete('/purge/users', tags=['users'], deprecated=True)
def purge_users():
	"""Purge all users"""
	users.clear()



class TaskStatus(enum.Enum):
	""""""
	TODO = "TODO"
	IN_PROGRESS = "IN_PROGRESS"
	DONE = "DONE"

class Task(BaseModel):
	id:int
	user_id:int
	text:str
	status:TaskStatus = TaskStatus.TODO

@app.get(
	'/users/{user_id}/tasks/{task_id}',
	tags=['tasks'],
	response_model=Task,
	responses={
		200: {
			"model": Task,
			"description": "Here is your task:",
		},
		404: {
			"description": "The requested task doesnt exist."
		}
	},
)
def get_task(user_id:int, task_id:int, page:int=0, done:bool=False) -> Task:
	"""
	Loads a task.
	You need to provide the id of the task.
	You can also provide a page number that does nothing.
	"""

	if task_id == 404:
		raise HTTPException(status_code=404)

	return Task(id=task_id, user_id=1, text='Kill Bastien')


@app.post('/users/{user_id}/tasks', tags=['tasks'])
def add_task(user_id:int, task_status:TaskStatus, text:str='Do something'):
	return Task(id=0, user_id=user_id, text=text)


class Tasks(BaseModel):
	tasks:list[Task]

@app.post('/tasks', tags=['tasks'])
def add_tasks(tasks:Tasks):
	return tasks

class BeepBoop(BaseModel):
	toggle_1:bool = False
	toggle_2:bool = False
	toggle_3:bool = True
	toggle_4:bool = False
	toggle_5:bool = True
	toggle_6:bool = False
	toggle_7:bool = False

@app.post('/thing', tags=['tasks'])
def does_beep_boop(o:BeepBoop) -> BeepBoop:
	return o

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


class Equity(BaseModel):
	"""An Equity"""
	ticker:str
	price:float
	is_good:bool
	dividends:list[int]

class Bond(BaseModel):
	"""A Bond"""
	ticker:str
	maturity:int
	coupons:list[int]


class Portfolio(BaseModel):
	"""A portfolio"""
	code:str
	holdings:list[Equity]

@app.get('/instruments', tags=['finance'])
def get_instruments(name:list[str]) -> list[str]:
	return name

@app.post('/portfolio', tags=['finance'])
def add_portfolio(company:str, portfolio:Portfolio) -> Portfolio:
	return portfolio

@app.post('/instruments', tags=['finance'])
def add_instrument(instrument:Bond|Equity):
	print(instrument)
	return instrument

# class Derivative(BaseModel):
# 	name:str
# 	inner:Union['Derivative',None]

# @app.post('/instruments/derivative', tags=['instruments'])
# def add_derivative_instrument(derivative:Derivative):
# 	return derivative
