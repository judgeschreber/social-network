import Sketch from "react-p5";

export default function Animate() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(
            canvasParentRef
        );

        p5.noStroke();
    };
    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    const draw = (p5) => {
        //dp5.fill(value);

        //p5.fill("black");

        p5.background("white");

        for (let i = 0; i < p5.windowWidth; i += 5) {
            let color1 = Math.floor(Math.random() * 255);
            let color2 = Math.floor(Math.random() * 255);
            let color3 = Math.floor(Math.random() * 255);
            p5.stroke(color1, color2, color3);
            p5.bezier(
                i,
                p5.windowHeight,

                i,
                p5.windowHeight / 3,

                p5.mouseX,
                p5.mouseY,

                i,
                0
            );
        }

        p5.textFont("monospace", p5.windowWidth / 15);
        p5.text("Doodle\nwith\nfriends", 20, 110);

        p5.frameRate(30);

        //p5.ellipse(p5.mouseX, p5.mouseY, 33, 33);
    };

    return (
        <>
            <Sketch
                setup={setup}
                draw={draw}
                //mouseClicked={mouseClicked}
                windowResized={windowResized}
            />
        </>
    );
}
