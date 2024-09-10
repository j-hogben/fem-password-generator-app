const generatePasswordForm = document.getElementById('generatorForm');

// //////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ COPY TO CLIPBOARD ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const textToCopy = document.getElementById('generatedPassword');
const copyButton = document.getElementById('copyButton');
const copiedConfirmation = document.getElementById('copied');

const removeCopiedConfirmation = () => copiedConfirmation.classList.add('display-none');

const copyText = () => {
  if (textToCopy.textContent.length > 0) {
    const clipboard = navigator.clipboard;
    clipboard.writeText(textToCopy.textContent);
    copied.classList.remove('display-none');
  }
};

copyButton.addEventListener('click', () => {
  copyText();
});

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ PASSWORD GENERATOR ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const uppercaseRanges = [[65, 90]];
const lowercaseRanges = [[97, 122]];
const numbersRanges = [[48, 57]];
const symbolsRanges = [
  [33, 47],
  [58, 64],
  [91, 96],
  [123, 126],
];

// INITIALISE EMPTY DATA OBJECT
let initialData = {
  passwordLength: 0,
  checked: [],
  possibleChars: [],
  passwordStrength: '',
};

// FUNCTION TO RUN ALL PARTS OF GENERATE PASSWORD FUNCTION
const generatePassword = () => {
  collectInitialData();
  if (initialData.passwordLength > 0 && initialData.checked.length > 0) {
    passwordGenerator();
    updatePasswordStrength();
  }
};

const updatePasswordStrength = () => {
  const strengthDescription = document.getElementById('strengthDescription');
  const passwordStrengthMeter = [
    [35, 'TOO WEAK!'],
    [59, 'WEAK'],
    [119, 'MEDIUM'],
    [Infinity, 'STRONG'],
  ];

  /* CALCULATION FOR PASSWORD STRENGTH, ACCORDING TO NORDVPN PASSWORD ENTROPY
  https://nordvpn.com/blog/what-is-password-entropy/?srsltid=AfmBOoq1C27JWpmLHqdqpYZshK90csznoHYobq7VPZhIm_0_YYYaFp58 */
  const length = initialData.passwordLength;
  const totalPossibleChars = initialData.possibleChars.reduce((a, b) => a + b.length, 0);
  const combinations = Math.pow(totalPossibleChars, length);
  const passwordEntropy = Math.log2(combinations).toFixed(2);

  // FIND STRENGTH DESCRIPTION USING FROM PASSWORDSTRENGTHMETER ARRAY
  initialData.passwordStrength =
    passwordStrengthMeter.find(([threshold, _]) => passwordEntropy <= threshold)?.[1] || 'UNKNOWN';
  // UPDATE DESCRIPTION
  strengthDescription.textContent = initialData.passwordStrength;

  // FUNCTION TO UPDATE STRENGTH BAR COLOURS
  const updateStrengthBarColors = (strengthDescription) => {
    const strengthBars = document.querySelectorAll('.strength');
    const strengthBarClasses = ['tooWeak', 'weak', 'medium', 'strong'];

    strengthBars.forEach((bar) => {
      strengthBarClasses.forEach((className) => {
        bar.classList.remove(className);
      });
      bar.classList.add('empty');
    });

    const updateBarColors = (num, color) => {
      for (let i = 0; i < num; i++) {
        strengthBars[i].classList.remove('empty');
        strengthBars[i].classList.add(color);
      }
    };

    // COMPARE STRENGTHDESCRIPTION TO CASES, UPDATE BAR COLORS ACCORDINGLY
    switch (strengthDescription) {
      case 'TOO WEAK!':
        updateBarColors(1, 'tooWeak');
        break;
      case 'WEAK':
        updateBarColors(2, 'weak');
        break;
      case 'MEDIUM':
        updateBarColors(3, 'medium');
        break;
      case 'STRONG':
        updateBarColors(4, 'strong');
        break;
      default:
        updateBarColors(4, 'empty');
    }
  };
  updateStrengthBarColors(initialData.passwordStrength);
};

const passwordGenerator = () => {
  const tempPasswordOutput = document.getElementById('tempPassword');
  const passwordOutputField = document.getElementById('generatedPassword');
  const possibleCharsLength = initialData.possibleChars.length;
  const passwordLength = initialData.passwordLength;
  let password = '';

  // FUNCTION TO GENERATE RANDOM NUMBER (TAKING A MAX ARGUMENT)
  const getrandomInt = (max) => Math.floor(Math.random() * max);

  for (let i = 0; i < passwordLength; i++) {
    const j = getrandomInt(possibleCharsLength);
    const k = getrandomInt(initialData.possibleChars[j].length);
    password += initialData.possibleChars[j][k];
  }

  tempPasswordOutput.style.display = 'none';
  passwordOutputField.textContent = password;
};

const collectInitialData = () => {
  // RESET INITIALDATA VALUES
  initialData.passwordLength = 0;
  initialData.checked = [];
  initialData.possibleChars = [];

  // FUNCTION TO ADD POSSIBLE CHARS TO INITITALDATA OBJECT
  const getPossibleChars = () => {
    // FILLS POSSIBLE CHARS WITH EACH CHAR OF GIVEN ARRAY
    const fillPossibleCharsArray = (arrayToSearch) => {
      let charsOfType = [];
      arrayToSearch.forEach((range) => {
        for (let i = range[0]; i <= range[1]; i++) {
          charsOfType.push(String.fromCharCode(i));
        }
      });
      initialData.possibleChars.push(charsOfType);
    };

    // FOR EACH ELEMENT IN THE 'CHECKED' ARRAY, FILL POSSIBLECHARS WITH THE CHARS FROM THE CORRESPONDING 'RANGES' ARAY
    initialData.checked.forEach((checkedItem) => {
      switch (checkedItem) {
        case 'uppercase':
          fillPossibleCharsArray(uppercaseRanges);
          break;
        case 'lowercase':
          fillPossibleCharsArray(lowercaseRanges);
          break;
        case 'numbers':
          fillPossibleCharsArray(numbersRanges);
          break;
        case 'symbols':
          fillPossibleCharsArray(symbolsRanges);
          break;
        default:
          console.log('ERROR: Invalid checkbox value!');
      }
    });
  };

  // FUNCTION TO ADD CHECKED BOX VALUES TO INITITALDATA OBJECT
  const getCheckedBoxes = () => {
    const checkedBoxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(
      (checkbox) => checkbox.checked
    );
    checkedBoxes.forEach((checked) => {
      initialData.checked.push(checked.value);
    });
  };

  // FUNCTION TO ADD PASSWORD LENGTH TO INITITALDATA OBJECT
  const getpasswordLength = () => {
    const passwordLength = document.getElementById('charLengthSlider').value;
    initialData.passwordLength = passwordLength;
  };

  // EXECUTE FUNCTIONS
  getpasswordLength();
  getCheckedBoxes();
  getPossibleChars();
};

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
['input', 'touchmove', 'wheel'].forEach((inputMode) => {
  slider.addEventListener(inputMode, (event) => {
    const sliderPosition = event.target.value;

    sliderValue.textContent = sliderPosition;

    const progress = (sliderPosition / slider.max) * 100;

    slider.style.background = `linear-gradient(to right, ${sliderValueClr} ${progress}%, ${sliderEmtpyClr} ${progress}%)`;
  });
});

// //////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ON GENERATE SUBMIT ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

generatePasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  removeCopiedConfirmation();
  generatePassword();
});
