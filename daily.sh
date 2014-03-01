#!/bin/bash

PYTHON=`which python`
NODE=`which node`

WHOAMI=`${PYTHON} -c 'import os, sys; print os.path.realpath(sys.argv[1])' $0`
ROOT=`dirname ${WHOAMI}`

PUTTER=${ROOT}/putter.py
CALLER=${ROOT}/caller.py
SAYER=${ROOT}/sayer.js
SAYER_PID=${SAYER}.pid

VERBOSE="-v"

YMD=`date "+%Y-%m-%d"`
DAILY="${YMD}.xml"

CONFIG=${ROOT}/daily.cfg

if [ ! -f ${CONFIG} ]
then
    echo "Unabled to locate ${CONFIG}"
    exit
fi

source ${CONFIG}

echo "starting up sayer.js"
((${NODE} ${SAYER} --seed ${MRKVPH_SAYER_SEED} --port ${MRKVPH_SAYER_PORT} --name ${MRKVPH_SAYER_NAME}) & echo $! > ${SAYER_PID})

PID=`cat ${SAYER_PID}`
echo "sayer.js running with PID ${PID}"

echo "running putter.py"
${PUTTER} -u "${MRKVPH_SAYER_URL}" -k "${MRKVPH_AWS_KEY}" -s "${MRKVPH_AWS_SECRET}" -b "${MRKVPH_S3_BUCKET}" -n "${DAILY}" ${VERBOSE}

echo "running caller.py"
${CALLER} -s "${MRKVPH_TWILIO_SID}" -t "${MRKVPH_TWILIO_TOKEN}" -f "${MRKVPH_TWILIO_FROM}" -u "${MRKVPH_TWILIO_URL}" "${MRKVPH_TWILIO_TO}" ${VERBOSE}

echo "shutting down sayer.js"
kill ${PID}
rm ${SAYER_PID}

echo "done"
exit
