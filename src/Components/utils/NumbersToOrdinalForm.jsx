const NumbersToOrdinalForm = (number) => {
  var ordinal = "";
  var ones = number % 10;
  var tens = Math.floor(number / 10) % 10;
  if (tens === 1) {
    ordinal = "th";
  } else {
    switch (ones) {
      case 1:
        ordinal = "st";
        break;
      case 2:
        ordinal = "nd";
        break;
      case 3:
        ordinal = "rd";
        break;
      default:
        ordinal = "th";
        break;
    }
  }
  return number + ordinal;
};

export default NumbersToOrdinalForm;
