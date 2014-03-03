# markov-phone

_"You do realise you just implemented the robocaller script that caused downfall of humanity in Dollhouse, right?" – [Dan Hon](https://twitter.com/hondanhon/status/439863765450764289)_

## What is this?

Markov bots. That robo-call you. As a service.

## sayer.js

This is the thing that generates the Markov texts and returns them as a valid [TwiML document](https://www.twilio.com/docs/api/twiml/say).

	$> node sayer.js --seed data/thisisaaronbot.txt --name 'Aaron Bot' --port 6677

For example:

	<Response>
		<Say>This is Aaron Bot, as a service.</Say>
		<Pause/>
		<Say>the set aside from the sky GOD LET bake for date taken justin bieber. earnest love you gotta wear glittery yet damien sacks hirst sippy.</Say>
	</Response>

You can also request a plain vanilla text version by passing in an `Accept: text/plain` HTTP header, like this:

	$> curl -H 'Accept: text/plain' http://localhost:6677
	oakland like is miller frank. internet in the hockey series will be in sydney.

If you need to run `sayer.js` as a specific user you can specify a `--uid` parameter, like this:

	$> sudo node sayer.js --seed data/thisisaaronbot.txt --name 'Aaron Bot' --uid 999

_Note the sudo-iness of that example which is just short-hand for "you'll still need suitable permissions to be able to do things like switch user IDs"._

## caller.py

This is the thing that calls one or more people from your Twilio account. Note the part where we are passing the url for the `sayer.js` server. This is what will be sent to the phone numbers you've specified.

	$> python ./caller.py --sid TWILIO_SID --token TWILIO_TOKEN --from TWILIO_NUMBER --url http://example.com:6677 PHONENUMBER_ONE PHONENUMBER_TWO 

## putter.py

This is a thing that will collect the output `sayer.js` and save it to an S3 bucket as a named key. This might be useful if you want to send the same message to a number of people.

	$> python putter.py -u http://localhost:6677 -k AWS_ACCESSKEY -s AWS_SECRETKEY -b S3_BUCKETNAME -n MARKOVPHONE.xml

## daily.sh

`daily.sh` is a simple shell script that wraps up all the other tools in "markov-phone" allowing them to be run every day as a cron job, or equivalent. Think of it as like a mailing-list but one that calls people.

It does the following:

* Reads configuration data from a [daily.cfg](https://github.com/straup/markov-phone/blob/master/daily.cfg.example) file. This contains things like the location of `sayer.js` seed data, your AWS and Twilio account credentials, the phone numbers you want to call to from and any other data specific to you.
* Starts up a copy of `sayer.js` on the local machine using a high-numbered TCP port.
* Runs the `putter.py` script to collect data from the freshly invoked `sayer.js` server, saving the results to Amazon's S3 service as file named after the current date (YYYY-MM-DD.xml).
* Runs the `caller.py` script to call one or more phone numbers using the Twilio API specifying the just created YYYY-MM-DD.xml file as its input.
* Stops the `sayer.js` server.

Here's an example of a `daily.cfg` file. Note that the `${ROOT}` and `${DAILY}` variables are defined in `daily.sh` script.

	# sayer.js configs

	MRKVPH_SAYER_NAME="Markov Bot"
	MRKVPH_SAYER_SEED=${ROOT}data/thisisaaronbot.txt
	MRKVPH_SAYER_HOST=localhost
	MRKVPH_SAYER_PORT=9922
	MRKVPH_SAYER_URL="http://${MRKVPH_SAYER_HOST}:${MRKVPH_SAYER_PORT}"

	# putter.py configs

	MRKVPH_AWS_KEY=S33KRET_AWS_KEY
	MRKVPH_AWS_SECRET=S33KRET_AWS_SECRET
	MRKVPH_S3_BUCKET=markovphone

	# caller.py configs

	MRKVPH_TWILIO_SID=S33KRET_TWILIO_SID
	MRKVPH_TWILIO_TOKEN=S33KRET_TWILIO_TOKEN
	MRKVPH_TWILIO_FROM=2025551212
	MRKVPH_TWILIO_TO=5145551212
	MRKVPH_TWILIO_URL="http://${MRKVPH_S3_BUCKET}.s3.amazonaws.com/${DAILY}"

## Seed data

You can specify anything that the [node-markov](https://github.com/substack/node-markov) package can read. I've included the latest seed data for the [@thisisaaronbot](https://twitter.com/thisisaaronbot) Twitter account and a still-needs-to-be-cleaned-up extract of Dan Hon's [Things That Have Caught My Attention](https://tinyletter.com/danhon) mailing list as examples.

## Why did you do this?

I was waiting for a small universe of Java stuff to finish downloading and installing itself. I figured I would do something... useful with the time.

## Requirements

### twilio

* A valid [Twilio](https://www.twilio.com/) account with enough credit to send outgoing phone calls.

### S3

_For use with `putter.py`_

* A valid [Amazon Web Services](https://aws.amazon.com/) account.

### node.js

* [node-markov](https://github.com/substack/node-markov)
* [node-optimist](https://github.com/substack/node-optimist) - I just noticed this has been deprecated so patches are welcome.

### python

* [twilio-python](https://github.com/twilio/twilio-python)

## See also

* https://github.com/bertrandom/thisisaaronbot
* https://tinyletter.com/danhon
