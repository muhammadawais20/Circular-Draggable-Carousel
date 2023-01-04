import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import "./Carousel.css";

function Carousel() {
  const pickerRef = useRef(null);
  const cellsRef = useRef([]);
  const proxyRef = useRef(null);

  const baseTl = useRef(gsap.timeline({ paused: true }));
  const animation = useRef(
    gsap
      .timeline({ repeat: -1, paused: true })
      .add(baseTl.current.tweenFromTo(1, 2))
      .progress(1)
  );

  useEffect(() => {
    console.clear();
    gsap.defaults({
      ease: "none",
    });

    const picker = pickerRef.current;
    const cells = cellsRef.current;
    const proxy = proxyRef.current;

    const cellWidth = window.innerWidth * 0.5;
    const rotation = -90;

    const numCells = cells.length;
    const cellStep = 1 / numCells;
    const wrapWidth = cellWidth * numCells;
    const wrapIndex = gsap.utils.wrap(0, cells.length);

    const baseTl = gsap.timeline({ paused: true });

    gsap.set(picker, {
      perspective: 1100,
      width: wrapWidth - cellWidth,
    });

    for (let i = 0; i < cells.length; i++) {
      initCell(cells[i], i);
    }

    const animation = gsap
      .timeline({ repeat: -1, paused: true })
      .add(baseTl.tweenFromTo(1, 2))
      .progress(1);

    gsap.registerPlugin(Draggable);

    const draggable = new Draggable(proxy, {
      allowContextMenu: true,
      type: "x",
      trigger: picker,
      inertia: true,
      onDrag: updateProgress,
      onThrowUpdate: updateProgress,
      snap: {
        x: snapX,
      },
      onDragEnd() {
        const i = wrapIndex(
          (-this.endX / wrapWidth) * cells.length - 5
        );
        console.log(i);
      },
    });

    function snapX(x) {
      return Math.round(x / cellWidth) * cellWidth;
    }

    function updateProgress() {
      let newProg = this.x / wrapWidth;
      newProg = newProg - Math.floor(newProg);
      animation.progress(newProg);
    }

    function initCell(element, index) {
      gsap.set(element, {
        width: cellWidth,
        scale: 0.5,
        rotation,
        x: -cellWidth,
      });

      const tl = gsap
        .timeline({ repeat: 1 })
        .to(element, 1, { x: `+=${wrapWidth}`, rotation: -rotation }, 0)
        .to(
          element,
          cellStep,
          { scale: 1, repeat: 1, yoyo: true },
          0.5 - cellStep
        );

      baseTl.add(tl, index * -cellStep);
    }
  }, []);

  return (
    <div className="container">
      <div ref={pickerRef} className="picker">
        {/* Render cells here and pass a ref to each one using the cellsRef array */}
        {["Card 1", "Card 2", "Card 3", "Card 4"].map((cardData, index) => (
          <div
            className="cell"
            ref={(el) => (cellsRef.current[index] = el)}
            style={{ backgroundColor: "gray" }}
          >
            <div>{cardData}</div>
          </div>
        ))}
        <div ref={proxyRef} />
      </div>
    </div>
  );
}

export default Carousel;
