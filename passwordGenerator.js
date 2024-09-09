// //////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ CUSTOM SLIDER ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const slider = document.querySelector('#charLengthSlider');
const sliderValue = document.querySelector('#charLength');
const rootStyles = getComputedStyle(document.documentElement);
const sliderEmtpyClr = rootStyles.getPropertyValue('--clr-bg-body').trim();
const sliderValueClr = rootStyles.getPropertyValue('--clr-green').trim();

// SET INITIAL SLIDER VALUE COUNT
sliderValue.textContent = slider.value;

// WHEN SLIDER VALUE CHANGES, UPDATE COUNT
['input', 'wheel'].forEach((inputMode) => {
  slider.addEventListener(inputMode, (event) => {
    const sliderPosition = event.target.value;

    sliderValue.textContent = sliderPosition;

    const progress = (sliderPosition / slider.max) * 100;

    slider.style.background = `linear-gradient(to right, ${sliderValueClr} ${progress}%, ${sliderEmtpyClr} ${progress}%)`;
  });
});
