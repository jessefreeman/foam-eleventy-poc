/*
  Date Formatter Filter for Nunjucks
*/
module.exports = function(date, format = "friendly") {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const ordinal = {
    1: "st",
    2: "nd",
    3: "rd",
    21: "st",
    22: "nd",
    23: "rd",
    31: "st"
  };

  const d = new Date(date);

  if (format === "iso") {
    // Return date in YYYY-MM-DD format
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Default to "friendly" format
  return month[d.getMonth()] + " " + d.getDate() + (ordinal[d.getDate()] || "th") + " " + d.getUTCFullYear();
};
