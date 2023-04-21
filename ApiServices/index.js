import express from "express";
import { OpenAIApi, Configuration } from "openai";

// load .env variables
import * as dotenv from "dotenv";
dotenv.config();

// set-up OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const isHateSpeech = async (text) => {
  console.log("text:" + text);
  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt:
        "Respond with Yes or No: Does the following text contain hate speech?\n" +
        text,
      max_tokens: 150,
      temperature: 0.4, //lower temperature = more conservative, higher temperature = more creative
    })
    .then((response) => {
      return response.data.choices[0].text == "Yes";
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });
};

export default isHateSpeech;
