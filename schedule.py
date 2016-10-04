#!/usr/bin/python

import json
import datetime
import hashlib
import re

class Event:
	_signature = ''
	_id = ''
	title = ''
	begin = None
	end = None
	place = ''
	type = ''

	time_format = re.compile('([0-9]+)?(h)?([0-9]+)?(m)?')

	eventDays = [
		datetime.datetime(2016, 10, 4),
		datetime.datetime(2016, 10, 7),
		datetime.datetime(2016, 10, 8),
		datetime.datetime(2016, 10, 9)
	]

	def new(self):
		self.title = raw_input("Title> ")
		self.place = raw_input("Place> ")
		self.begin = self.chooseDate()
		self.end = self.datePlusOffset(self.begin)
		self.type = "essential"

		self._id = self.getSignature()
		self._signature = self._id

		return self


	def datePlusOffset(self, date):
		offset = raw_input("Duration (XhYm)> ")
		matches = self.time_format.match(offset)

		hour = None
		minute = None

		if matches.group(2) == "h":
			hour = matches.group(1)

			if matches.group(4) == "m":
				minute = matches.group(3)
		elif matches.group(2) == "m":
			minute = matches.group(1)

		hour = 0 if hour == None else int(hour)
		minute = 0 if minute == None else int(minute)

		if not (hour == 0 and minute == 0):
			return date + datetime.timedelta(hours=hour, minutes=minute)
		return None


	def getSignature(self):
		signature_object = {}
		signature_object['title'] = self.title
		signature_object['place'] = self.place
		signature_object['begin'] = str(self.begin)
		signature_object['end'] = str(self.end)
		signature_object['type'] = self.type

		return hashlib.sha1(str(signature_object)).hexdigest()


	def updateSignature(self):
		if self._id == "":
			self._id = self.getSignature()

		self._signature = self.getSignature()


	def chooseDate(self):
		print "There are {} dates to choose from".format(len(self.eventDays))
		enumeratedDays = enumerate(self.eventDays)

		for idx, day in enumeratedDays:
			print u"({}) {}".format(idx, day)

		selectedDay = raw_input("Day> ")
		(hour, minute) = raw_input("Hour (HH:MM)> ").split(':')

		return self.eventDays[int(selectedDay)] + datetime.timedelta(hours=int(hour), minutes=int(minute))


	def chooseType(self):
		pass


	def to_json_object(self):
		json = {}
		json['_signature'] = self._signature
		json['_id'] = self._id
		json['title'] = self.title
		json['begin'] = str(self.begin)
		json['end'] = str(self.end)
		json['place'] = self.place
		json['type'] = self.type

		return json


	def from_json_object(self, json_val):
		self._signature = json_val['_signature']
		self._id = json_val['_id']
		self.title = json_val['title']
		self.begin = datetime.datetime.strptime(json_val['begin'], "%Y-%m-%d %H:%M:%S")
		self.end = datetime.datetime.strptime(json_val['end'], "%Y-%m-%d %H:%M:%S")
		self.place = json_val['place']
		self.type = json_val['type']

		return self

	def __str__(self):
		return self.title

	def __lt__(self, other):
		return self.begin < other.begin or self.end < other.end or self.title < other.title

	def __gt__(self, other):
		return self.begin > other.begin or self.end > other.end or self.title > other.title


class EventManager:
	fileName = None
	events = []

	def __init__(self, fileName):
		self.fileName = fileName

		with open(self.fileName) as dataFile:
			ev = json.load(dataFile)['events']
			
			for e in ev:
				tmp = Event().from_json_object(e)
				self.events.append(tmp)

		self.readCallLoop()


	def printEventList(self):
		for idx, event in enumerate(self.events):
			print u"({}) {}".format(idx, event)


	def readCallLoop(self):
		exit = False

		while not exit:
			self.printEventList()

			inp = raw_input("> ")

			command, args = inp.split()

			if command == "add":
				self.addEvent(args)
			elif command == "remove":
				self.remove(args)
			elif command == "modify":
				self.modify(args)
			elif command == "update":
				self.update(args)
			elif command == "exit":
				self.sortEvents()
				with open('./dist/assets/data/events.json', 'w+') as data_file:
					ev = {'events': []}
					for event in self.events:
					   	ev['events'].append(event.to_json_object())

					json.dump(ev, data_file, indent=2)

				exit = True;

			self.sortEvents()


	def addEvent(self, args):
		event = Event().new()
		self.events.append(event);


	def sortEvents(self):
		self.events.sort()


	def remove(self, index):
		del self.events[int(index)]


	def update(self, args):
		for idx, event in enumerate(self.events):
			self.events[idx].updateSignature()


	def modify(self, events, args):
		event = events[int(args)]

		while True:
			print u"(1) title: {}".format(event[u'title'])
			print u"(2) begin time: {}".format(event[u'begin'])
			print u"(3) end time: {}".format(event[u'end'])
			print u"(4) place: {}".format(event[u'place'])
			print u"(5) type: {}".format(event[u'type'])

			inp = raw_input("modify> ")

			if inp == 'save':
				return event
			elif int(inp) == 1:
				event[u'title'] = raw_input("modify - title> ")
			elif int(inp) == 2:
				event[u'begin'] = raw_input("modify - begin> ")
			elif int(inp) == 3:
				event[u'end'] = raw_input("modify - end> ")
			elif int(inp) == 4:
				event[u'place'] = raw_input("modify - place> ")
			elif int(inp) == 5:
				event[u'type'] = raw_input("modify - type> ")


def main():
	eventManager = EventManager('./dist/assets/data/events.json')

main()