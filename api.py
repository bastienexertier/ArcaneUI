
import enum
from random import choice, randint
from typing import Annotated, Union

from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from starlette import status

from rich import print

app = FastAPI(
	title='My Task Manager',
	description='Une superbe application.'
)

origins = [
	'http://localhost:5173',
	'http://localhost:4173',
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=['*'],
	allow_headers=['*'],
)

@app.get('/print')
def _print(value:str='Hello, world!') -> str:
	return value

class UserGender(enum.Enum):
	"""The gender of the user"""
	MALE = 'Male'
	FEMALE = 'Female'

class Country(enum.Enum):
	"""Chose a country"""
	JAPAN='Japan'
	FRANCE='France'
	IRAK='Irak'

class Address(BaseModel):
	street_number:int
	country:Country

	@classmethod
	def create_random(cls):
		return cls(street_number=randint(100, 999), country=choice((Country.FRANCE, Country.JAPAN, Country.IRAK)))

class Test(BaseModel):
	address:Address

class User(BaseModel):
	name:str
	age:int
	gender:UserGender
	is_cool:bool
	user_address:Address
	mom_address:Address|None = Field(default=None, title="Mom Address")
	test:Test|None = Field(default=None, title="Test")
	siblings_adresses:list[Address]
	friends_adresses:list[Address]|None
	favorite_animal:str|None
	favorite_number:int|None = 5
	favorite_color:str|None = 'Red'

class UserOut(BaseModel):
	name:str
	age:int
	gender:UserGender
	is_cool:bool


class UserDeleteResponse(BaseModel):
	name:str


def random_user():
	return User(
		name=f"{choice(['Bastien', 'Eloise', 'Fanny', 'Quentin', 'Yasuto'])}_{randint(0, 1000)}",
		age=randint(20, 80),
		gender=choice((UserGender.MALE, UserGender.FEMALE)),
		is_cool=choice((True, False)),
		favorite_color=choice(('Red', 'Blue', 'Green')),
		user_address=Address.create_random(),
		mom_address=Address.create_random(),
		siblings_adresses=[]
	)

users = {user.name: user for user in [random_user() for _ in range(200)]}

class PageFilter(BaseModel):
	page_number:int = 0

	def filter(self, _users:list[User]) -> list[User]:
		size = 20
		return _users[self.page_number*size:(self.page_number+1)*size]


class GenderFilter(BaseModel):
	gender:UserGender

	def filter(self, _users:list[User]) -> list[User]:
		return [user for user in _users if user.gender == self.gender]

class CoolnessFilter(BaseModel):
	is_cool:bool

	def filter(self, _users:list[User]) -> list[User]:
		return [user for user in _users if user.is_cool == self.is_cool]

class NameFilter(BaseModel):
	query:str

	def filter(self, _users:list[User]) -> list[User]:
		return [user for user in _users if self.query in user.name]

class Filters(BaseModel):
	"""
	Filter are really cool!
	"""
	page_filter:PageFilter
	gender_filter:GenderFilter|None
	coolness_filter:CoolnessFilter|None
	name_filter:NameFilter|None

	def filter(self, _users:list[User]) -> list[User]:
		for user_filter in [self.gender_filter, self.coolness_filter, self.name_filter, self.page_filter]:
			if user_filter:
				_users = user_filter.filter(_users)
		return _users


@app.post('/users/', response_model=list[UserOut], tags=['users'])
def get_users_multiple_filters(filters:Filters) -> list[UserOut]:
	"""Returns every registered user"""
	_users = list(users.values())
	if filters:
		_users = filters.filter(_users)
	return [UserOut(**u.dict()) for u in _users]

@app.post('/users/filter/1', response_model=list[UserOut], tags=['users'])
def get_users_one_filter(user_filter:GenderFilter|CoolnessFilter|NameFilter) -> list[UserOut]:
	"""Returns every registered user"""
	return [UserOut(**u.dict()) for u in user_filter.filter(list(users.values()))]

# @app.post('/users/filter/2', response_model=list[UserOut], tags=['users'])
# def get_users_zero_or_one_filter(user_filter:GenderFilter|None, coolness_filter:CoolnessFilter|None=None, name_filter:NameFilter|None=None) -> list[UserOut]:
# 	"""Returns every registered user"""
# 	_users = list(users.values())
# 	if user_filter:
# 		_users = user_filter.filter(_users)
# 	return [UserOut(**u.dict()) for u in _users]

@app.post('/users/filter/3', response_model=list[UserOut], tags=['users'])
def get_users_infinite_filters(user_filters:list[GenderFilter|CoolnessFilter|NameFilter]) -> list[UserOut]:
	"""Returns every registered user"""
	_users = list(users.values())
	for user_filter in user_filters:
		_users = user_filter.filter(_users)
	return [UserOut(**u.dict()) for u in _users]

# @app.get('/users/gender/{gender}', response_model=list[User], tags=['users'])
# def get_users_by_gender(gender:UserGender=UserGender.FEMALE) -> list[User]:
# 	"""Returns every registered user of the selected gender"""
# 	return [user for user in users.values() if user.gender == gender]

# @app.get('/users/coolness', response_model=list[UserOut], tags=['users'])
# def get_users_by_coolness(is_cool:bool) -> list[UserOut]:
# 	"""Returns every registered user that has the selected coolness"""
# 	return [UserOut(**user.dict()) for user in users.values() if user.is_cool == is_cool]

# @app.get('/users/query', response_model=list[UserOut], tags=['users'])
# def get_users_by_name_query(query:str|None='') -> list[UserOut]:
# 	"""Returns every registered user that has the given query in their name"""
# 	return [UserOut(**user.dict()) for user in users.values() if query in user.name]

@app.get('/users/{name}', response_model=User, tags=['users'])
@app.get('/users/{name}/info', response_model=User, tags=['users'], summary='User info')
def get_user(name:str) -> User:
	if name in users:
		return users[name]
	raise HTTPException(status_code=404, detail=f'No user has name "{name}"')

@app.get('/users/{name}/info/mom', response_model=Address|None, tags=['_users'])
def moms_address(name:str) -> Address|None:
	"""Returns the address of the user's mom"""
	if name in users:
		return users[name].mom_address
	raise HTTPException(status_code=404, detail=f'No user has name "{name}"')

@app.get('/users/{name}/info/foods', tags=['_users'])
def favorite_food(name:str) -> str:
	return f'{name} likes Burgers.'

@app.post('/users/{name}/info/foods/add', tags=['_users'])
def add_favorite_food(name:str, food:str) -> str:
	return f'{name} likes {food} too.'

@app.post('/users/{name}/money', tags=['_users'])
def give_money(name:str, amount:int) -> str:
	return f'You gave {amount}€ to {name}'

# @app.post('/users', response_model=User, tags=['users'])
# def post_user(user:User) -> User:
# 	"""Adds a new user"""
# 	print(user)
# 	users[user.name] = user
# 	return user

@app.post('/users/bulk', response_model=list[User], tags=['users'])
def add_users_in_bulk(users:list[User]) -> list[User]:
	"""Adds many new users"""
	print(users)
	return users

@app.post('/users/random', response_model=User, tags=['users'])
def post_random_user() -> User:
	"""Adds a new user"""
	user = random_user()
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
	"""The status of the task"""
	DEFAULT = "DEFAULT"
	TODO = "TODO"
	IN_PROGRESS = "IN_PROGRESS"
	DONE = "DONE"

class TaskIn(BaseModel):
	text:str
	status:TaskStatus = TaskStatus.TODO

class TaskOut(BaseModel):
	task_id:str
	name:str
	text:str
	status:TaskStatus = TaskStatus.TODO


@app.get('/users/{name}/tasks', tags=['tasks'])
def get_user_tasks(name:str) -> list[TaskOut]:
	return [
		TaskOut(task_id=1, name=name, text='Kill me', status=TaskStatus.DONE),
		TaskOut(task_id=2, name=name, text='Do stuff', status=TaskStatus.IN_PROGRESS)
	]

@app.get('/users/{name}/tasks/{task_id}', tags=['tasks'])
def get_task(name:str, task_id:int) -> TaskOut:
	return TaskOut(task_id=task_id, name=name, text='Do stuff', status=TaskStatus.IN_PROGRESS)

@app.post(
	'/users/{name}/tasks',
	tags=['tasks'],
	response_model=TaskOut,
	responses={
		200: {
			"model": TaskOut,
			"description": "Here is your task:",
		},
		404: {
			"description": "The requested task doesnt exist."
		}
	},
)
def add_task(name:str, task:TaskIn) -> TaskOut:
	"""
	# Get Task
	This menu is really well documented.  
	With this menu you can:
	- Make coffee
	- Kill dragons
	- And many more!

	**TODO**

	```python
	print("Hello, world!")
	```

	"""
	return TaskOut(task_id=555, name=name, text=task.text, status=task.status)

@app.delete('/users/{name}/tasks/{task_id}', tags=['tasks'])
def delete_task(name:str, task_id:int) -> str:
	return f'Deleted task {task_id} of user {name}'

@app.put('/users/{name}/tasks/{task_id}/complete')
def complete_task(name:str, task_id:int) -> TaskOut:
	return TaskOut(task_id=task_id, name=name, text='Do stuff', status=TaskStatus.DONE)

# @app.post('/users/{user_id}/tasks', tags=['tasks'])
# def add_task(user_id:int, task_status:TaskStatus, text:str='Do something') -> Task:
# 	return Task(user_id=user_id, text=text, status=task_status)


# @app.post('/tasks', tags=['tasks'])
# def add_tasks(tasks:list[Task]):
# 	return tasks

class BeepBoop(BaseModel):
	beep_boop_1:bool = False
	beep_boop_2:bool = False
	beep_boop_3:bool = True
	beep_boop_4:bool = False
	beep_boop_5:bool = True
	beep_boop_6:bool = False
	beep_boop_7:bool = False

@app.post('/thing', tags=['tasks'])
def does_beep_boop(o:BeepBoop) -> BeepBoop:
	"""This makes the computer goes 'beepboop'"""
	return o

from datetime import datetime, date





class EmailConfidentiality(enum.Enum):
	"""Conidentiality level of the Email (C1 is most confidential)"""
	C1 = 'C1'
	C2 = 'C2'
	C3 = 'C3'

class EmailRequest(BaseModel):
	recipient:EmailStr
	subject:str
	date:date
	important:bool
	confidentiality:EmailConfidentiality

@app.post('/email', tags=['email'])
def send_email(email:EmailRequest) -> EmailRequest:
	return email







import json
@app.get('/file')
def get_file(filename:Annotated[str, Query(max_length=50)]):
	with open('C:\\Users\\Bastien\\Downloads\\' + filename, 'r') as file:
		return json.load(file)

@app.get('/no-content', status_code=status.HTTP_204_NO_CONTENT)
def return_no_content():
	return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.get('/status/{status_code}', status_code=status.HTTP_404_NOT_FOUND)
def return_status(status_code:int):
	raise HTTPException(status_code=status_code)

@app.get('/exceptions')
def raise_exception():
	raise Exception('Raised it!')


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


class EquityType(BaseModel):
	"""Equities are defined by a price and historical dividends"""
	ticker:str
	price:float
	is_good:bool
	dividends:list[int]

class BondType(BaseModel):
	"""BondTypes are defined by a price, a maturity and historical coupons"""
	ticker:str
	maturity:int
	coupons:list[int]


class PortfolioType0(BaseModel):
	"""EquityType|BondType"""
	code:str
	holdings:EquityType|BondType

@app.post('/portfolios0', tags=['finance'])
def add_portfolio0(company:str, portfolio:PortfolioType0) -> PortfolioType0:
	return portfolio


class PortfolioType1(BaseModel):
	"""list[EquityType|BondType]"""
	code:str
	holdings:list[EquityType|BondType]

@app.post('/portfolios1', tags=['finance'])
def add_portfolio1(company:str, portfolio:PortfolioType1) -> PortfolioType1:
	return portfolio


class PortfolioType2(BaseModel):
	"""list[EquityType]|list[BondType]"""
	code:str
	holdings:list[EquityType]|list[BondType]

@app.post('/portfolios2', tags=['finance'])
def add_portfolio2(company:str, portfolio:PortfolioType2) -> PortfolioType2:
	return portfolio


class PortfolioType3(BaseModel):
	"""list[EquityType]|BondType"""
	code:str
	holdings:list[EquityType]|BondType

@app.post('/portfolios3', tags=['finance'])
def add_portfolio3(company:str, portfolio:PortfolioType3) -> PortfolioType3:
	return portfolio


@app.get('/portfolios', tags=['finance'])
def get_portfolios(name:Annotated[list[str], Query()]) -> list[str]:
	print(name)
	return name

@app.post('/instruments', tags=['finance'])
def add_instrument(instrument:BondType|EquityType):
	print(instrument)
	return instrument

@app.get('/instruments/{id}', tags=['finance'])
def get_instrument(id:int|bool):
	return id

@app.post('/traders', tags=['finance'])
def add_traders(traders:list[User]):
	return traders

@app.post('/trailing_slash/', tags=['path'])
def trailing_slash(value:int):
	return value

## PARAMETERS

@app.get('/parameters/default_value', tags=['parameters'])
def default_value(name:Annotated[str, Query()]='Toto'):
	return name

@app.get('/parameters/array', tags=['parameters'])
def array(numbers:Annotated[list[int], Query()]):
	return {"result": sum(numbers)}

@app.get('/parameters/incorrect_return_value', tags=['parameters'])
def incorrect_return_value(numbers:Annotated[list[int], Query()]) -> int:
	return {"result": sum(numbers)}  # type: ignore[return-value]

@app.get('/parameters/union', tags=['parameters'])
def union(number:Annotated[int|bool, Query()]):
	return number

@app.get('/parameters/returns_array', tags=['parameters'])
def returns_array(up_to:int) -> list[int]:
	return list(range(up_to))

# class Division(BaseModel):
# 	dividend:int
# 	quotient:int

# @app.get('/maths/divide', tags=['maths'])
# def divide(division:Annotated[Division, Query()]) -> float:
# 	return division.dividend/division.quotient


