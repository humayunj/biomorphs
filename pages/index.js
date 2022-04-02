import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// dynamic import for client side loading
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

function tree1(len) {
  this.line(0, 0, 0, -len);
}

function tree(len, lenDiff, levels, angle, angleDiff) {
  if (levels == 0) return;

  if (levels == 1) {
    tree1.call(this, len);
  } else {
    lenDiff = 1;
    angleDiff = 0;
    this.push();
    tree1.call(this, len * lenDiff);
    this.translate(0, -(len * lenDiff));
    this.rotate(this.radians(angle + angleDiff));
    tree.call(this, len * lenDiff, lenDiff, levels - 1, angle, angleDiff);
    this.rotate(this.radians((angle + angleDiff) * -2));
    tree.call(this, len * lenDiff, lenDiff, levels - 1, angle, angleDiff);
    this.pop();
  }
}
export default function Index(props) {
  const [parentTraits, setParentTraits] = useState({
    length: 10,
    lengthDiff: 0.6,
    levels: 1,
    angle: 30,
    angleDiff: 10,
  });
  const [traits, setTraits] = useState([]);
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    randomize(parentTraits);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.screen.width, window.screen.height - 200).parent(
      canvasParentRef
    );
  };
  const mouseClicked = (p5) => {
    const boxWidth = window.screen.width / 3;
    const boxHeight = (window.screen.height - 200) / 3;
    const row = Math.max(Math.ceil(p5.mouseY / boxHeight) - 1, 0);
    const col = Math.max(Math.ceil(p5.mouseX / boxWidth) - 1, 0);

    const selectedInd = row * 3 + col;

    setParentTraits(traits[selectedInd]);
    randomize(traits[selectedInd]);
    setGeneration((gen) => gen + 1);
  };

  const draw = (p5) => {
    p5.frameRate(10);
    p5.clear();
    // p5.background(255);
    if (traits.length == 0) return;
    // let a = (mouseX / width) * 90;

    const boxWidth = window.screen.width / 3;
    const boxHeight = (window.screen.height - 200) / 3;

    const _row = Math.max(Math.ceil(p5.mouseY / boxHeight) - 1, 0);
    const _col = Math.max(Math.ceil(p5.mouseX / boxWidth) - 1, 0);

    const selectedInd = _row * 3 + _col;
    p5.fill(255, 255, 255, 120);
    p5.stroke(0, 0, 0, 100);
    if (selectedInd >= 0 && selectedInd < 9)
      p5.rect(_col * boxWidth, _row * boxHeight, boxWidth, boxHeight);
    p5.stroke(0);

    p5.translate(0, boxHeight / 6);

    for (let rowInd = 0; rowInd < 3; rowInd++) {
      for (let colInd = 0; colInd < 3; colInd++) {
        const traitInd = rowInd * 3 + colInd;
        let trait = traits[traitInd];

        p5.translate(boxWidth / 2, boxHeight / 2);

        tree.call(
          p5,
          trait.length,
          trait.lengthDiff,
          trait.levels,
          trait.angle,
          trait.angleDiff
        );
        p5.translate(boxWidth / 2, -boxHeight / 2);
      }

      p5.translate(-boxWidth * 3, boxHeight);
    }

    // p5.noLoop();
  };
  const randomize = (_parentTraits) => {
    console.log("Rnd");
    const _traits = [];
    for (let i = 0; i < 9; i++) {
      if (i == 4) {
        _traits.push(_parentTraits);
        continue;
      }
      _traits.push({
        length: Math.round(
          _parentTraits.length +
            _parentTraits.length * (Math.random() * 0.3 - 0.15)
        ),
        lengthDiff:
          _parentTraits.lengthDiff +
          _parentTraits.lengthDiff * (Math.random() * 0.3 - 0.15),
        levels: Math.max(
          Math.round(_parentTraits.levels + (Math.random() * 2 - 1)),
          1
        ),

        angle:
          _parentTraits.angle +
          _parentTraits.angle * (Math.random() * 0.3 - 0.15),
        angleDiff:
          _parentTraits.angleDiff +
          _parentTraits.angleDiff * (Math.random() * 0.3 - 0.15),
      });
    }
    setTraits(_traits);
  };

  return (
    <div
      style={{
        background: "#ccc1 url('/grid.svg')",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
      <p style={{ userSelect: "none",color:"#333",fontWeight:"600",marginLeft:"10px" }}>
        Biomorphs Generation {generation.toLocaleString()}
      </p>
    </div>
  );
}
