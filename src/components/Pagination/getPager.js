export const calculatePager = (lastPage, current, visible) => {
      let {
        aboveSpan,
        afterSpan,
        startNumer,
        endNumber
      } = {
        aboveSpan:false,
        afterSpan:false,
        startNumer:1+1,
        endNumber:lastPage-2
      }
      if( lastPage > visible ) {
       if(current > Math.floor(visible/2)) {
          aboveSpan = true;
          startNumer = current - 1
          endNumber =  Math.floor(visible/2)
          afterSpan = true
          const numbers = lastPage-(startNumer+endNumber);
          if(numbers <= 0) {
            startNumer = startNumer+numbers-1;
            afterSpan = false;
          }
          const addPage = (afterSpan)?0:1;
          endNumber = endNumber + addPage;
        } else {
          afterSpan = true;
          endNumber = visible-3;
        }
      }
      return {
        aboveSpan,
        afterSpan,
        startNumer,
        endNumber
      }
}