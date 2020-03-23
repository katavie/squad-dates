/*
This is the Google Apps Script I used for sending out match emails
It contains some pretty horrifying JavaScript
*/

function sendEmails() {
  // get data from sheet
  var sheet = SpreadsheetApp.getActiveSheet(),
    startRow = 2, // index of first row of data to process
    numRows = 100, // number of rows to process
    numCols = 5,
    dataRange = sheet.getRange(startRow, 1, numRows, numCols), // row, col, numRows, numCols
    data = dataRange.getValues(); // fetch values for each row in the range

  // constants for all emails
  var SUBJECT = "Your match from Zoom University Squad Dates.";
  var options = {
    from: "", // the Gmail account executing this script must be able to send from this email
    name: "Squad Matchmaker",
    cc: ""
  };

  // name the columns for easier indexing
  var toEmail = 0, // means 1st column contains the recipient email
    toName = 1,
    about = 2,
    schools = 3,
    others = 4;

  // iterate over all rows
  for (var i = 0; i < data.length - 1; i++) {
    var row = data[i];
    var nextRow = data[i + 1];

    // first condition: make sure this isn't an empty row
    // second condition: make sure this is the first group in a pair (the next row shouldn't be empty)
    if (row[0] != "" && nextRow[0] != "") {
      // send message to first group in the pair
      options["htmlBody"] = createHtmlMessage(
        row[toName],
        nextRow[about],
        nextRow[schools],
        nextRow[toName],
        nextRow[toEmail],
        nextRow[others]
      );
      GmailApp.sendEmail(
        row[toEmail], // recipient email
        SUBJECT,
        createMessage(
          row[toName],
          nextRow[about],
          nextRow[schools],
          nextRow[toName],
          nextRow[toEmail],
          nextRow[others]
        ),
        options
      );

      // send message to second group in the pair
      options["htmlBody"] = createHtmlMessage(
        nextRow[toName],
        row[about],
        row[schools],
        row[toName],
        row[toEmail],
        row[others]
      );
      GmailApp.sendEmail(
        nextRow[0],
        SUBJECT,
        createMessage(
          nextRow[toName],
          row[about],
          row[schools],
          row[toName],
          row[toEmail],
          row[others]
        ),
        options
      );
    }
  }

  // helper functions to create email body
  function createMessage(
    recipientName,
    matchDescription,
    matchSchools,
    matchContactName,
    matchContactEmail,
    matchOtherMembers,
    html = false
  ) {
    return `Hi ${recipientName},${html ? "<br><br>" : "\n\n"}\
  Thank you for signing up for a friend group/squad date! \
  (${
    html
      ? '<a href="https://www.facebook.com/groups/zoommemes/permalink/254901278866018/">'
      : ""
  }original post${html ? "</a>" : ""} in Zoom Memes for Self Quaranteens)${
      html ? "<br><br>" : "\n\n"
    }\
  Here’s some (hopefully helpful) information about the friend group we matched you with:${
    html ? "<br><br>" : "\n\n"
  }\
  - Their ~vibes~: ${matchDescription}${html ? "<br><br>" : "\n\n"}\
  - Their school(s): ${matchSchools}${html ? "<br><br>" : "\n\n"}\
  - You can reach them through their point of contact: ${matchContactName} (${matchContactEmail})${
      html ? "<br><br>" : "\n\n"
    }
  - Other members: ${matchOtherMembers}${html ? "<br><br>" : "\n\n"}
  We hope you enjoy meeting each other! Feel free to reply to this email with any questions or feedback.${
    html ? "<br><br>" : "\n\n"
  }
  Stay healthy,${html ? "<br>" : "\n"}Squad Dates`;
  }

  function createHtmlMessage(
    recipientName,
    matchDescription,
    matchSchools,
    matchContactName,
    matchContactEmail,
    matchOtherMembers
  ) {
    return createMessage(
      recipientName,
      matchDescription,
      matchSchools,
      matchContactName,
      matchContactEmail,
      matchOtherMembers,
      (html = true)
    );
  }
}
