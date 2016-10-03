#!/usr/bin/python

import json
import datetime
import hashlib

class EventManager:
	fileName = None
	events = []

	eventDays = [
		datetime.datetime(2016, 10, 7),
		datetime.datetime(2016, 10, 8),
		datetime.datetime(2016, 10, 9)
	]


	def __init__(self, fileName):
		self.fileName = fileName

		with open(self.fileName) as dataFile:    
	    	events = json.load(dataFile)['events']

	    self.readCallLoop()


	def printEventList():
	for idx, event in enumerate(self.events):
		print u"({}) {}".format(idx, event['title'])


	def readCallLoop(self):
		exit = False

		while not exit:
			inp = raw_input("> ")

			command, args = inp.split()

			if command is "add":
				self.add(args)
			elif command is "remove":
				self.remove(args)
			elif command == "modify":
				self.modify(args)
			elif command is "exit":
				with open('./dist/assets/data/events.json') as data_file:    
					json.dump(events, data_file)

				exit = True;


	def self.genID(event):
		pass


	def add(args):
		# Create new id



	def remove(index):
		pass


	def modify(events, args):
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