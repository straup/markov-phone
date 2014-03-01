#!/usr/bin/env python

import sys
import logging

from twilio.rest import TwilioRestClient

if __name__ == '__main__':

    import optparse
    import sys

    parser = optparse.OptionParser()

    parser.add_option('-s', '--sid', dest='sid', action='store', help='Your Twilio account SID')
    parser.add_option('-t', '--token', dest='token', action='store', help='Your Twilio account token')
    parser.add_option('-f', '--from', dest='from_number', action='store', help='The Twilio phone number you want to call from')
    parser.add_option('-u', '--url', dest='url', action='store', help='The URL you want Twilio to fetch (and speak)')
    parser.add_option('-m', '--method', dest='method', action='store', default='GET', help='The HTTP method you want Twilio to use when fetching --url (default is GET)')
    parser.add_option('-v', '--verbose', dest='verbose', action='store_true', default=False, help='be chatty (default is false)')
        
    opts, args = parser.parse_args()

    if opts.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)
    
    for to_number in args:
        
        logging.info("call %s (%s)" % (to_number, opts.url))

        client = TwilioRestClient(opts.sid, opts.token)
        call = client.calls.create(to=to_number, from_=opts.from_number, url=opts.url, method=opts.method)

        # print dir(call)

    logging.info("done")
    sys.exit()
        
