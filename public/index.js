const targetDate = new Date(2024, 2, 1, 0, 0, 0);

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector(".segment-display");
  const segmentDisplayTop = segmentDisplay.querySelector(
    ".segment-display__top"
  );
  const segmentDisplayBottom = segmentDisplay.querySelector(
    ".segment-display__bottom"
  );

  const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");
  const segmentOverlayTop = segmentOverlay.querySelector(
    ".segment-overlay__top"
  );
  const segmentOverlayBottom = segmentOverlay.querySelector(
    ".segment-overlay__bottom"
  );

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);

  if (
    parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue
  ) {
    return;
  }

  segmentElements.segmentOverlay.classList.add("flip");

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove("flip");
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  }

  segmentElements.segmentOverlay.addEventListener(
    "animationend",
    finishAnimation
  );
}

function updateTimeSection(sectionID, timeValue) {
  const firstNumber = Math.floor(timeValue / 10) || 0;
  const secondNumber = timeValue % 10 || 0;
  const sectionElement = document.getElementById(sectionID);
  const timeSegments = sectionElement.querySelectorAll(".time-segment");

  updateTimeSegment(timeSegments[0], firstNumber);
  updateTimeSegment(timeSegments[1], secondNumber);
}

function getTimeRemaining(targetDateTime) {
  const now = new Date();
  const complete = now >= targetDateTime;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      months: 0,
    };
  }

  const yearsDifference = targetDateTime.getFullYear() - now.getFullYear();
  const monthsDifference = targetDateTime.getMonth() - now.getMonth();
  const daysDifference = targetDateTime.getDate() - now.getDate();

  let months = yearsDifference * 12 + monthsDifference;
  let days = daysDifference;

  if (daysDifference < 0) {
    months -= 1;
    const previousMonthLastDate = new Date(
      targetDateTime.getFullYear(),
      targetDateTime.getMonth(),
      0
    );
    days = daysDifference + previousMonthLastDate.getDate();
  }

  const hours = targetDateTime.getHours() - now.getHours();
  const minutes = targetDateTime.getMinutes() - now.getMinutes();
  const seconds = targetDateTime.getSeconds() - now.getSeconds();

  return {
    complete,
    seconds: (seconds + 60) % 60,
    minutes: (minutes + 60) % 60,
    hours: (hours + 24) % 24,
    days,
    months,
  };
}

function updateAllSegments() {
  const timeRemainingBits = getTimeRemaining(targetDate);

  updateTimeSection("seconds", timeRemainingBits.seconds);
  updateTimeSection("minutes", timeRemainingBits.minutes);
  updateTimeSection("hours", timeRemainingBits.hours);
  updateTimeSection("days", timeRemainingBits.days);
  updateTimeSection("months", timeRemainingBits.months);

  return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
  const isComplete = updateAllSegments();

  if (isComplete) {
    clearInterval(countdownTimer);
  }
}, 1000);

updateAllSegments();
