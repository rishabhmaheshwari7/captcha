var count1=0,count2=0,flag = 0;

// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/0H0-1U6h/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {

        count1=0;count2=0;flag=0;

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        text = document.getElementById("text");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {

        for(let i=0;i<50;i++){
            webcam.update(); // update the webcam frame
            await predict();
        }
        // here we compare value of count1 and count2
        if(count1>count2){
           text.innerHTML="Done";
           document.getElementById("captcha").disabled = true;
           document.getElementById("submit").disabled = false;
           document.getElementById("webcam-container").removeChild(webcam.canvas);
        }else{
            text.innerHTML="Not Done";
            document.getElementById("webcam-container").removeChild(webcam.canvas);
        }
    }

    

    // rest of the prediction code

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                
                if(prediction[0].probability>0.70){
                    count1++;           
                }else{
                    count2++;
                }
        }
    }


