// const { Socket } = require("dgram");
let socket = io.connect("http://localhost:8080");

function deviceMotionRequest() {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission().then(function (permissionState) {
            if (permissionState === 'granted') {
                window.addEventListener("devicemotion", function (event) {
                    let x = event.accelerationIncludingGravity.x;
                    let y = event.accelerationIncludingGravity.y;
                    let z = event.accelerationIncludingGravity.z;

                    let motionData = {
                        x: x,
                        y: y,
                        z: z
                    };

                    let result1 = document.getElementById("result_acc");
                    result1.innerHTML = "重力加速度<br />" +
                        "X：" + motionData.x.toFixed(2) + "(m/s^2)<br />" +
                        "Y：" + motionData.y.toFixed(2) + "(m/s^2)<br />" +
                        "Z：" + motionData.z.toFixed(2) + "(m/s^2)<br />";

                });

                window.addEventListener("deviceorientation", function (event) {
                    let alpha = event.alpha;
                    let beta = event.beta;
                    let gamma = event.gamma;

                    let orientationData = {
                        alpha: alpha,
                        beta: beta,
                        gamma: gamma
                    };

                    var result2 = document.getElementById("result_gyro");
                    result2.innerHTML = "ジャイロセンサー<br />" +
                        "alpha：" + orientationData.alpha.toFixed(2) + "°<br />" +
                        "beta ：" + orientationData.beta.toFixed(2) + "°<br />" +
                        "gamma：" + orientationData.gamma.toFixed(2) + "°<br />";
                }, false);
            } // if (permissionState === 'granted')
        }).catch(console.error);
    } else {
        alert('DeviceMotionEvent.requestPermission is not found');
    }
}

// 声援入力
function check() {
    if (document.cheering_form.cheering.value === "") {
        alert("声援を入力してください");    //エラーメッセージを出力
    } else {
        console.log(document.cheering_form.cheering.value);
        socket.emit('cheering', document.cheering_form.cheering.value);
    }
}