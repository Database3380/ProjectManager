var milliToTime = function(milliseconds) {
    // console.log(milliseconds);
   var x = Number(milliseconds) / 1000;

   var seconds = x % 60;
   x = Math.floor(x / 60);
   var minutes = x % 60;
   var hours = Math.floor(x / 60);

   return {
       hours,
       minutes,
       seconds
   };
}

module.exports = milliToTime;