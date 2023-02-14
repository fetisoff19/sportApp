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
