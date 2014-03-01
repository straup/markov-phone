# markov-phone

Markov bots. That robo-call you. As a service.

## sayer.js

This is the thing that generates the Markov texts and returns them as a valid [TwiML document](https://www.twilio.com/docs/api/twiml/say).

	$> node sayer.js --seed data/thisisaaronbot.txt --name 'Aaron Bot' --port 6677

For example:

	<Response>
		<Say>This is Aaron Bot, as a service.</Say>
		<Pause/>
		<Say>the set aside from the sky GOD LET bake for date taken justin bieber. earnest love you gotta wear glittery yet damien sacks hirst sippy</Say>
	</Response>

## caller.py

This is the thing that calls one or more people from your Twilio account. Note the part where we are passing the url for the `sayer.js` server. This is what will be sent to the phone numbers you've specified.

	$> python ./caller.py --sid TWILIO_SID --token TWILIO_TOKEN --from TWILIO_NUMBER --url http://example.com:6677 PHONENUMBER_ONE PHONENUMBER_TWO 

## Seed data

You can specify anything that the [node-markov](https://github.com/substack/node-markov) package can read. I've included the latest seed data for the [@thisisaaronbot](https://twitter.com/thisisaaronbot) Twitter account as an example.

## Why did you do this?

I was waiting for a small universe of Java stuff to finish downloading and installing itself. I figured I would do something... useful with the time.

## Requirements

### node.js

* [node-markov](https://github.com/substack/node-markov)
* [node-optimist](https://github.com/substack/node-optimist) - I just noticed this has been deprecated so patches are welcome.

### python

* [twilio-python](https://github.com/twilio/twilio-python)

## See also

* https://github.com/bertrandom/thisisaaronbot
