let model;

const URL = "https://teachablemachine.withgoogle.com/models/%5B..?_sm_au_=iVVjLW8VQDtLf17P6qMcNKsqC313F";

const PREDICTION_CONFIDENCE_THRESHOLD = .6;

const CONSECUTIVE_CORRECT_PREDICTION_THRESHOLD = 5;

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

export async function predictAndInvokeHook(input, callback) {
  const prediction = await predict(input);
  updatePredictionList(prediction, callback);
}

export async function predict(input) {
  model = await getModel()
  const prediction = await model.predict(input);
  return prediction;
}

export function extractCategory(predictionList) {
  const prediction = predictionList.filter(category => category['probability'] > PREDICTION_CONFIDENCE_THRESHOLD)[0];
  return prediction['className'];
}

export async function getTotalClasses() {
  const model = await getModel();
  return model.getTotalClasses();
}

let lastFivePredictions = [];
async function updatePredictionList(prediction, callback) {
  model = await getModel();
  const category = extractCategory(prediction);
  if (lastFivePredictions.length >= CONSECUTIVE_CORRECT_PREDICTION_THRESHOLD) {
    lastFivePredictions.pop()
  }
  lastFivePredictions.unshift(category);
  if (lastFivePredictions.every((val, i, arr) => val === arr[0]) && lastFivePredictions.length === CONSECUTIVE_CORRECT_PREDICTION_THRESHOLD) {
    const postiveId = lastFivePredictions[0];
    callback(postiveId);
  }
}

async function getModel() {
  if (model) {
    return model;
  } else {
    return await tmImage.load(modelURL, metadataURL);
  }
}