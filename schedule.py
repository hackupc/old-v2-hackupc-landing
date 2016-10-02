#!/usr/bin/python

import json

def printEventList(events):
	for idx, event in enumerate(events):
		print u"({}) {}".format(idx, event['title'])


def add(modifier, index):
	pass


def remove(index):
	pass


def modify(events, args):
	event = events[int(args)]

	while True:
		print u"(1) title: {}".format(event[u'title'])
		print u"(2) begin: {}".format(event[u'begin'])
		print u"(3) end: {}".format(event[u'end'])
		print u"(4) place: {}".format(event[u'place'])

		inp = raw_input("modify> ")

		if inp == 'save':
			return event
		elif int(inp) == 1:
			event[u'title'] = raw_input("title> ")
		elif int(inp) == 2:
			event[u'begin'] = raw_input("begin> ")
		elif int(inp) == 3:
			event[u'end'] = raw_input("end> ")
		elif int(inp) == 4:
			event[u'place'] = raw_input("place> ")


def main():
	with open('./dist/assets/data/events.json') as data_file:    
	    data = json.load(data_file)

	events = data['events']
	printEventList(events)

	exit = False
	while not exit:
		inp = raw_input("> ")

		command, args = inp.split()

		if command is "add":
			add(args)
		elif command is "remove":
			remove(args)
		elif command == "modify":
			events[int(args)] = modify(events, args)
		elif command is "exit":
			with open('./dist/assets/data/events.json') as data_file:    
				json.dump(events, data_file)

			exit = True;


main()