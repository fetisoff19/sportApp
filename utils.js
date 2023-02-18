import { Decoder, Stream, Profile, Utils } from './modules/garmin-fit/index.js';

export async function parseFit(fitFile) {
  //console.time('response in');
  let fitBlob = await fitFile.arrayBuffer();
  const stream = Stream.fromByteArray(fitBlob);
  //console.log("isFIT (static method): " + Decoder.isFIT(stream));
  const decoder = new Decoder(stream);
  //console.log("isFIT (instance method): " + decoder.isFIT());
  //console.log("checkIntegrity: " + decoder.checkIntegrity());
  const { messages, errors } = decoder.read();
  if (errors.length>0) console.log(errors);
  //console.log(messages);
  //console.timeEnd('response in');
  return messages;
}


export async function sha256File(file) {
  const blob = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', blob);
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return digest;
}
