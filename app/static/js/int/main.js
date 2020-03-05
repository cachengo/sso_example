/*

>> kasperkamperman.com - 2018-04-18
>> https://www.kasperkamperman.com/blog/camera-template/

*/


video = document.getElementById('video');
var takePhotoButton;

var amountOfCameras = 0;
var currentFacingMode = 'self';

error_message = document.querySelector('#error-message');

function displayErrorMessage(error_msg, error) {
  error = error || "";
  if (error) {
    console.log(error);
  }
  error_message.innerText = error_msg;
  error_message.classList.add("visible");
}

document.addEventListener('DOMContentLoaded', function (event) {
  // do some WebRTC checks before creating the interface
  DetectRTC.load(function () {
    // do some checks
    if (DetectRTC.isWebRTCSupported == false) {
      alert(
        '111 Please use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher',
      );
      displayErrorMessage(' 1111  use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher')
    } else {
      if (DetectRTC.hasWebcam == false) {
        alert(' 2222 Please install an external webcam device. NoNoNoo');
        displayErrorMessage("2222 Please install an external webcam device.")
      } else {

        amountOfCameras = DetectRTC.videoInputDevices.length;
        //initCameraUI();
        initCameraStream();
      }
    }

  });
});

// https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js
function initCameraStream() {
  
  //  var size = 1280;
  var constraints = {
    audio: false,
    // video: true
    video: {
      // width: { ideal: size },
      // height: { ideal: size },
      //width: { min: 1024, ideal: window.innerWidth, max: 1920 },
      //height: { min: 776, ideal: window.innerHeight, max: 1080 },
      facingMode: currentFacingMode,
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);

  function handleSuccess(stream) {
    //window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
    video.play();

  }

  function handleError(error) {
    console.log(error);
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (error === 'PermissionDeniedError') {
      alert('Permission denied. Please refresh and give permission.');
      //displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
    }
  }
}


function takeSnapshot() {

  var hidden_canvas = document.querySelector('#hiddenCanvas')
    context = hidden_canvas.getContext('2d');
  
    

  var width = video.videoWidth;
  var height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // // Make a copy of the current frame in the video on the canvas.
    
    context.drawImage(video, 0, 0, width, height);

    //replace the video with the picture taken
    video.classList.add("hidden")
    hidden_canvas.classList.remove('hidden')
    

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    dataURL = hidden_canvas.toDataURL('image/png');
    //return dataURL
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
  }
}

// will use axios for this to be able to show wrong crredentials
function post(path, params, method) {
  method = method || "post"; // Set method to post by default if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

function signUp() {
  var endpoint = "/sign_up"
  var snap = takeSnapshot();
  var firstname = $('#firstname').val();
  var lastname = $('#lastname').val();
  var email = $('#email').val();

  data = {
    "img": snap,
    "firstname": firstname,
    "lastname": lastname,
    "email": email,
  }

  post(endpoint, data)
}

function login() {
  var endpoint = "/login"
  var snap = takeSnapshot();
  //console.log(snap)
  post(endpoint, {
    "img": snap
  })
  
}