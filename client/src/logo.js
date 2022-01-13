import Sketch from "react-p5";

export default function Logo() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth / 10, p5.windowHeight / 10).parent(
            canvasParentRef
        );
    };
    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth / 10, p5.windowHeight / 10);
    };

    const draw = (p5) => {
        //dp5.fill(value);
        p5.background("white");

        for (let i = 0; i < 50; i += 5) {
            p5.strokeWeight(1);
            p5.circle(p5.width - i * 2, p5.windowHeight / 20, i, i);
            p5.stroke(Math.random() * i, 50, 100);
            p5.fill(p5.random(255), p5.random(255), p5.random(255), i);
            p5.frameRate(1);
        }
    };

    return (
        <>
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </>
    );
}
