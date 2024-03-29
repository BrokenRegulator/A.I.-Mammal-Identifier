var turnWebcamOn, isWebcamOn, turnWebcamOff;

(function () {

  let webcam, model;


  function handlePositiveIdentification(dog) {
    if (!isWebcamOn) {

    } return;
  }


  turnWebcamOn = async function turnWebcamOn() {
    isWebcamOn = true;
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    window.requestAnimationFrame(loop);

    toggleButtons();

    webcamDisplay = document
      .getElementById("webcam-image-container")
      .appendChild(webcam.canvas);
  }

  /**
   * You probably don't need to touch this.
   * This function updates the webcam inputs and sends predictions to your model.
   */
  async function loop() {
    model = await getModel();
    webcam.update(); // update the webcam frame
    let prediction = await model.predictAndInvokeHook(webcam.canvas, handlePositiveIdentification);
    if (!isWebcamOn) return;
    window.requestAnimationFrame(loop);
  }

  /**
   * You probably don't need to touch this.
   * This disables the webcam on/off button as needed.
   */
  function toggleButtons() {
    let webcamOnButton = document.getElementById("webcam-on");
    let webcamOffButton = document.getElementById("webcam-off");
    webcamOnButton.disabled = !webcamOnButton.disabled;
    webcamOffButton.disabled = !webcamOffButton.disabled;
  }

  /**
   * You probably don't need to touch this.
   * This function turns the webcam off.
   */
  turnWebcamOff = async function turnWebcamOff() {
    isWebcamOn = false;
    webcam.stop();

    function removeAllChildren(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }

    let webcamImageContainer = document.getElementById("webcam-image-container");
    removeAllChildren(webcamImageContainer);
    let labelContainer = document.getElementById("webcam-label-container");
    removeAllChildren(labelContainer);

    toggleButtons();
  }

  /**
   * You don't need to touch this!
   * This loads your TeachableMachine model.
   */
  async function getModel() {
    if (model) {
      return model;
    }
    else {
      model = await import("./model.js");
      return model;
    }
  }

})();