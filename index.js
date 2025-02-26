const DECISION_THRESHOLD = 80;
let isAnimating = false;
let pullDeletax = 0; //distance que la card se esta arrastrando

const startDrag = (event) => {
  if (isAnimating) return;

  //get the firs article element
  const actulCard = event.target.closest("article");

  //get inicial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;

  //listem the mouse and touch movements
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(event) {
    //current position of mouseor finger
    const currentX = event.pageX ?? event.touches[0].pageX;
    //the distance betwwen the initial and current position
    pullDeletax = currentX - startX;
    //no hay distancia recorrido
    if (pullDeletax === 0) return;
    //calculate the rotation of thecard using the distance
    const deg = pullDeletax / 10;
    //apply the transfomration to the card
    actulCard.style.transform = `translateX(${pullDeletax}px) rotate(${deg}deg)`;
    //change the cursor to grabbing
    actulCard.style.cursor = "grabbing";

    //change opacity of the choise info
    const opacity = Math.abs(pullDeletax) / 100;
    const isRight = pullDeletax > 0;

    const choiseEl = isRight
      ? actulCard.querySelector(".choice.like")
      : actulCard.querySelector(".choice.nope");

    choiseEl.style.opacity = opacity;
  }
  function onEnd(event) {
    //remove the event listeners
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove, { passive: true });
    document.removeEventListener("touchend", onEnd, { passive: true });

    //saber si el ususario tomo una decision

    const decisionMade = Math.abs(pullDeletax) >= DECISION_THRESHOLD;
    if (decisionMade) {
      const goRight = pullDeletax >= 0;
      const goleft = !goRight;

      //add class acording to the decision
      actulCard.classList.add(goRight ? "go-right" : "go-left");
      actulCard.addEventListener("transitionend", () => {
        actulCard.remove();
      });
    } else {
      actulCard.classList.add("reset");
      actulCard.classList.remove("go-right", "go-left");
    }

    //reset the variables
    actulCard.addEventListener("transitionend", () => {
      actulCard.removeAttribute("style");
      actulCard.classList.remove("reset");

      pullDeletax = 0;
      isAnimating = false;
    });
  }
};

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
