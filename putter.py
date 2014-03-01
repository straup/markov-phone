#!/usr/bin/env python

import sys
import logging
import urllib

import boto.s3.connection
import boto.s3.key

if __name__ == '__main__':

    import optparse
    import sys

    parser = optparse.OptionParser()

    parser.add_option('-u', '--url', dest='url', action='store', help='The URL to fetch valid TwiML from')
    parser.add_option('-n', '--name', dest='name', action='store', help='The name of the file you want to save the contents of --url as')
    parser.add_option('-k', '--key', dest='key', action='store', help='Your AWS access key')
    parser.add_option('-s', '--secret', dest='secret', action='store', help='Your AWS access secret')
    parser.add_option('-b', '--bucket', dest='bucket', action='store', help='The AWS S3 bucket you want to save --name to')
    parser.add_option('-v', '--verbose', dest='verbose', action='store_true', default=False, help='be chatty (default is false)')
        
    opts, args = parser.parse_args()

    if opts.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)
    
    try:
        logging.debug("fetching rich and engaging content from %s" % opts.url)
        rsp = urllib.urlopen(opts.url)
    except Exception, e:
        logging.error(e)
        sys.exit(1)
    
    xml = rsp.read()
    logging.debug(xml)

    try:
        logging.debug("connect to S3")
        conn = boto.s3.connection.S3Connection(opts.key, opts.secret)
    except Exception, e:
        logging.error("failed to create S3 connection, %s" % e)
        sys.exit(1)

    try:
        logging.debug("get '%s' bucket" % opts.bucket)
        bucket = conn.get_bucket(opts.bucket)
    except Exception, e:
        logging.error("failed to create S3 bucket, %s" % e)
        sys.exit(1)

    try:
        logging.debug("write '%s' key" % opts.name)
        k = boto.s3.key.Key(bucket)
        k.key = opts.name
        k.set_metadata('Content-Type', 'text/xml')
        k.set_contents_from_string(xml)
        k.set_acl('public-read')
    except Exception, e:
        logging.error("failed to create S3 file, %s" % e)
        sys.exit(1)

    logging.info("done")
    sys.exit()
        
