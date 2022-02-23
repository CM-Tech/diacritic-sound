var dt = ["̄", "̅͡"];
var db = ["̱", "̲"];

var chars = document.getElementById("chars");
var amount = 32;

var audioContext = new window.AudioContext() || window.webkitAudioContext();
var audio = document.getElementById("audio");
var anim;
audio.pause();

window.addEventListener("load", function() {
    var analyser = audioContext.createAnalyser();
    var source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.smoothingTimeConstant = 0.6;
    analyser.fftSize = amount * 2;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
       
    var playing = false;
    
    window.addEventListener("click", function () {
      audioContext.resume();
        playing ? audio.pause() : audio.play();
        playing ? window.cancelAnimationFrame(anim) : update(analyser);
        playing = !playing;
    });

    window.addEventListener("beforeunload", function() {
        audio.pause();
        window.cancelAnimationFrame(anim);
        playing = false;
    });

    audio.play();
    update(analyser);
});

function update(analyser) {
    var freqArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqArray);
    var ac = "";
    var red = false;

    for (var i = amount / 8; i < (amount * 7 / 8); i++) {
        ac += ((audio.currentTime / audio.duration) < (i / (amount * 3 / 4)) ? "▓" : "░");
        for (var d = 0; d < freqArray[i]; d++) {
            ac += dt[Math.floor(Math.random() * 2)];
            ac += db[Math.floor(Math.random() * 2)];
        }
        if (freqArray[i] > 130) red = true;
    }
    if (red) {
        document.body.style.background = "black";
        chars.style.color = "white";
    } else {
        document.body.style.background = "white";
        chars.style.color = "black";
    }
    chars.innerText = ac;
    anim = window.requestAnimationFrame(update.bind(this, analyser));
}