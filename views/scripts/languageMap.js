utils.getMappedValue = (function () {
  var cyrillicChars = '[ёґ]йцукенгшщзх[ъї]ф[ыі]вапролдж[эє]ячсмитьбю[ЁҐ]ЙЦУКЕНГШЩЗХ[ЪЇ]ФЫВАПРОЛДЖ[ЭЄ]ЯЧСМИТЬБЮ"',
    latinChars = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.~QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>@",
    engPattern = new RegExp('^[a-z !@#$%&*-_]+$', 'i'),
    mapObject = (function () {
      var map = {},
        indexEng = latinChars.length,
        indexCyr = cyrillicChars.length,
        currentCyrChar;

      while (indexEng--) {
        indexCyr--;

        currentCyrChar = cyrillicChars[indexCyr];

        if (currentCyrChar === ']') {
          indexCyr--;
          currentCyrChar = cyrillicChars[indexCyr];

          while (currentCyrChar !== '[') {
            map[currentCyrChar] = latinChars[indexEng];

            indexCyr--;
            currentCyrChar = cyrillicChars[indexCyr];

            if (!indexCyr) {
              break;
            }
          }
        } else if (currentCyrChar !== '[') {
          map[currentCyrChar] = latinChars[indexEng];
        }
      }

      return map;
    }());


  function getMappedValue(string) {
    var newValue = '',
      index = 0, max = string.length,
      isEnglish = true,
      char;

    if (!engPattern.test(string)) {
      for (; index < max; index++) {
        char = string[index];
        if (engPattern.test(char)) {
          newValue += char;
        } else {
          newValue += mapObject[char] || char;
          isEnglish = false;
        }
      }
    }

    return {
      text: newValue || string,
      isEnglish: isEnglish
    };
  }

  return getMappedValue;

}());
